"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import enUS from '../../i18n/locales/en-US.json'
import ptBR from '../../i18n/locales/pt-BR.json'

interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  status: string
  hash: string | null
}

export default function GenerateZKPPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("")
  const [generating, setGenerating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
  const translations = language === 'en-US' ? enUS : ptBR
  const { toast } = useToast()

  useEffect(() => {
    const storedDocuments = localStorage.getItem("zk-cargo-pass-documents")
    if (storedDocuments) {
      const parsedDocuments = JSON.parse(storedDocuments)
      const pendingDocuments = parsedDocuments.filter((doc: Document) => doc.status === "pending" || !doc.id)
      setDocuments(pendingDocuments)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  const generateHash = async (text: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return `0x${hashHex}`
  }

  const handleGenerateZKP = async () => {
    if (!selectedDocumentId) {
      setError(translations.generateZKP.error)
      return
    }

    setGenerating(true)
    setError("")

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Find the selected document
      const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId)
      if (!selectedDocument) {
        throw new Error(translations.generateZKP.error)
      }

      // Generate a hash for the document (simulating ZKP)
      const hash = await generateHash(selectedDocument.name + Date.now())

      // Update the document in localStorage
      const storedDocuments = JSON.parse(localStorage.getItem("zk-cargo-pass-documents") || "[]")
      const updatedDocuments = storedDocuments.map((doc: Document) => {
        if (doc.id === selectedDocumentId) {
          return {
            ...doc,
            hash,
            status: "verified",
          }
        }
        return doc
      })

      localStorage.setItem("zk-cargo-pass-documents", JSON.stringify(updatedDocuments))

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

      stats.zkProofsGenerated += 1
      localStorage.setItem("zk-cargo-pass-stats", JSON.stringify(stats))

      // Remove the processed document from the list
      setDocuments(documents.filter((doc) => doc.id !== selectedDocumentId))
      setSelectedDocumentId("")

      setSuccess(true)
      toast({
        title: translations.generateZKP.success,
        description: `Hash: ${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`,
      })

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setError(translations.generateZKP.error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end p-4">
        <button onClick={() => setLanguage('en-US')} className={`px-4 py-2 ${language === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>EN</button>
        <button onClick={() => setLanguage('pt-BR')} className={`px-4 py-2 ${language === 'pt-BR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>PT</button>
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

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{translations.generateZKP.success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="document">{translations.generateZKP.selectDocument}</Label>
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId} disabled={generating || success}>
              <SelectTrigger id="document">
                <SelectValue placeholder={translations.generateZKP.selectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-docs" disabled>
                    {translations.generateZKP.noDocuments}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedDocumentId && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  {(() => {
                    const doc = documents.find((d) => d.id === selectedDocumentId)
                    return doc ? (
                      <>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(2)} KB • Uploaded on{" "}
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </>
                    ) : null
                  })()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerateZKP}
            disabled={!selectedDocumentId || generating || success || documents.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {generating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {translations.generateZKP.generating}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {translations.generateZKP.cardTitle}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{translations.generateZKP.aboutTitle}</CardTitle>
          <CardDescription>{translations.generateZKP.aboutDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>{translations.generateZKP.aboutText1}</p>
            <p>{translations.generateZKP.aboutText2}</p>
            <p>{translations.generateZKP.aboutText3}</p>
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
              <Lock className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-xs">
                <strong>{translations.generateZKP.securityNote}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
