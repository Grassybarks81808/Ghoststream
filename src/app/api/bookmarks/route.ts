import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage
const memoryBookmarks: Record<string, Record<string, unknown>> = {};

export async function GET(req: NextRequest) {
  try {
    // Check if a specific movie is bookmarked
    const tmdbId = req.nextUrl.searchParams.get("tmdbId");
    const mediaType = req.nextUrl.searchParams.get("mediaType");

    if (tmdbId && mediaType) {
      const key = `${tmdbId}-${mediaType}`;
      return NextResponse.json({ bookmarked: !!memoryBookmarks[key] });
    }

    // Return all bookmarks
    const items = Object.values(memoryBookmarks).slice(0, 50);
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

    if (memoryBookmarks[key]) {
      delete memoryBookmarks[key];
      return NextResponse.json({ bookmarked: false });
    } else {
      memoryBookmarks[key] = { ...body, id: Date.now(), createdAt: new Date().toISOString() };
      return NextResponse.json({ bookmarked: true });
    }
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, mediaType } = body;
    const key = `${tmdbId}-${mediaType}`;

    if (memoryBookmarks[key]) {
      delete memoryBookmarks[key];
    }

    return NextResponse.json({ bookmarked: false });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
