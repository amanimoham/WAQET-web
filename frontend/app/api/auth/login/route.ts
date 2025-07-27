import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { employeeNumber, password } = await request.json()

    // Mock authentication - in production, validate against database
    if (employeeNumber && password) {
      // Simulate different user types based on employee number
      const user = {
        id: "1",
        employeeNumber,
        name: employeeNumber.includes("admin") ? "Admin User" : "John Doe",
        organization: "WAQET Airport Operations",
        jobTitle: employeeNumber.includes("admin") ? "System Administrator" : "Airport Technician",
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid employee number or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
