import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const steps = await sql`SELECT * FROM flow_steps ORDER BY sort_order`
    return NextResponse.json(steps)
  } catch (error) {
    console.error("Error fetching flow steps:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { label, shape, sort_order } = await request.json()
    // Shift all steps at or after this position
    await sql`UPDATE flow_steps SET sort_order = sort_order + 1 WHERE sort_order >= ${sort_order}`
    const result = await sql`
      INSERT INTO flow_steps (label, shape, sort_order)
      VALUES (${label}, ${shape || "process"}, ${sort_order})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating flow step:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, label, shape } = await request.json()
    const result = await sql`
      UPDATE flow_steps SET label = ${label}, shape = ${shape || "process"}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating flow step:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM flow_steps WHERE id = ${id}`
    // Reorder remaining steps
    const remaining = await sql`SELECT id FROM flow_steps ORDER BY sort_order`
    for (let i = 0; i < remaining.length; i++) {
      await sql`UPDATE flow_steps SET sort_order = ${i} WHERE id = ${remaining[i].id}`
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting flow step:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
