import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const members = await sql`SELECT * FROM team_members ORDER BY area_id, name`
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { area_id, name, role } = await request.json()
    const result = await sql`
      INSERT INTO team_members (area_id, name, role)
      VALUES (${area_id}, ${name}, ${role || ""})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating team member:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, role } = await request.json()
    const result = await sql`
      UPDATE team_members SET name = ${name}, role = ${role || ""} WHERE id = ${id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating team member:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM training_ratings WHERE member_id = ${id}`
    await sql`DELETE FROM team_members WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
