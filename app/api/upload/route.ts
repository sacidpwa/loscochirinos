import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const cloudForm = new FormData()
    cloudForm.append("file", file)
    cloudForm.append("upload_preset", uploadPreset)
    cloudForm.append("folder", "cochirinos/recetas")

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudForm }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error("Cloudinary error:", err)
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ url: data.secure_url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
