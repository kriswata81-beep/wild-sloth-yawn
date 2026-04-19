import { NextRequest, NextResponse } from "next/server";

// Server-side password check — password never sent to client bundle
const STEWARD_PASSWORD = process.env.STEWARD_PASSWORD || "makoa0001";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (password === STEWARD_PASSWORD) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
