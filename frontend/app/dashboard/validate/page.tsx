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
import { FileText, CheckCircle, AlertCircle, Search } from "lucide-react"
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

export default function ValidatePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchHash, setSearchHash] = useState("")
  const [searchResult, setSearchResult] = useState<Document | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = localStorage.getItem("zk-cargo-pass-documents")
    if (storedDocuments) {
      const parsedDocuments = JSON.parse(storedDocuments)
      setDocuments(parsedDocuments)
    }
  }, [])

  const handleSearch = () => {
    if (!searchHash.trim()) {
      setError("Please enter a hash to search")
      return
    }

    setSearching(true)
    setError("")
    setSearchResult(null)

    // Simulate search delay
    setTimeout(() => {
      // Find document with matching hash
      const foundDocument = documents.find(
        (doc) => doc.hash && doc.hash.toLowerCase().includes(searchHash.toLowerCase()),
      )

      if (foundDocument) {
        setSearchResult(foundDocument)
      } else {
        setError("No document found with the provided hash")
      }

      setSearching(false)
    }, 1000)
  }

  const handleToggleStatus = (docId: string) => {
    // Update document status in localStorage
    const updatedDocuments = documents.map((doc) => {
      if (doc.id === docId) {
        const newStatus = doc.status === "verified" ? "pending" : "verified"

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

        if (newStatus === "verified") {
          stats.validatedSubmissions += 1
          stats.pendingSubmissions = Math.max(0, stats.pendingSubmissions - 1)
        } else {
          stats.validatedSubmissions = Math.max(0, stats.validatedSubmissions - 1)
          stats.pendingSubmissions += 1
        }

        localStorage.setItem("zk-cargo-pass-stats", JSON.stringify(stats))

        // Update search result if it's the same document
        if (searchResult && searchResult.id === docId) {
          setSearchResult({
            ...searchResult,
            status: newStatus,
          })
        }

        toast({
          title: `Document ${newStatus === "verified" ? "validated" : "marked as pending"}`,
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
    localStorage.setItem("zk-cargo-pass-documents", JSON.stringify(updatedDocuments))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manual Validation</h1>
        <p className="text-gray-500">Verify document authenticity and update status</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Verify Document</CardTitle>
          <CardDescription>Enter a document hash to verify its authenticity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="hash">Document Hash</Label>
            <div className="flex gap-2">
              <Input
                id="hash"
                placeholder="Enter document hash..."
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
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          {searchResult && (
            <div className="mt-6 border rounded-md overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="font-medium">Document Found</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{searchResult.name}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded on {new Date(searchResult.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Status</p>
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
                      <p className="text-gray-500">Hash</p>
                      <code className="text-xs bg-gray-100 p-1 rounded block mt-1 overflow-hidden text-ellipsis">
                        {searchResult.hash}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor="validate-toggle" className="cursor-pointer">
                      Mark as verified
                    </Label>
                    <Switch
                      id="validate-toggle"
                      checked={searchResult.status === "verified"}
                      onCheckedChange={() => handleToggleStatus(searchResult.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Recently processed documents that may need validation</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.filter((doc) => doc.hash).length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents
                  .filter((doc) => doc.hash) // Only show documents with a hash
                  .slice(0, 5) // Show only the 5 most recent
                  .map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
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
              <h3 className="text-lg font-medium">No documents to validate</h3>
              <p className="text-gray-500 mt-2">There are no documents with generated proofs that need validation.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
