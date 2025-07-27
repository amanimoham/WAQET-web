"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, Settings, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Gate {
  gateNumber: string
  status: "available" | "occupied" | "maintenance"
  currentFlight?: string
  nextFlight?: string
  gpuConnected?: boolean
}

const AIRPORT_NAMES = {
  Riyadh: { code: "RUH", fullName: "King Khalid International Airport" },
  Jeddah: { code: "JED", fullName: "King Abdulaziz International Airport" },
  Dammam: { code: "DMM", fullName: "King Fahd International Airport" },
}

export default function GatesPage() {
  const [gates, setGates] = useState<Gate[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedAirport } = useAuth()

  useEffect(() => {
    const fetchGates = async () => {
      if (!selectedAirport) return

      try {
        setLoading(true)
        const airportCode = AIRPORT_NAMES[selectedAirport as keyof typeof AIRPORT_NAMES]?.code
        const response = await fetch(`/api/airports/${airportCode}/gates`)
        const data = await response.json()
        setGates(data.gates)
      } catch (error) {
        console.error("Failed to fetch gates:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGates()
  }, [selectedAirport])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "occupied":
        return "destructive"
      case "maintenance":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "occupied":
        return <Plane className="h-4 w-4" />
      case "maintenance":
        return <Settings className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!selectedAirport) {
    return <div>Please select an airport</div>
  }

  const airportInfo = AIRPORT_NAMES[selectedAirport as keyof typeof AIRPORT_NAMES]
  const availableGates = gates.filter((g) => g.status === "available").length
  const occupiedGates = gates.filter((g) => g.status === "occupied").length
  const maintenanceGates = gates.filter((g) => g.status === "maintenance").length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Airport Gates</h2>
        <p className="text-muted-foreground">Monitor gate availability at {selectedAirport} Airport</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardTitle className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-600" />
            <div>
              <div className="text-xl">{airportInfo?.fullName}</div>
              <div className="text-sm font-normal text-muted-foreground">
                {selectedAirport} ({airportInfo?.code})
              </div>
            </div>
          </CardTitle>
          <CardDescription className="flex gap-4 mt-2">
            <span className="text-green-600">Available: {availableGates}</span>
            <span className="text-red-600">Occupied: {occupiedGates}</span>
            <span className="text-yellow-600">Maintenance: {maintenanceGates}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {gates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No gates data available for {selectedAirport} Airport</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gates.map((gate) => (
                <div key={gate.gateNumber} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(gate.status)}
                      <span className="font-semibold">Gate {gate.gateNumber}</span>
                    </div>
                    <Badge variant={getStatusColor(gate.status)}>{gate.status}</Badge>
                  </div>

                  {gate.currentFlight && (
                    <div className="text-sm text-muted-foreground mb-1">
                      <strong>Current:</strong> {gate.currentFlight}
                    </div>
                  )}

                  {gate.nextFlight && (
                    <div className="text-sm text-muted-foreground mb-2">
                      <strong>Next:</strong> {gate.nextFlight}
                    </div>
                  )}

                  {gate.gpuConnected && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      GPU Connected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
