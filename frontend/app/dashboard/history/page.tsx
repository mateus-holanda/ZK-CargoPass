"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Lock, CheckCircle, Clock, Search, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import enUS from '../../i18n/locales/en-US.json'
import ptBR from '../../i18n/locales/pt-BR.json'
import { api } from "@/lib/axios"
import { WalletConnect } from "@/components/ui/wallet-connect"

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

export default function HistoryPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const translations = language === 'en-US' ? enUS : ptBR

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const userId = localStorage.getItem("zk-cargo-pass-user-id")
        const sessionId = localStorage.getItem('zk-cargo-pass-session-id')
        
        if (sessionId) {
          api.defaults.headers.common['Cookie'] = `auth.sessionId=${sessionId}`
        }

        const response = await api.get('/document', {
          params: {
            userId: userId
          }
        })
        
        setDocuments(response.data)
        setFilteredDocuments(response.data)
      } catch (err) {
        console.error('Error fetching documents:', err)
        setError("Failed to load documents. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  useEffect(() => {
    // Filter documents based on search term
    if (searchTerm.trim() === "") {
      setFilteredDocuments(documents)
    } else {
      const filtered = documents.filter(
        (doc) =>
          doc.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.status.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredDocuments(filtered)
    }
  }, [searchTerm, documents])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
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
        <h1 className="text-3xl font-bold tracking-tight">{translations.history.title}</h1>
        <p className="text-gray-500">{translations.history.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.history.documentHistory}</CardTitle>
          <CardDescription>{translations.history.documentHistoryDescription}</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder={translations.history.searchPlaceholder}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Clock className="h-6 w-6 text-gray-400 animate-spin" />
              </div>
              <h3 className="text-lg font-medium">Loading documents...</h3>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-red-500">{error}</h3>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translations.history.document}</TableHead>
                  <TableHead>{translations.history.uploadDate}</TableHead>
                  <TableHead>{translations.history.status}</TableHead>
                  <TableHead>{translations.history.hashZkProof}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(doc.createdAt).toLocaleDateString()} {new Date(doc.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        {getStatusBadge(doc.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.id ? (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-green-600" />
                          <code className="text-xs bg-gray-100 p-1 rounded">
                            {doc.id.substring(0, 8)}...{doc.id.substring(doc.id.length - 6)}
                          </code>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">{translations.history.notGenerated}</span>
                      )}
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
              <h3 className="text-lg font-medium">{translations.history.noDocuments}</h3>
              <p className="text-gray-500 mt-2">
                {documents.length === 0
                  ? translations.history.noDocumentsUploaded
                  : translations.history.noDocumentsMatch}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{translations.history.blockchainVerification}</CardTitle>
          <CardDescription>{translations.history.blockchainDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              {translations.history.blockchainText}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  {translations.history.forImporters}
                </h3>
                <p className="text-xs text-gray-500">
                  {translations.history.importersText}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {translations.history.forCustoms}
                </h3>
                <p className="text-xs text-gray-500">
                  {translations.history.customsText}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
