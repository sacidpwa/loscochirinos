import { NextResponse } from "next/server"
import sql from "@/lib/neon"

export async function GET() {
  try {
    const recipes = await sql`SELECT * FROM recipes ORDER BY created_at DESC`
    return NextResponse.json(recipes)
  } catch (error) {
    console.error("Error fetching recipes:", error)
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, key_comments, photo_url } = await request.json()

    const result = await sql`
      INSERT INTO recipes (name, key_comments, photo_url)
      VALUES (${name}, ${key_comments || ""}, ${photo_url || ""})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating recipe:", error)
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 })
  }
}
