import { NextRequest, NextResponse } from "next/server";
import { getSeasonEpisodes } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const tvId = parseInt(req.nextUrl.searchParams.get("tvId") || "0");
  const season = parseInt(req.nextUrl.searchParams.get("season") || "1");

  if (!tvId) return NextResponse.json({ error: "Missing tvId" }, { status: 400 });

  try {
    const data = await getSeasonEpisodes(tvId, season);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
