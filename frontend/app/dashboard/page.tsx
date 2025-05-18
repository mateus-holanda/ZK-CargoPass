"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock, CheckCircle, Clock } from "lucide-react"
import enUS from '../i18n/locales/en-US.json';
import ptBR from '../i18n/locales/pt-BR.json';
import { api } from "@/lib/axios";
import { WalletConnect } from "@/components/ui/wallet-connect";

interface Document {
  id: string;
  name: string;
  status: string;
  type: string;
  size: number;
  data: any;
  createdAt: string;
}

export default function DashboardPage() {
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState({
    documentsUploaded: 0,
    zkProofsGenerated: 0,
    validatedSubmissions: 0,
    pendingSubmissions: 0,
  })
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US");
  const translations = language === 'en-US' ? enUS : ptBR;

  useEffect(() => {
    const user = localStorage.getItem("zk-cargo-pass-user-name")
    const storedUserId = localStorage.getItem("zk-cargo-pass-user-id")
    if (user) {
      setUsername(user)
    }
    if (storedUserId) {
      setUserId(storedUserId)
    }

    const sessionId = localStorage.getItem('zk-cargo-pass-session-id')
    if (sessionId) {
      api.defaults.headers.common['Cookie'] = `auth.sessionId=${sessionId}`
    }

    const fetchDocuments = async () => {
      try {
        const response = await api.get('/document', {
          params: {
            userId: userId
          }
        })
        const fetchedDocuments = response.data
        setDocuments(fetchedDocuments)
        
        const newStats = {
          documentsUploaded: fetchedDocuments.length,
          zkProofsGenerated: fetchedDocuments.filter((doc: Document) => doc.status === 'proof_generated').length,
          validatedSubmissions: fetchedDocuments.filter((doc: Document) => doc.status === 'validated').length,
          pendingSubmissions: fetchedDocuments.filter((doc: Document) => doc.status === 'pending').length,
        }
        setStats(newStats)
      } catch (error) {
        console.error('Error fetching documents:', error)
      }
    }

    if (userId) {
      fetchDocuments()
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  return (
    <div className="space-y-6">
      <div className="flex justify-end p-4">
        <button onClick={() => setLanguage('en-US')} className={`px-4 py-2 ${language === 'en-US' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>EN</button>
        <button onClick={() => setLanguage('pt-BR')} className={`px-4 py-2 ${language === 'pt-BR' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>PT</button>
        <div className="flex justify-end p-4"></div>
        <WalletConnect />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{translations.dashboardTitle}</h1>
        <p className="text-gray-500">{translations.welcomeBack}, {username || translations.user}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.documentsUploaded}</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentsUploaded}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.zkProofsGenerated}</CardTitle>
            <Lock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.zkProofsGenerated}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">{translations.validatedSubmissions}</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validatedSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{translations.pendingSubmissions}</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{translations.recentActivity}</CardTitle>
            <CardDescription>{translations.recentActions}</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.documentsUploaded + stats.zkProofsGenerated > 0 ? (
              <div className="space-y-4">
                {stats.documentsUploaded > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{translations.documentUploaded}</p>
                      <p className="text-xs text-gray-500">{translations.todayAt} {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
                {stats.zkProofsGenerated > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{translations.zkProofGenerated}</p>
                      <p className="text-xs text-gray-500">{translations.todayAt} {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{translations.noRecentActivity}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{translations.quickActions}</CardTitle>
            <CardDescription>{translations.commonTasks}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/upload")}
              >
                <FileText className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">{translations.uploadDocument}</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/generate-zkp")}
              >
                <Lock className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">{translations.generateZKP.title}</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/history")}
              >
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">{translations.viewHistory}</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/validate")}
              >
                <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">{translations.validateSubmission}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
