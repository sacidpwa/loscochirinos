import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const suppliers = await sql`SELECT * FROM suppliers ORDER BY name`
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, email, address, contact_person, supplies, delivery_days, payment_method, rating, notes } = await request.json()
    const result = await sql`
      INSERT INTO suppliers (name, phone, email, address, contact_person, supplies, delivery_days, payment_method, rating, notes)
      VALUES (${name}, ${phone || ""}, ${email || ""}, ${address || ""}, ${contact_person || ""}, ${supplies || ""}, ${delivery_days || ""}, ${payment_method || ""}, ${rating || 0}, ${notes || ""})
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, phone, email, address, contact_person, supplies, delivery_days, payment_method, rating, notes } = await request.json()
    const result = await sql`
      UPDATE suppliers
      SET name = ${name}, phone = ${phone || ""}, email = ${email || ""}, address = ${address || ""}, 
          contact_person = ${contact_person || ""}, supplies = ${supplies || ""}, delivery_days = ${delivery_days || ""}, 
          payment_method = ${payment_method || ""}, rating = ${rating || 0}, notes = ${notes || ""}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM suppliers WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 })
  }
}
