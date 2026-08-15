import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getTVDetails } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const id = parseInt(req.nextUrl.searchParams.get("id") || "0");
  const type = req.nextUrl.searchParams.get("type") || "movie";

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    if (type === "tv") {
      const data = await getTVDetails(id);
      return NextResponse.json(data);
    } else {
      const data = await getMovieDetails(id);
      return NextResponse.json(data);
    }
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
