import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const airportCode = params.code

    // Mock gates data for different airports
    const gatesData = {
      RUH: [
        { gateNumber: "A01", status: "occupied", currentFlight: "SV123", nextFlight: "MS789", gpuConnected: true },
        { gateNumber: "A02", status: "available", gpuConnected: true },
        { gateNumber: "A03", status: "occupied", currentFlight: "MS456", gpuConnected: false },
        { gateNumber: "A04", status: "maintenance", gpuConnected: false },
        { gateNumber: "A05", status: "available", gpuConnected: true },
        { gateNumber: "B01", status: "available", gpuConnected: true },
        { gateNumber: "B02", status: "occupied", currentFlight: "EK789", nextFlight: "QR456", gpuConnected: true },
        { gateNumber: "B03", status: "available", gpuConnected: true },
        { gateNumber: "B04", status: "occupied", currentFlight: "AF234", gpuConnected: true },
        { gateNumber: "C01", status: "available", gpuConnected: false },
        { gateNumber: "C02", status: "maintenance", gpuConnected: false },
        { gateNumber: "C03", status: "available", gpuConnected: true },
      ],
      JED: [
        { gateNumber: "A01", status: "occupied", currentFlight: "QR321", nextFlight: "TK123", gpuConnected: true },
        { gateNumber: "A02", status: "available", gpuConnected: true },
        { gateNumber: "A03", status: "available", gpuConnected: true },
        { gateNumber: "A04", status: "occupied", currentFlight: "TK654", gpuConnected: true },
        { gateNumber: "A05", status: "maintenance", gpuConnected: false },
        { gateNumber: "A06", status: "available", gpuConnected: true },
        { gateNumber: "A07", status: "occupied", currentFlight: "SV789", nextFlight: "MS234", gpuConnected: true },
        { gateNumber: "A08", status: "available", gpuConnected: false },
        { gateNumber: "B01", status: "available", gpuConnected: true },
        { gateNumber: "B02", status: "occupied", currentFlight: "EK456", gpuConnected: true },
        { gateNumber: "B03", status: "available", gpuConnected: true },
        { gateNumber: "B04", status: "occupied", currentFlight: "BA567", nextFlight: "LH890", gpuConnected: true },
        { gateNumber: "B05", status: "available", gpuConnected: false },
        { gateNumber: "B06", status: "available", gpuConnected: true },
        { gateNumber: "B07", status: "occupied", currentFlight: "AF123", nextFlight: "KL567", gpuConnected: true },
        { gateNumber: "B08", status: "maintenance", gpuConnected: false },
        { gateNumber: "C01", status: "available", gpuConnected: true },
        { gateNumber: "C02", status: "available", gpuConnected: true },
        { gateNumber: "C03", status: "occupied", currentFlight: "LH234", gpuConnected: true },
        { gateNumber: "C04", status: "available", gpuConnected: true },
        { gateNumber: "C05", status: "available", gpuConnected: true },
        { gateNumber: "C06", status: "occupied", currentFlight: "EY789", nextFlight: "QR456", gpuConnected: true },
        { gateNumber: "C07", status: "available", gpuConnected: false },
        { gateNumber: "C08", status: "available", gpuConnected: true },
      ],
      DMM: [
        { gateNumber: "A01", status: "available", gpuConnected: true },
        { gateNumber: "A02", status: "occupied", currentFlight: "SV345", nextFlight: "EY123", gpuConnected: true },
        { gateNumber: "A03", status: "available", gpuConnected: true },
        { gateNumber: "A04", status: "available", gpuConnected: true },
        { gateNumber: "A05", status: "occupied", currentFlight: "QR789", gpuConnected: true },
        { gateNumber: "A06", status: "maintenance", gpuConnected: false },
        { gateNumber: "A07", status: "available", gpuConnected: true },
        { gateNumber: "A08", status: "available", gpuConnected: false },
        { gateNumber: "B01", status: "occupied", currentFlight: "EY456", nextFlight: "SV234", gpuConnected: true },
        { gateNumber: "B02", status: "available", gpuConnected: true },
        { gateNumber: "B03", status: "available", gpuConnected: true },
        { gateNumber: "B04", status: "occupied", currentFlight: "KU567", gpuConnected: true },
        { gateNumber: "B05", status: "available", gpuConnected: true },
        { gateNumber: "B06", status: "available", gpuConnected: false },
        { gateNumber: "C01", status: "occupied", currentFlight: "LH987", nextFlight: "TK456", gpuConnected: true },
        { gateNumber: "C02", status: "available", gpuConnected: true },
        { gateNumber: "C03", status: "maintenance", gpuConnected: false },
        { gateNumber: "C04", status: "available", gpuConnected: true },
        { gateNumber: "C05", status: "available", gpuConnected: true },
        { gateNumber: "C06", status: "occupied", currentFlight: "MS234", gpuConnected: true },
      ],
    }

    const gates = gatesData[airportCode as keyof typeof gatesData] || []

    return NextResponse.json({
      airport: airportCode,
      gates,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gates data" }, { status: 500 })
  }
}
