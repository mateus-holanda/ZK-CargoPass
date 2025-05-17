"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Loading from "../history/loading"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload document')
      }

      const analysisData = await response.json()

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

      const documents = JSON.parse(localStorage.getItem("zk-cargo-pass-documents") || "[]")
      documents.push({
        id: Date.now().toString(),
        name: file.name,
        status: "pending",
        type: file.type,
        size: file.size,
        data: analysisData,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        userId: localStorage.getItem("zk-cargo-pass-user-id") || "",
      })
      localStorage.setItem("zk-cargo-pass-documents", JSON.stringify(documents))

      setUploadSuccess(true)
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and analyzed successfully.",
      })

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while uploading the file")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Document Upload</h1>
        <p className="text-gray-500">Upload your customs documentation for processing</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Supported file formats: pdf</CardDescription>
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
              <AlertDescription>Document uploaded successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 hover:bg-gray-50 rounded-md p-2">
            <Label htmlFor="file">Select File</Label>
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
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading || uploadSuccess}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploading ? (
              <>
                <Loading />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
          <CardDescription>Follow these guidelines for successful document processing</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Ensure all documents are in the supported formats (.pdf)</li>
            <li>Files should not exceed 3MB in size</li>
            <li>Make sure documents contain all required information for customs clearance</li>
            <li>Sensitive information will be protected by zero-knowledge proofs</li>
            <li>After upload, proceed to the "Generate ZKP" section to create a proof</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
