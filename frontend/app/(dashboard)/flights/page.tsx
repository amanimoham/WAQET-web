"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Plane, Clock, CheckCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Flight {
  flightNumber: string
  origin: string
  gate: string
  gpuActivated: boolean
  acuActivated: boolean
  scheduledTime: string
  status: "scheduled" | "boarding" | "departed"
  airport: string
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [activatingGPU, setActivatingGPU] = useState<string | null>(null)
  const [activatingACU, setActivatingACU] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const { selectedAirport } = useAuth()

  useEffect(() => {
    const fetchFlights = async () => {
      if (!selectedAirport) return

      try {
        setLoading(true)
        const response = await fetch(`/api/flights/timeline?airport=${selectedAirport}`)
        const data = await response.json()
        setFlights(data.flights)
      } catch (error) {
        console.error("Failed to fetch flights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [selectedAirport])

  const handleActivateGPU = async (flightNumber: string) => {
    setActivatingGPU(flightNumber)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/flights/activate_gpu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber, airport: selectedAirport }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFlights((prev) =>
          prev.map((flight) => (flight.flightNumber === flightNumber ? { ...flight, gpuActivated: true } : flight)),
        )
        setSuccessMessage(`GPU successfully activated for flight ${flightNumber} at ${selectedAirport}`)
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Failed to activate GPU:", error)
    } finally {
      setActivatingGPU(null)
    }
  }

  const handleActivateACU = async (flightNumber: string) => {
    setActivatingACU(flightNumber)
    setSuccessMessage("")

    try {
      const response = await fetch("/api/flights/activate_acu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flightNumber, airport: selectedAirport }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFlights((prev) =>
          prev.map((flight) => (flight.flightNumber === flightNumber ? { ...flight, acuActivated: true } : flight)),
        )
        setSuccessMessage(`ACU successfully activated for flight ${flightNumber} at ${selectedAirport}`)
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (error) {
      console.error("Failed to activate ACU:", error)
    } finally {
      setActivatingACU(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "boarding":
        return "secondary"
      case "departed":
        return "outline"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Technician Flights</h2>
        <p className="text-muted-foreground">
          Manage GPU & ACU units for flights at {selectedAirport} Airport ({flights.length} flights)
        </p>
      </div>

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            {selectedAirport} Airport Operations
          </CardTitle>
          <CardDescription>Monitor and control GPU & ACU units for sustainable operations</CardDescription>
        </CardHeader>
        <CardContent>
          {flights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No flights scheduled for {selectedAirport} Airport today</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flights.map((flight) => (
                <Card
                  key={flight.flightNumber}
                  className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-blue-600">{flight.flightNumber}</CardTitle>
                      <Badge variant={getStatusColor(flight.status)} className="text-xs">
                        {flight.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Plane className="h-4 w-4" />
                      From {flight.origin} • Gate {flight.gate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Scheduled: {flight.scheduledTime}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">GPU Status</span>
                          <Badge variant={flight.gpuActivated ? "default" : "secondary"} className="text-xs">
                            {flight.gpuActivated ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              "Inactive"
                            )}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant={flight.gpuActivated ? "outline" : "default"}
                          onClick={() => handleActivateGPU(flight.flightNumber)}
                          disabled={flight.gpuActivated || activatingGPU === flight.flightNumber}
                          className="w-full"
                        >
                          {activatingGPU === flight.flightNumber ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Activating...
                            </>
                          ) : flight.gpuActivated ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-2" />
                              GPU Active
                            </>
                          ) : (
                            <>
                              <Zap className="h-3 w-3 mr-2" />
                              Activate GPU
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ACU Status</span>
                          <Badge variant={flight.acuActivated ? "default" : "secondary"} className="text-xs">
                            {flight.acuActivated ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              "Inactive"
                            )}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant={flight.acuActivated ? "outline" : "default"}
                          onClick={() => handleActivateACU(flight.flightNumber)}
                          disabled={flight.acuActivated || activatingACU === flight.flightNumber}
                          className="w-full"
                        >
                          {activatingACU === flight.flightNumber ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Activating...
                            </>
                          ) : flight.acuActivated ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-2" />
                              ACU Active
                            </>
                          ) : (
                            <>
                              <Zap className="h-3 w-3 mr-2" />
                              Activate ACU
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {(flight.gpuActivated || flight.acuActivated) && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          <span>
                            {flight.gpuActivated && flight.acuActivated
                              ? "Both systems active - Maximum efficiency"
                              : flight.gpuActivated
                                ? "GPU active - Power optimized"
                                : "ACU active - Climate controlled"}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
