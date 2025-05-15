"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = localStorage.getItem("zk-cargo-pass-documents")
    if (storedDocuments) {
      const parsedDocuments = JSON.parse(storedDocuments)
      // Filter for documents without a hash (not processed yet)
      const pendingDocuments = parsedDocuments.filter((doc: Document) => doc.status === "pending" || !doc.hash)
      setDocuments(pendingDocuments)
    }
  }, [])

  const generateHash = async (text: string) => {
    // Use Web Crypto API to generate SHA-256 hash
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)

    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    return `0x${hashHex}`
  }

  const handleGenerateZKP = async () => {
    if (!selectedDocumentId) {
      setError("Please select a document")
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
        throw new Error("Document not found")
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
        title: "ZK Proof generated successfully",
        description: `Hash: ${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`,
      })

      // Reset success state after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      setError("An error occurred while generating the ZK Proof")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate ZK Proof</h1>
        <p className="text-gray-500">Create zero-knowledge proofs for your documents</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Generate ZK Proof</CardTitle>
          <CardDescription>Select a document to generate a zero-knowledge proof</CardDescription>
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
              <AlertDescription>ZK Proof generated and stored on the blockchain!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="document">Select Document</Label>
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId} disabled={generating || success}>
              <SelectTrigger id="document">
                <SelectValue placeholder="Select a document" />
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
                    No pending documents
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
                Generating...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Generate ZK Proof
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>About Zero-Knowledge Proofs</CardTitle>
          <CardDescription>How zkCargoPass uses zero-knowledge proofs for secure verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Zero-knowledge proofs allow one party (the prover) to prove to another party (the verifier) that a
              statement is true without revealing any additional information.
            </p>
            <p>
              In zkCargoPass, we use ZK proofs to verify that your customs documentation is valid and compliant without
              revealing sensitive business information.
            </p>
            <p>
              The generated proof is stored on the Ethereum blockchain, providing an immutable record that can be
              verified by customs officials without compromising data privacy.
            </p>
            <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
              <Lock className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-xs">
                <strong>Security Note:</strong> Our ZK proofs use state-of-the-art cryptography to ensure that your data
                remains private while still being verifiable by authorized parties.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
