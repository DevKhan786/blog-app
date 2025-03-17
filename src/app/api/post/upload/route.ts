import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) return new NextResponse("No file provided", { status: 400 });

    if (!file.type.startsWith("image/")) {
      return new NextResponse("Invalid file type - images only", {
        status: 400,
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return new NextResponse("File size exceeds 5MB limit", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "blog/posts",
      public_id: `post-${uuidv4()}`,
      overwrite: false,
      resource_type: "auto",
    });

    return NextResponse.json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
