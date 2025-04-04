import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    if (
      req.nextUrl.pathname.startsWith("/api") ||
      req.nextUrl.pathname === "/api/track"
    ) {
      return NextResponse.next();
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const referrer = req.headers.get("referer") || "direct";
    const path = req.nextUrl.pathname;

    await fetch(`${req.nextUrl.origin}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: path || "/",
        ip,
        userAgent,
        referrer,
        country: req.headers.get("x-vercel-ip-country") || "unknown",
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Tracking error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|api/track|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
