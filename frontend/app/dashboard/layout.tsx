"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import Loading from "./history/loading"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("zk-cargo-pass-user-id")

    if (!user) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 p-6 md:p-8 pt-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
