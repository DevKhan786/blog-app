import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse("File size exceeds 5MB limit", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "blog/profiles",
      public_id: `profile-${userId}-${Date.now()}`,
    });

    return NextResponse.json({ imageUrl: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
