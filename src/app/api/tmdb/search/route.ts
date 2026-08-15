import { NextRequest, NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  if (!query) return NextResponse.json({ results: [] });
  const data = await searchMulti(query, page);
  return NextResponse.json(data);
}
