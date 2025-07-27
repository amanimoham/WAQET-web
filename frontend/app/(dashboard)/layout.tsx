"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, selectedAirport } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (!selectedAirport) {
      router.push("/airport-selection")
    }
  }, [isAuthenticated, selectedAirport, router])

  if (!isAuthenticated || !selectedAirport) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">WAQET Admin Dashboard</h2>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
