"use client"

import { usePathname, useRouter } from "next/navigation"
import { FileText, Lock, History, CheckCircle, Home, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import enUS from "../app/i18n/locales/en-US.json"
import ptBR from "../app/i18n/locales/pt-BR.json"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [language, setLanguage] = useState(localStorage.getItem("zk-cargo-pass-language") || "en-US")
  const translations = language === 'en-US' ? enUS : ptBR

  useEffect(() => {
    localStorage.setItem("zk-cargo-pass-language", language)
  }, [language])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const menuItems = [
    {
      title: translations.dashboardTitle,
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: translations.uploadDocument,
      icon: FileText,
      href: "/dashboard/upload",
      isActive: pathname === "/dashboard/upload",
    },
    {
      title: translations.generateZKP.title,
      icon: Lock,
      href: "/dashboard/generate-zkp",
      isActive: pathname === "/dashboard/generate-zkp",
    },
    {
      title: translations.viewHistory,
      icon: History,
      href: "/dashboard/history",
      isActive: pathname === "/dashboard/history",
    },
    {
      title: translations.validateSubmission,
      icon: CheckCircle,
      href: "/dashboard/validate",
      isActive: pathname === "/dashboard/validate",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2 cursor-pointer" onClick={() => router.push("/")}>
          <img src="/images/logo.png" alt="zkCargoPass Logo" className="h-8 w-auto" />
          <div className="text-lg text-[#3C3FB4]"><b>zkCargo</b>Pass</div>
        </div>
        <SidebarTrigger className="absolute right-2 top-3 md:hidden" /> 
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem className="my-1" key={item.title}>
              <SidebarMenuButton className="mx-3" asChild isActive={item.isActive} tooltip={item.title}>
                <a href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {translations.logout || "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
