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
      timestamp: new Date(data.timestamp || Date.now()),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
