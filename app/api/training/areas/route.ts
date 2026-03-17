import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const areas = await sql`SELECT * FROM training_areas ORDER BY id`
    return NextResponse.json(areas)
  } catch (error) {
    console.error("Error fetching training areas:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
