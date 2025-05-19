"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, AlertCircle, CheckCircle, Download, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { WalletConnect } from "@/components/ui/wallet-connect"
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import { Noir } from "@noir-lang/noir_js"
import { UltraPlonkBackend } from "@aztec/bb.js"
import TaxCircuit from "../../../circuits/tax_validation/target/tax_validation.json"
import DateCircuit from "../../../circuits/date_validation/target/date_validation.json"
import CargoCircuit from "../../../circuits/cargo_validation/target/cargo_validation.json"
import enUS from '../../i18n/locales/en-US.json'
import ptBR from '../../i18n/locales/pt-BR.json'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

interface Document {
  id: string
  name: string
  status: string
  type: string
  size: number
  data: any
  createdAt: string
  deletedAt: string | null
  userId: string
}

// Circuit metadata and input mapping
const CIRCUITS = [
  {
    key: "tax",
    label: "Tax Validation",
    circuit: TaxCircuit,
    getInputs: (doc: Document) => ({
      total_declared_value: doc.data?.financial?.total_declared_value || 0,
      amount_paid: doc.data?.financial?.amount_paid || 0,
      tax_percentage: doc.data?.financial?.tax_percentage || 0,
    }),
  },
  {
    key: "date",
    label: "Date Validation",
    circuit: DateCircuit,
    getInputs: (doc: Document) => ({
      issue_date: doc.data?.date?.issue_date || 0,
      current_date: doc.data?.date?.current_date || 0,
      max_days_diff: doc.data?.date?.max_days_diff || 0,
    }),
  },
  {
    key: "cargo",
    label: "Cargo Validation",
    circuit: CargoCircuit,
    getInputs: (doc: Document) => ({
      unity_value: doc.data?.cargo?.unity_value || 0,
      quantity: doc.data?.cargo?.quantity || 0,
      total_declared_value: doc.data?.cargo?.total_declared_value || 0,
    }),
  },
]

export default function GenerateZKPPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
  const [selectedCircuitKey, setSelectedCircuitKey] = useState<string>(CIRCUITS[0].key)
  const [generating, setGenerating] = useState(false)
  const [generatedProof, setGeneratedProof] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const translations = language === 'en-US' ? enUS : ptBR

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      return
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()
    if (!["pdf"].includes(fileExtension || "")) {
      setError("Only .pdf files are supported")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError("")
  }

  const handleUploadAndGenerate = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setError("")

    try {
      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdfData = new Uint8Array(arrayBuffer)
      const loadingTask = getDocument({ data: pdfData })
      const pdf = await loadingTask.promise
      
      let extractedText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        extractedText += pageText + '\n\n'
      }

      // Upload and analyze document
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'pending',
        data: extractedText.trim(),
        userId: localStorage.getItem("zk-cargo-pass-user-id") || ""
      }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: JSON.stringify(fileData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload document')
      }

      const analysisData = await response.json()
      const documentId = Date.now().toString()

      const documents = JSON.parse(localStorage.getItem("zk-cargo-pass-documents") || "[]")
      const newDocument = {
        id: documentId,
        name: file.name,
        status: "pending",
        type: file.type,
        size: file.size,
        data: analysisData.data,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        userId: localStorage.getItem("zk-cargo-pass-user-id") || "",
      }
      documents.push(newDocument)
      localStorage.setItem("zk-cargo-pass-documents", JSON.stringify(documents))

      // Update stats
      const storedStats = localStorage.getItem("zk-cargo-pass-stats")
      const stats = storedStats
        ? JSON.parse(storedStats)
        : {
            documentsUploaded: 0,
            zkProofsGenerated: 0,
            validatedSubmissions: 0,
            pendingSubmissions: 0,
          }
      stats.documentsUploaded += 1
      stats.pendingSubmissions += 1
      localStorage.setItem("zk-cargo-pass-stats", JSON.stringify(stats))

      setUploadSuccess(true)
      toast({
        title: translations.documentUpload.success,
        description: translations.documentUpload.success,
      })

      // Generate ZKP
      setGenerating(true)
      try {
        const selectedCircuit = CIRCUITS.find(c => c.key === selectedCircuitKey)
        if (!selectedCircuit) {
          throw new Error("Circuit not found")
        }
        const circuit = selectedCircuit.circuit as any
        const noir = new Noir(circuit)
        const backend = new UltraPlonkBackend(circuit.bytecode)
        
        const inputs = selectedCircuit.getInputs(newDocument)
        const { witness } = await noir.execute(inputs)
        const proof = await backend.generateProof(witness)
        const proofHex = Array.from(new Uint8Array(proof.proof))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
        
        setGeneratedProof(proofHex)
        
        // Update document with proof
        const updatedDocuments = documents.map((doc: Document) => {
          if (doc.id === documentId) {
            return {
              ...doc,
              hash: proofHex,
              status: "verified",
            }
          }
          return doc
        })
        localStorage.setItem("zk-cargo-pass-documents", JSON.stringify(updatedDocuments))
        
        // Update stats
        stats.zkProofsGenerated += 1
        localStorage.setItem("zk-cargo-pass-stats", JSON.stringify(stats))
        
        toast({
          title: translations.generateZKP.success,
          description: `Proof: ${proofHex.substring(0, 10)}...${proofHex.substring(proofHex.length - 6)}`,
        })
      } catch (err) {
        console.error(err)
        setError(translations.generateZKP.error)
        setGeneratedProof("")
      } finally {
        setGenerating(false)
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing the file")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadProof = () => {
    if (!generatedProof) return
    
    const proofData = {
      proof: generatedProof,
      timestamp: new Date().toISOString(),
      documentName: file?.name
    }

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zk-proof-${file?.name}-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end p-4">
        <button onClick={() => setLanguage('en-US')} className={`px-4 py-2 ${language === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>EN</button>
        <button onClick={() => setLanguage('pt-BR')} className={`px-4 py-2 ${language === 'pt-BR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>PT</button>
        <div className="flex justify-end p-4"></div>
        <WalletConnect />
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{translations.generateZKP.title}</h1>
        <p className="text-gray-500">{translations.generateZKP.subtitle}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{translations.generateZKP.cardTitle}</CardTitle>
          <CardDescription>{translations.generateZKP.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{translations.documentUpload.success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">{translations.documentUpload.selectFile}</Label>
              <Input
                id="file"
                type="file"
                className="cursor-pointer"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                disabled={uploading || uploadSuccess}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="circuit">Select Circuit</Label>
              <Select
                value={selectedCircuitKey}
                onValueChange={setSelectedCircuitKey}
                disabled={uploading || uploadSuccess}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a circuit" />
                </SelectTrigger>
                <SelectContent>
                  {CIRCUITS.map((circuit) => (
                    <SelectItem key={circuit.key} value={circuit.key}>
                      {circuit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {file && (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB • {file.type || "Unknown type"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {generatedProof && (
              <div className="space-y-4">
                <Label>Generated Proof</Label>
                <Textarea
                  value={generatedProof}
                  readOnly
                  className="font-mono text-sm"
                  rows={4}
                />
                <Button
                  onClick={handleDownloadProof}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Proof
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUploadAndGenerate}
            disabled={!file || uploading || uploadSuccess}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploading || generating ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? translations.documentUpload.uploading : translations.generateZKP.generating}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Generate Proof
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{translations.documentUpload.guidelines.title}</CardTitle>
          <CardDescription>{translations.documentUpload.guidelines.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>{translations.documentUpload.guidelines.format}</li>
            <li>{translations.documentUpload.guidelines.size}</li>
            <li>{translations.documentUpload.guidelines.info}</li>
            <li>{translations.documentUpload.guidelines.security}</li>
            <li>{translations.documentUpload.guidelines.nextStep}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
