import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "birthdate", "nationalId", "organization", "jobTitle", "employeeNumber", "password"]
    const missingFields = requiredFields.filter((field) => !userData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Mock user creation - in production, save to database
    const newUser = {
      id: Date.now().toString(),
      employeeNumber: userData.employeeNumber,
      name: userData.name,
      organization: userData.organization,
      jobTitle: userData.jobTitle,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
