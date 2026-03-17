import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const ratings = await sql`SELECT * FROM training_ratings`
    return NextResponse.json(ratings)
  } catch (error) {
    console.error("Error fetching training ratings:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { member_id, task_id, level } = await request.json()
    // Upsert - insert or update if exists
    const existing = await sql`
      SELECT id FROM training_ratings WHERE member_id = ${member_id} AND task_id = ${task_id}
    `
    if (existing.length > 0) {
      const result = await sql`
        UPDATE training_ratings SET level = ${level}, updated_at = CURRENT_TIMESTAMP
        WHERE member_id = ${member_id} AND task_id = ${task_id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    } else {
      const result = await sql`
        INSERT INTO training_ratings (member_id, task_id, level)
        VALUES (${member_id}, ${task_id}, ${level})
        RETURNING *
      `
      return NextResponse.json(result[0])
    }
  } catch (error) {
    console.error("Error saving training rating:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
