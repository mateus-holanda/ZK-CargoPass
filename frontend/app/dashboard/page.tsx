"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock, CheckCircle, Clock } from "lucide-react"

export default function DashboardPage() {
  const [username, setUsername] = useState("")
  const [stats, setStats] = useState({
    documentsUploaded: 0,
    zkProofsGenerated: 0,
    validatedSubmissions: 0,
    pendingSubmissions: 0,
  })

  useEffect(() => {
    // Get user from localStorage
    const user = localStorage.getItem("zk-cargo-pass-user")
    if (user) {
      setUsername(user)
    }

    // Get stats from localStorage or use defaults
    const storedStats = localStorage.getItem("zk-cargo-pass-stats")
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {username || "User"}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Uploaded</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentsUploaded}</div>
            {/* <p className="text-xs text-gray-500">+{Math.floor(Math.random() * 5)} from last week</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ZK Proofs Generated</CardTitle>
            <Lock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.zkProofsGenerated}</div>
            {/* <p className="text-xs text-gray-500">+{Math.floor(Math.random() * 5)} from last week</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-2">Validated Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validatedSubmissions}</div>
            {/* <p className="text-xs text-gray-500">+{Math.floor(Math.random() * 3)} from last week</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
            {/* <p className="text-xs text-gray-500">
              {Math.random() > 0.5 ? "+" : "-"}
              {Math.floor(Math.random() * 2)} from last week
            </p> */}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent actions in the system</CardDescription>
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
                      <p className="text-sm font-medium">Document uploaded</p>
                      <p className="text-xs text-gray-500">Today at {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
                {stats.zkProofsGenerated > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ZK Proof generated</p>
                      <p className="text-xs text-gray-500">Today at {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No recent activity to display</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/upload")}
              >
                <FileText className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">Upload Document</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/generate-zkp")}
              >
                <Lock className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">Generate ZKP</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/history")}
              >
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">View History</span>
              </div>
              <div
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => (window.location.href = "/dashboard/validate")}
              >
                <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-medium text-center">Validate Submission</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
