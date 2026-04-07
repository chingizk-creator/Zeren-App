import { NextRequest, NextResponse } from "next/server";

// In-memory counter — resets on cold start, good enough for MVP demo
let signups = 1847;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = String(body.phone ?? "").trim();
    if (!phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }
    signups += 1;
    return NextResponse.json({ success: true, position: signups });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ count: signups });
}
