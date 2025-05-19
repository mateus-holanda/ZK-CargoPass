"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, CheckCircle, AlertCircle, Search, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import enUS from '../../i18n/locales/en-US.json'
import ptBR from '../../i18n/locales/pt-BR.json'
import { api } from "@/lib/axios"
import { WalletConnect } from "@/components/ui/wallet-connect"
import { useWeb3 } from "@/hooks/useWeb3"
import { Noir } from "@noir-lang/noir_js"
import { UltraPlonkBackend } from "@aztec/bb.js"
import TaxCircuit from "../../../circuits/tax_validation/target/tax_validation.json"
import DateCircuit from "../../../circuits/date_validation/target/date_validation.json"
import CargoCircuit from "../../../circuits/cargo_validation/target/cargo_validation.json"
// import { zkVerifySession, CurveType, Library } from 'zkverifyjs';

const CIRCUITS = [
  {
    key: "tax",
    label: "Tax Validation",
    circuit: TaxCircuit,
  },
  {
    key: "date",
    label: "Date Validation",
    circuit: DateCircuit,
  },
  {
    key: "cargo",
    label: "Cargo Validation",
    circuit: CargoCircuit,
  },
]

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

interface ProofData {
  proof: string
  timestamp: string
  documentId: string
  verification_key: string
  circuitType?: string
}

export default function ValidatePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchHash, setSearchHash] = useState("")
  const [searchResult, setSearchResult] = useState<Document | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [validating, setValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null)
  const translations = language === 'en-US' ? enUS : ptBR
  const { toast } = useToast()
  const { address, isConnected } = useWeb3()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const userId = localStorage.getItem("zk-cargo-pass-user-id")
        if (!userId) return

        const response = await api.get('/document', {
          params: { userId }
        })
        setDocuments(response.data)
      } catch (error) {
        console.error('Error fetching documents:', error)
        setError(translations.validate.error.fetchError || 'Failed to fetch documents')
      }
    }

    fetchDocuments()
  }, [])

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  const handleSearch = async () => {
    if (!searchHash.trim()) {
      setError(translations.validate.error.enterHash)
      return
    }

    setSearching(true)
    setError("")
    setSearchResult(null)

    try {
      const userId = localStorage.getItem("zk-cargo-pass-user-id")
      if (!userId) {
        throw new Error('User ID not found')
      }

      const response = await api.get('/document', {
        params: { userId }
      })
      
      const foundDocument = response.data.find(
        (doc: Document) => doc.id && doc.id.toLowerCase().includes(searchHash.toLowerCase())
      )

      if (foundDocument) {
        setSearchResult(foundDocument)
      } else {
        setError(translations.validate.error.notFound)
      }
    } catch (error) {
      console.error('Error searching document:', error)
      setError(translations.validate.error.searchError || 'Failed to search document')
    } finally {
      setSearching(false)
    }
  }

  const handleProofFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProofFile(file)
      setValidationResult(null)
    }
  }

  const handleValidateProof = async () => {
    if (!proofFile) {
      setError("Please select a proof file")
      return
    }

    if (!isConnected || !address) {
      setError("Please connect your wallet first")
      return
    }

    setValidating(true)
    setError("")
    setValidationResult(null)

    try {
      // let session = await zkVerifySession.start().Volta().withWallet({
      //   accountAddress: address,
      //   source: "wallet"
      // });                           

      const proofText = await proofFile.text()
      const proofData: ProofData = JSON.parse(proofText)
      // const vkey = proofData.verification_key;

      // const { events, transactionResult } = await session
      //   .verify() // Optionally provide account address to verify("myaddress") if connected with multple accounts
      //   .ultraplonk() // Select the proof type (e.g., ultraplonk)
      //   .nonce(1) // Set the nonce (optional)
      //   .withRegisteredVk() // Indicate that the verification key is already registered (optional)
      //   .execute({
      //     proofData: {
      //       vk: vkey,
      //       proof: proofData.proof,
      //       publicSignals: publicSignals,
      //     },
      //     domainId: 42, // Optional domain ID for proof aggregation
      //   }); // Execute the verification with the provided proof data

      // Determine which circuit to use
      const circuitType = proofData.circuitType || "tax" // Default to tax circuit if not specified
      const selectedCircuit = CIRCUITS.find(c => c.key === circuitType)
      if (!selectedCircuit) {
        throw new Error("Invalid circuit type")
      }

      const circuit = selectedCircuit.circuit as any
      const backend = new UltraPlonkBackend(circuit.bytecode)

      const proofBytes = new Uint8Array(proofData.proof.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])

      const timestampNumeric = Math.floor(new Date(proofData.timestamp).getTime() / 1000).toString()

      const proofDataForVerification = {
        proof: proofBytes,
        publicInputs: [proofData.documentId, timestampNumeric, address]
      }

      const isValid = await backend.verifyProof(proofDataForVerification)

      setValidationResult({
        valid: isValid,
        message: isValid ? "Proof is valid" : "Proof is invalid"
      })

      if (isValid) {
        toast({
          title: "Success",
          description: "Proof validated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Proof validation failed",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error validating proof:', error)
      setError("Failed to validate proof")
      toast({
        title: "Error",
        description: "Failed to validate proof",
        variant: "destructive"
      })
    } finally {
      setValidating(false)
    }
  }

  const handleToggleStatus = async (docId: string) => {
    try {
      const doc = documents.find(d => d.id === docId)
      if (!doc) return

      const newStatus = doc.status === "verified" ? "pending" : "verified"
      
      await api.patch(`/document/${docId}`, {
        status: newStatus
      })

      const updatedDocuments = documents.map((doc) => {
        if (doc.id === docId) {
          if (searchResult && searchResult.id === docId) {
            setSearchResult({
              ...searchResult,
              status: newStatus,
            })
          }

          toast({
            title: newStatus === "verified" ? translations.validate.success.validated : translations.validate.success.markedPending,
            description: `${doc.name} has been ${newStatus === "verified" ? "validated" : "marked as pending"}.`,
          })

          return {
            ...doc,
            status: newStatus,
          }
        }
        return doc
      })

      setDocuments(updatedDocuments)
    } catch (error) {
      console.error('Error updating document status:', error)
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive"
      })
    }
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
        <h1 className="text-3xl font-bold tracking-tight">{translations.validate.title}</h1>
        <p className="text-gray-500">{translations.validate.subtitle}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{translations.validate.verifyDocument}</CardTitle>
          <CardDescription>{translations.validate.verifyDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {validationResult && (
            <Alert variant={validationResult.valid ? "default" : "destructive"}>
              {validationResult.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{validationResult.valid ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{validationResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proof-file">Upload Proof File</Label>
              <div className="flex gap-2">
                <Input
                  id="proof-file"
                  type="file"
                  accept=".json"
                  onChange={handleProofFileChange}
                  className="flex-1"
                />
                <Button
                  onClick={handleValidateProof}
                  disabled={!proofFile || validating || !isConnected}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {validating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Validating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Validate Proof
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hash">{translations.validate.documentHash}</Label>
              <div className="flex gap-2">
                <Input
                  id="hash"
                  placeholder={translations.validate.enterHash}
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                />
                <Button
                  onClick={handleSearch}
                  disabled={searching || !searchHash.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {searching ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      {translations.validate.searching}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {translations.validate.verify}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {searchResult && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="font-medium">{translations.validate.documentFound}</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{searchResult.name}</p>
                      <p className="text-xs text-gray-500">
                        {translations.validate.uploadedOn} {new Date(searchResult.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">{translations.validate.status}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {searchResult.status === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <Badge
                          className={
                            searchResult.status === "verified"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {searchResult.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">{translations.validate.hash}</p>
                      <code className="text-xs bg-gray-100 p-1 rounded block mt-1 overflow-hidden text-ellipsis">
                        {searchResult.id}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{translations.validate.recentDocuments}</CardTitle>
          <CardDescription>{translations.validate.recentDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.filter((doc) => doc.id).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.validate.document}</TableHead>
                  <TableHead>{translations.validate.uploadDate}</TableHead>
                  <TableHead>{translations.validate.status}</TableHead>
                  <TableHead>{translations.validate.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents
                  .filter((doc) => doc.id)
                  .slice(0, 5)
                  .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            doc.status === "verified"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {doc.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            id={`toggle-${doc.id}`}
                            checked={doc.status === "verified"}
                            onCheckedChange={() => handleToggleStatus(doc.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">{translations.validate.noDocuments}</h3>
              <p className="text-gray-500 mt-2">{translations.validate.noDocumentsDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
