import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const orders = await sql`
      SELECT po.*, 
             COUNT(poi.id)::int as item_count,
             COALESCE(SUM(poi.amount_spent), 0)::numeric as total_amount
      FROM purchase_orders po
      LEFT JOIN purchase_order_items poi ON po.id = poi.order_id
      GROUP BY po.id
      ORDER BY po.created_at DESC
    `
    return NextResponse.json(orders)
  } catch (error) {
    console.error("[v0] Error fetching purchase orders:", error)
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { supply_ids } = await request.json()

    // Create purchase order
    const orderResult = await sql`
      INSERT INTO purchase_orders (status) VALUES ('pending') RETURNING *
    `
    const order = orderResult[0]

    // Create items for each selected supply
    for (const supply_id of supply_ids) {
      await sql`
        INSERT INTO purchase_order_items (order_id, supply_id)
        VALUES (${order.id}, ${supply_id})
      `
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("[v0] Error creating purchase order:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
