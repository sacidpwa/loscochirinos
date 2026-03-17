import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const recipe = await sql`SELECT * FROM recipes WHERE id = ${id}`
    if (recipe.length === 0) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    const ingredients = await sql`
      SELECT * FROM recipe_ingredients WHERE recipe_id = ${id} ORDER BY sort_order
    `
    const processes = await sql`
      SELECT * FROM recipe_processes WHERE recipe_id = ${id} ORDER BY stage, sort_order
    `

    return NextResponse.json({
      ...recipe[0],
      ingredients,
      processes,
    })
  } catch (error) {
    console.error("Error fetching recipe:", error)
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, key_comments, photo_url } = await request.json()

    const result = await sql`
      UPDATE recipes
      SET name = ${name}, key_comments = ${key_comments || ""}, photo_url = ${photo_url || ""}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating recipe:", error)
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM recipe_processes WHERE recipe_id = ${id}`
    await sql`DELETE FROM recipe_ingredients WHERE recipe_id = ${id}`
    await sql`DELETE FROM recipes WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 })
  }
}
