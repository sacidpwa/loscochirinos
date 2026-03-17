import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const supplies = await sql`
      SELECT s.*, c.name as category_name 
      FROM supplies s
      JOIN categories c ON s.category_id = c.id
      ORDER BY c.name, s.name
    `
    return NextResponse.json(supplies)
  } catch (error) {
    console.error("[v0] Error fetching supplies:", error)
    return NextResponse.json({ error: "Failed to fetch supplies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { category_id, name, frequency, purchase_quantity, minimum, unit } = await request.json()
    const result = await sql`
      INSERT INTO supplies (category_id, name, frequency, purchase_quantity, minimum, unit)
      VALUES (${category_id}, ${name}, ${frequency}, ${purchase_quantity || 0}, ${minimum || 0}, ${unit || "unidad"})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error creating supply:", error)
    return NextResponse.json({ error: "Failed to create supply" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, frequency, purchase_frequency, purchase_quantity, minimum_stock, minimum, unit, supplier } =
      await request.json()

    const actualFrequency = frequency || purchase_frequency
    const actualMinimum = minimum_stock || minimum

    const result = await sql`
      UPDATE supplies 
      SET name = ${name},
          frequency = ${actualFrequency},
          purchase_quantity = ${purchase_quantity}, 
          minimum = ${actualMinimum},
          unit = ${unit || "unidad"},
          supplier = ${supplier || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("[v0] Error updating supply:", error)
    return NextResponse.json({ error: "Failed to update supply" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    await sql`DELETE FROM supplies WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting supply:", error)
    return NextResponse.json({ error: "Failed to delete supply" }, { status: 500 })
  }
}
