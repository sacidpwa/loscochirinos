import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const categories = await sql`
      SELECT * FROM categories ORDER BY name
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const result = await sql`
      INSERT INTO categories (name) VALUES (${name}) RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
