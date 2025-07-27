import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const airport = searchParams.get("airport")

    // Airport-specific sustainability data
    const airportData = {
      Riyadh: {
        co2Saved: 1847,
        fuelSaved: 1123,
        monthlyTrend: [
          { date: "Jan", co2Saved: 1400, fuelSaved: 800 },
          { date: "Feb", co2Saved: 1550, fuelSaved: 900 },
          { date: "Mar", co2Saved: 1650, fuelSaved: 950 },
          { date: "Apr", co2Saved: 1750, fuelSaved: 1050 },
          { date: "May", co2Saved: 1847, fuelSaved: 1123 },
        ],
        flightSummary: [
          {
            flightNumber: "SV123",
            origin: "Dubai",
            destination: "Riyadh",
            co2Saved: 45,
            fuelSaved: 28,
            gpuUsed: true,
            gate: "A12",
          },
          {
            flightNumber: "MS456",
            origin: "Cairo",
            destination: "Riyadh",
            co2Saved: 38,
            fuelSaved: 22,
            gpuUsed: false,
            gate: "B05",
          },
          {
            flightNumber: "EK789",
            origin: "London",
            destination: "Riyadh",
            co2Saved: 52,
            fuelSaved: 31,
            gpuUsed: true,
            gate: "C08",
          },
        ],
        emissionTrend: [
          { month: "Jan", co2Reduction: 1400, fuelReduction: 800 },
          { month: "Feb", co2Reduction: 1550, fuelReduction: 900 },
          { month: "Mar", co2Reduction: 1650, fuelReduction: 950 },
          { month: "Apr", co2Reduction: 1750, fuelReduction: 1050 },
          { month: "May", co2Reduction: 1847, fuelReduction: 1123 },
        ],
      },
      Jeddah: {
        co2Saved: 1456,
        fuelSaved: 892,
        monthlyTrend: [
          { date: "Jan", co2Saved: 1100, fuelSaved: 650 },
          { date: "Feb", co2Saved: 1200, fuelSaved: 720 },
          { date: "Mar", co2Saved: 1300, fuelSaved: 780 },
          { date: "Apr", co2Saved: 1380, fuelSaved: 830 },
          { date: "May", co2Saved: 1456, fuelSaved: 892 },
        ],
        flightSummary: [
          {
            flightNumber: "SV234",
            origin: "Istanbul",
            destination: "Jeddah",
            co2Saved: 42,
            fuelSaved: 26,
            gpuUsed: true,
            gate: "A01",
          },
          {
            flightNumber: "TK654",
            origin: "Frankfurt",
            destination: "Jeddah",
            co2Saved: 48,
            fuelSaved: 29,
            gpuUsed: false,
            gate: "A04",
          },
          {
            flightNumber: "BA567",
            origin: "London",
            destination: "Jeddah",
            co2Saved: 55,
            fuelSaved: 33,
            gpuUsed: true,
            gate: "B04",
          },
        ],
        emissionTrend: [
          { month: "Jan", co2Reduction: 1100, fuelReduction: 650 },
          { month: "Feb", co2Reduction: 1200, fuelReduction: 720 },
          { month: "Mar", co2Reduction: 1300, fuelReduction: 780 },
          { month: "Apr", co2Reduction: 1380, fuelReduction: 830 },
          { month: "May", co2Reduction: 1456, fuelReduction: 892 },
        ],
      },
      Dammam: {
        co2Saved: 987,
        fuelSaved: 623,
        monthlyTrend: [
          { date: "Jan", co2Saved: 750, fuelSaved: 450 },
          { date: "Feb", co2Saved: 820, fuelSaved: 500 },
          { date: "Mar", co2Saved: 880, fuelSaved: 540 },
          { date: "Apr", co2Saved: 930, fuelSaved: 580 },
          { date: "May", co2Saved: 987, fuelSaved: 623 },
        ],
        flightSummary: [
          {
            flightNumber: "SV345",
            origin: "Kuwait",
            destination: "Dammam",
            co2Saved: 35,
            fuelSaved: 21,
            gpuUsed: false,
            gate: "A01",
          },
          {
            flightNumber: "EY456",
            origin: "Abu Dhabi",
            destination: "Dammam",
            co2Saved: 40,
            fuelSaved: 24,
            gpuUsed: true,
            gate: "A02",
          },
          {
            flightNumber: "QR789",
            origin: "Doha",
            destination: "Dammam",
            co2Saved: 38,
            fuelSaved: 23,
            gpuUsed: false,
            gate: "A05",
          },
        ],
        emissionTrend: [
          { month: "Jan", co2Reduction: 750, fuelReduction: 450 },
          { month: "Feb", co2Reduction: 820, fuelReduction: 500 },
          { month: "Mar", co2Reduction: 880, fuelReduction: 540 },
          { month: "Apr", co2Reduction: 930, fuelReduction: 580 },
          { month: "May", co2Reduction: 987, fuelReduction: 623 },
        ],
      },
    }

    const data = airportData[airport as keyof typeof airportData] || airportData.Riyadh

    return NextResponse.json({
      ...data,
      airport,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sustainability data" }, { status: 500 })
  }
}
