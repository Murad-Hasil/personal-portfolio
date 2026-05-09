import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  const backendUrl = process.env.BACKEND_URL;

  if (!adminSecret || !backendUrl) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${backendUrl}/analytics/summary`, {
    headers: { Authorization: `Bearer ${adminSecret}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Backend error" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
