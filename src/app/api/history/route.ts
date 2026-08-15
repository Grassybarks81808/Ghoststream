import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage (resets on server restart, but watch history is also saved in browser localStorage)
const memoryHistory: Record<string, unknown> = {};

export async function GET() {
  try {
    const items = Object.values(memoryHistory).slice(0, 50);
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, mediaType } = body;
    const key = `${tmdbId}-${mediaType}`;
    memoryHistory[key] = { ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
