import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, quantity, unit, photo_url, sort_order } = await request.json()

    const result = await sql`
      INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, photo_url, sort_order)
      VALUES (${id}, ${name}, ${quantity || ""}, ${unit || ""}, ${photo_url || ""}, ${sort_order || 0})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error adding ingredient:", error)
    return NextResponse.json({ error: "Failed to add ingredient" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { ingredient_id, name, quantity, unit, photo_url } = await request.json()

    const result = await sql`
      UPDATE recipe_ingredients
      SET name = ${name}, quantity = ${quantity || ""}, unit = ${unit || ""}, photo_url = ${photo_url || ""}
      WHERE id = ${ingredient_id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating ingredient:", error)
    return NextResponse.json({ error: "Failed to update ingredient" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { ingredient_id } = await request.json()
    await sql`DELETE FROM recipe_ingredients WHERE id = ${ingredient_id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ingredient:", error)
    return NextResponse.json({ error: "Failed to delete ingredient" }, { status: 500 })
  }
}
