"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Plane, Zap, Leaf, Fuel, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface DashboardData {
  todaysFlights: number
  activeGPUUnits: number
  co2Saved: number
  fuelSaved: number
}

interface SustainabilityTrend {
  date: string
  co2Saved: number
  fuelSaved: number
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [sustainabilityTrend, setSustainabilityTrend] = useState<SustainabilityTrend[]>([])
  const [loading, setLoading] = useState(true)
  const { selectedAirport } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!selectedAirport) return

      try {
        setLoading(true)

        // Fetch airport-specific data
        const [dailyResponse, sustainabilityResponse] = await Promise.all([
          fetch(`/api/dashboard/daily_reports?airport=${selectedAirport}`),
          fetch(`/api/dashboard/sustainability?airport=${selectedAirport}`),
        ])

        const dailyData = await dailyResponse.json()
        const sustainabilityData = await sustainabilityResponse.json()

        setDashboardData({
          todaysFlights: dailyData.todaysFlights,
          activeGPUUnits: dailyData.activeGPUUnits,
          co2Saved: sustainabilityData.co2Saved,
          fuelSaved: sustainabilityData.fuelSaved,
        })

        setSustainabilityTrend(sustainabilityData.monthlyTrend)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
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

  if (!dashboardData) {
    return <div>Failed to load dashboard data</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">{selectedAirport} Airport - Operations Overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Flights</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData.todaysFlights}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {selectedAirport} Airport only
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active GPU Units</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{dashboardData.activeGPUUnits}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Currently operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboardData.co2Saved.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              This month at {selectedAirport}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Saved</CardTitle>
            <Fuel className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardData.fuelSaved.toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              This month at {selectedAirport}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sustainability Trend - {selectedAirport} Airport
          </CardTitle>
          <CardDescription>Monthly CO₂ and fuel savings for {selectedAirport} operations</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              co2Saved: {
                label: "CO₂ Saved (kg)",
                color: "hsl(142, 76%, 36%)",
              },
              fuelSaved: {
                label: "Fuel Saved (kg)",
                color: "hsl(262, 83%, 58%)",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sustainabilityTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="co2Saved"
                  stroke="var(--color-co2Saved)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-co2Saved)", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="fuelSaved"
                  stroke="var(--color-fuelSaved)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-fuelSaved)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
