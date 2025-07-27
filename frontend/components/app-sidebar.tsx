"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Plane, MapPin, FileText, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Technician Flights",
    url: "/flights",
    icon: Plane,
  },
  {
    title: "Gates",
    url: "/gates",
    icon: MapPin,
  },
  {
    title: "Daily Reports",
    url: "/reports",
    icon: FileText,
  },
]

export function AppSidebar() {
  const { user, selectedAirport, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-4">
          <Image src="/images/waqet-logo.png" alt="WAQET Logo" width={100} height={100} className="object-contain" />
          <div>{selectedAirport && <p className="text-sm text-muted-foreground">{selectedAirport} Airport</p>}</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-4">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">ID: {user.employeeNumber}</p>
              </div>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
