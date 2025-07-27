import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { flightNumber } = await request.json()

    if (!flightNumber) {
      return NextResponse.json({ success: false, message: "Flight number is required" }, { status: 400 })
    }

    // Mock GPU activation logic with delay to simulate real operation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      success: true,
      message: `GPU successfully activated for flight ${flightNumber}`,
      flightNumber,
      activatedAt: new Date().toISOString(),
      estimatedSavings: {
        co2: Math.floor(Math.random() * 20) + 30, // 30-50 kg
        fuel: Math.floor(Math.random() * 15) + 20, // 20-35 kg
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to activate GPU" }, { status: 500 })
  }
}
