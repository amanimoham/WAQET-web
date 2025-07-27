"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

const AIRPORT_PINS = {
  Riyadh: "5555",
  Dammam: "6666",
  Jeddah: "7777",
}

const AIRPORTS = [
  { code: "RUH", name: "Riyadh", fullName: "King Khalid International Airport" },
  { code: "DMM", name: "Dammam", fullName: "King Fahd International Airport" },
  { code: "JED", name: "Jeddah", fullName: "King Abdulaziz International Airport" },
]

export default function AirportSelectionPage() {
  const [selectedAirport, setSelectedAirport] = useState("")
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { isAuthenticated, selectAirport } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!selectedAirport || !pin) {
      setError("Please select an airport and enter the PIN")
      setIsLoading(false)
      return
    }

    const correctPin = AIRPORT_PINS[selectedAirport as keyof typeof AIRPORT_PINS]

    if (pin !== correctPin) {
      setError("Invalid PIN for the selected airport")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API validation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      selectAirport(selectedAirport)
      router.push("/dashboard")
    } catch (error) {
      setError("Failed to validate airport access")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Image src="/images/waqet-logo.png" alt="WAQET Logo" width={120} height={120} className="object-contain" />
          </div>
          <CardTitle className="text-2xl">Select Airport</CardTitle>
          <CardDescription>
            Choose your assigned airport and enter the security PIN to access operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="airport">Airport Assignment</Label>
              <Select value={selectedAirport} onValueChange={setSelectedAirport} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your assigned airport" />
                </SelectTrigger>
                <SelectContent>
                  {AIRPORTS.map((airport) => (
                    <SelectItem key={airport.code} value={airport.name}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {airport.name} ({airport.code})
                        </span>
                        <span className="text-sm text-muted-foreground">{airport.fullName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">Security PIN</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter your 4-digit security PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Use the confidential PIN provided by your supervisor for airport access
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !selectedAirport || !pin}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating Access...
                </>
              ) : (
                "Access Operations"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
