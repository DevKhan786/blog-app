import { adminDb } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const visitorId = createHash("sha256")
      .update(`${data.ip}-${data.userAgent}`)
      .digest("hex");

    await adminDb.collection("analytics").add({
      ...data,
      visitorId,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error...";
    console.error("Tracking error:", error);
    return NextResponse.json(
      { error: "Tracking failed", details: errorMessage },
      { status: 500 }
    );
  }
}
