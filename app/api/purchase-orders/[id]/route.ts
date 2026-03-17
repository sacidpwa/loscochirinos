import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await sql`
      SELECT * FROM purchase_orders WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error fetching purchase order:", error)
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { completed } = await request.json()

    if (completed) {
      const result = await sql`
        UPDATE purchase_orders
        SET completed_at = CURRENT_TIMESTAMP,
            status = 'completed'
        WHERE id = ${id}
        RETURNING *
      `
      return NextResponse.json(result[0])
    }

    return NextResponse.json({ error: "Invalid update" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating purchase order:", error)
    return NextResponse.json({ error: "Failed to update purchase order" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Delete order items first (cascade should handle this, but being explicit)
    await sql`DELETE FROM purchase_order_items WHERE order_id = ${id}`

    // Delete the order
    await sql`DELETE FROM purchase_orders WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting purchase order:", error)
    return NextResponse.json({ error: "Failed to delete purchase order" }, { status: 500 })
  }
}
