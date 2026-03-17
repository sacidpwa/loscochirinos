import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const evaluations = await sql`SELECT * FROM oratoria_evaluations ORDER BY total_score DESC, created_at DESC`
    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Error fetching oratoria evaluations:", error)
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await sql`
      INSERT INTO oratoria_evaluations (
        participant_name, diccion, ritmo, entonacion, intensidad,
        expresion_corporal, dominio_escenico, conexion_emocional,
        introduccion, desarrollo, conclusion, total_score, notes
      ) VALUES (
        ${data.participant_name}, ${data.diccion}, ${data.ritmo}, ${data.entonacion}, ${data.intensidad},
        ${data.expresion_corporal}, ${data.dominio_escenico}, ${data.conexion_emocional},
        ${data.introduccion}, ${data.desarrollo}, ${data.conclusion}, ${data.total_score}, ${data.notes || ""}
      )
      RETURNING *
    `
    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating oratoria evaluation:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await sql`DELETE FROM oratoria_evaluations WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting oratoria evaluation:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
