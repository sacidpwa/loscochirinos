import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const tasks = await sql`
      SELECT * FROM tasks ORDER BY created_at DESC
    `
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, percentage, responsible } = await request.json()
    const result = await sql`
      INSERT INTO tasks (name, percentage, responsible)
      VALUES (${name}, ${percentage || 0}, ${responsible || ""})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, percentage, responsible } = await request.json()
    const result = await sql`
      UPDATE tasks
      SET name = ${name},
          percentage = ${percentage},
          responsible = ${responsible},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM tasks WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
