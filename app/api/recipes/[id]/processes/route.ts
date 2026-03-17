import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { stage, title, description, photo_url, sort_order } = await request.json()

    const result = await sql`
      INSERT INTO recipe_processes (recipe_id, stage, title, description, photo_url, sort_order)
      VALUES (${id}, ${stage}, ${title || ""}, ${description}, ${photo_url || ""}, ${sort_order || 0})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error adding process:", error)
    return NextResponse.json({ error: "Failed to add process" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { process_id, stage, title, description, photo_url } = await request.json()

    const result = await sql`
      UPDATE recipe_processes
      SET stage = ${stage}, title = ${title || ""}, description = ${description}, photo_url = ${photo_url || ""}
      WHERE id = ${process_id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating process:", error)
    return NextResponse.json({ error: "Failed to update process" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { process_id } = await request.json()
    await sql`DELETE FROM recipe_processes WHERE id = ${process_id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting process:", error)
    return NextResponse.json({ error: "Failed to delete process" }, { status: 500 })
  }
}
