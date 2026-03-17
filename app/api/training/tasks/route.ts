import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const tasks = await sql`SELECT * FROM training_tasks ORDER BY area_id, sort_order`
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching training tasks:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { area_id, name, description } = await request.json()
    const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) as max FROM training_tasks WHERE area_id = ${area_id}`
    const result = await sql`
      INSERT INTO training_tasks (area_id, name, description, sort_order)
      VALUES (${area_id}, ${name}, ${description || ""}, ${(maxOrder[0]?.max || 0) + 1})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating training task:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description } = await request.json()
    const result = await sql`
      UPDATE training_tasks SET name = ${name}, description = ${description || ""} WHERE id = ${id} RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating training task:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM training_ratings WHERE task_id = ${id}`
    await sql`DELETE FROM training_tasks WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting training task:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
