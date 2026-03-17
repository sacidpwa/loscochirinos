import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const items = await sql`
      SELECT poi.*, s.name as supply_name
      FROM purchase_order_items poi
      JOIN supplies s ON poi.supply_id = s.id
      WHERE poi.order_id = ${id}
      ORDER BY s.name
    `

    return NextResponse.json(items)
  } catch (error) {
    console.error("[v0] Error fetching purchase order items:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { item_id, checked, amount_spent, notes } = await request.json()

    const result = await sql`
      UPDATE purchase_order_items
      SET checked = ${checked},
          amount_spent = ${amount_spent || 0},
          notes = ${notes || ""}
      WHERE id = ${item_id} AND order_id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating purchase order item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}
