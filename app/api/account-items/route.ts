import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const items = await sql`SELECT * FROM account_items ORDER BY id`
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching account items:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { concept, price, payment } = await request.json()
    const result = await sql`
      INSERT INTO account_items (concept, price, payment)
      VALUES (${concept}, ${price || 0}, ${payment || 0})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating account item:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, concept, price, payment } = await request.json()
    const result = await sql`
      UPDATE account_items
      SET concept = ${concept}, price = ${price || 0}, payment = ${payment || 0}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating account item:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM account_items WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account item:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
