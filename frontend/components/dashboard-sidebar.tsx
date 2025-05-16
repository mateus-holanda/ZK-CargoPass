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

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Document Upload",
      icon: FileText,
      href: "/dashboard/upload",
      isActive: pathname === "/dashboard/upload",
    },
    {
      title: "Generate ZKP",
      icon: Lock,
      href: "/dashboard/generate-zkp",
      isActive: pathname === "/dashboard/generate-zkp",
    },
    {
      title: "Submission History",
      icon: History,
      href: "/dashboard/history",
      isActive: pathname === "/dashboard/history",
    },
    {
      title: "Manual Validation",
      icon: CheckCircle,
      href: "/dashboard/validate",
      isActive: pathname === "/dashboard/validate",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <img src="/images/logo.png" alt="zkCargoPass Logo" className="h-8 w-auto" />
          <div className="font-bold text-lg">zkCargoPass</div>
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
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
