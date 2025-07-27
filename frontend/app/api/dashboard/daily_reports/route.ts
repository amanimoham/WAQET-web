import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const airport = searchParams.get("airport")

    // Airport-specific data
    const airportData = {
      Riyadh: {
        todaysFlights: 89,
        activeGPUUnits: 28,
        totalFlights: 89,
        notificationsSent: 45,
        gpuActivations: 76,
      },
      Jeddah: {
        todaysFlights: 67,
        activeGPUUnits: 22,
        totalFlights: 67,
        notificationsSent: 34,
        gpuActivations: 58,
      },
      Dammam: {
        todaysFlights: 43,
        activeGPUUnits: 18,
        totalFlights: 43,
        notificationsSent: 28,
        gpuActivations: 39,
      },
    }

    const data = airportData[airport as keyof typeof airportData] || airportData.Riyadh

    return NextResponse.json({
      ...data,
      airport,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch daily reports" }, { status: 500 })
  }
}
