import { NextRequest, NextResponse } from "next/server";
import { resolveStreamUrl, validateStreamUrl, getEmbedUrl } from "@/lib/resolver";

/**
 * Stream URL Resolution API
 * 
 * POST /api/resolve
 * Body: { tmdbId, type, season?, episode? }
 * 
 * Returns resolved stream URL or fallback embed URL
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, type, season, episode } = body;

    if (!tmdbId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: tmdbId, type" },
        { status: 400 }
      );
    }

    // Attempt to resolve the stream URL
    const resolved = await resolveStreamUrl({
      tmdbId: Number(tmdbId),
      type: type as "movie" | "tv",
      season: season ? Number(season) : undefined,
      episode: episode ? Number(episode) : undefined,
    });

    if (resolved) {
      // Validate the resolved URL
      const isValid = await validateStreamUrl(resolved.url, resolved.headers?.Referer);
      
      if (isValid) {
        return NextResponse.json({
          success: true,
          resolved: true,
          url: resolved.url,
          provider: resolved.provider,
          headers: resolved.headers,
          quality: resolved.quality,
        });
      }
    }

    // Fallback: return embed URL for browser-based playback
    const embedUrl = getEmbedUrl({
      tmdbId: Number(tmdbId),
      type: type as "movie" | "tv",
      season: season ? Number(season) : undefined,
      episode: episode ? Number(episode) : undefined,
    });

    return NextResponse.json({
      success: true,
      resolved: false,
      embedUrl,
      message: "Direct stream URL could not be resolved. Use embed URL for playback.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
