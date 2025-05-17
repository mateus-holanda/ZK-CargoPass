"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Loading from "../history/loading"
import enUS from '../../i18n/locales/en-US.json'
import ptBR from '../../i18n/locales/pt-BR.json'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
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

      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      
      const loadingTask = getDocument({ data: pdfData });
      const pdf = await loadingTask.promise;
      
      let extractedText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText + '\n\n';

      }
      
      const fileData = { name: file.name, type: file.type, size: file.size, status: 'pending',  data:  extractedText.trim(), userId: localStorage.getItem("zk-cargo-pass-user-id") || "" }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: JSON.stringify(fileData)
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
        title: translations.documentUpload.success,
        description: translations.documentUpload.success,
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
      <div className="flex justify-end p-4">
        <button onClick={() => setLanguage('en-US')} className={`px-4 py-2 ${language === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>EN</button>
        <button onClick={() => setLanguage('pt-BR')} className={`px-4 py-2 ${language === 'pt-BR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>PT</button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{translations.documentUpload.title}</h1>
        <p className="text-gray-500">{translations.documentUpload.subtitle}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{translations.documentUpload.cardTitle}</CardTitle>
          <CardDescription>{translations.documentUpload.supportedFormats}</CardDescription>
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

          <div className="space-y-2 hover:bg-gray-50 rounded-md p-2">
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
                {translations.documentUpload.uploading}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {translations.documentUpload.uploadButton}
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
