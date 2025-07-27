"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plane, Bell, Zap, Leaf, FileText, TrendingDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface DailyReportData {
  totalFlights: number
  notificationsSent: number
  gpuActivations: number
  co2Saved: number
  fuelSaved: number
}

interface FlightSummary {
  flightNumber: string
  origin: string
  destination: string
  co2Saved: number
  fuelSaved: number
  gpuUsed: boolean
  gate: string
}

interface EmissionData {
  month: string
  co2Reduction: number
  fuelReduction: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<DailyReportData | null>(null)
  const [flightSummary, setFlightSummary] = useState<FlightSummary[]>([])
  const [emissionData, setEmissionData] = useState<EmissionData[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedAirport } = useAuth()

  useEffect(() => {
    const fetchReportData = async () => {
      if (!selectedAirport) return

      try {
        setLoading(true)

        const [dailyResponse, sustainabilityResponse] = await Promise.all([
          fetch(`/api/dashboard/daily_reports?airport=${selectedAirport}`),
          fetch(`/api/dashboard/sustainability?airport=${selectedAirport}`),
        ])

        const dailyData = await dailyResponse.json()
        const sustainabilityData = await sustainabilityResponse.json()

        setReportData({
          totalFlights: dailyData.totalFlights || dailyData.todaysFlights || 0,
          notificationsSent: dailyData.notificationsSent || 0,
          gpuActivations: dailyData.gpuActivations || 0,
          co2Saved: sustainabilityData.co2Saved || 0,
          fuelSaved: sustainabilityData.fuelSaved || 0,
        })

        // Safely set flight summary with fallback to empty array
        setFlightSummary(sustainabilityData.flightSummary || [])
        setEmissionData(sustainabilityData.emissionTrend || sustainabilityData.monthlyTrend || [])
      } catch (error) {
        console.error("Failed to fetch report data:", error)
        // Set default values on error
        setFlightSummary([])
        setEmissionData([])
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [selectedAirport])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!reportData) {
    return <div>Failed to load report data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Daily Reports</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of daily operations and sustainability metrics for {selectedAirport} Airport
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flights Today</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reportData.totalFlights}</div>
            <p className="text-xs text-muted-foreground">All scheduled flights processed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications Sent</CardTitle>
            <Bell className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reportData.notificationsSent}</div>
            <p className="text-xs text-muted-foreground">System alerts and updates</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPU Activations</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{reportData.gpuActivations}</div>
            <p className="text-xs text-muted-foreground">Ground power units activated</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">{reportData.co2Saved.toLocaleString()} kg CO₂</div>
            <div className="text-lg font-bold text-blue-600">{reportData.fuelSaved.toLocaleString()} kg Fuel</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Flight Summary
            </CardTitle>
            <CardDescription>Today's flights with detailed sustainability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {flightSummary.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No flight summary data available for {selectedAirport} Airport</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Flight</TableHead>
                      <TableHead className="font-semibold">Route</TableHead>
                      <TableHead className="font-semibold">Gate</TableHead>
                      <TableHead className="font-semibold">CO₂ Saved</TableHead>
                      <TableHead className="font-semibold">Fuel Saved</TableHead>
                      <TableHead className="font-semibold">GPU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flightSummary.map((flight) => (
                      <TableRow key={flight.flightNumber} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {flight.origin} → {flight.destination}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{flight.gate}</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">{flight.co2Saved} kg</TableCell>
                        <TableCell className="text-blue-600 font-medium">{flight.fuelSaved} kg</TableCell>
                        <TableCell>
                          <Badge variant={flight.gpuUsed ? "default" : "secondary"}>
                            {flight.gpuUsed ? "✓ Used" : "✗ Not Used"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Emission Reduction Overview
            </CardTitle>
            <CardDescription>Monthly environmental impact trends for {selectedAirport} Airport</CardDescription>
          </CardHeader>
          <CardContent>
            {emissionData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No emission data available for {selectedAirport} Airport</p>
              </div>
            ) : (
              <ChartContainer
                config={{
                  co2Reduction: {
                    label: "CO₂ Reduction (kg)",
                    color: "hsl(142, 76%, 36%)",
                  },
                  fuelReduction: {
                    label: "Fuel Reduction (kg)",
                    color: "hsl(262, 83%, 58%)",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emissionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="co2Reduction"
                      fill="var(--color-co2Reduction)"
                      radius={[4, 4, 0, 0]}
                      name="CO₂ Reduction"
                    />
                    <Bar
                      dataKey="fuelReduction"
                      fill="var(--color-fuelReduction)"
                      radius={[4, 4, 0, 0]}
                      name="Fuel Reduction"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
