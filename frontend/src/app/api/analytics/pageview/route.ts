import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return new NextResponse(null, { status: 204 });

  try {
    const body = await req.json();
    await fetch(`${backendUrl}/analytics/pageview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Fire-and-forget — never fail the client
  }

  return new NextResponse(null, { status: 204 });
}
