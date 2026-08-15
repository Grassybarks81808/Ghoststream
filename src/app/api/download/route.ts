import { NextRequest, NextResponse } from "next/server";
import { resolveStreamUrl } from "@/lib/resolver";
import { startDownload, getDownloadStatus, getAllDownloads, DownloadJob } from "@/lib/downloader";

// In-memory download status tracking (for API responses)
const downloadStatuses: Map<string, DownloadJob> = new Map();

/**
 * Download API
 * 
 * GET /api/download?id=xxx - Get download status
 * GET /api/download - Get all downloads
 * POST /api/download - Start new download
 *   Body: { tmdbId, type, season?, episode?, quality, filename }
 */

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  
  if (id) {
    const status = downloadStatuses.get(id) || getDownloadStatus(id);
    if (status) {
      return NextResponse.json(status);
    }
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }
  
  // Return all downloads
  const all = getAllDownloads();
  return NextResponse.json({ downloads: all });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tmdbId, type, season, episode, quality = "best", filename } = body;

    if (!tmdbId || !type || !filename) {
      return NextResponse.json(
        { error: "Missing required fields: tmdbId, type, filename" },
        { status: 400 }
      );
    }

    // Step 1: Resolve the stream URL automatically
    const resolved = await resolveStreamUrl({
      tmdbId: Number(tmdbId),
      type: type as "movie" | "tv",
      season: season ? Number(season) : undefined,
      episode: episode ? Number(episode) : undefined,
    });

    if (!resolved) {
      return NextResponse.json({
        error: "Could not resolve stream URL",
        message: "The stream URL could not be automatically resolved. The content may be protected or unavailable.",
      }, { status: 404 });
    }

    // Step 2: Sanitize filename
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_");

    // Step 3: Start the download
    const downloadId = startDownload({
      stream: resolved,
      outputFilename: sanitizedFilename,
      quality: quality as "best" | "1080p" | "720p" | "480p",
      onProgress: (progress) => {
        const job = downloadStatuses.get(downloadId);
        if (job) {
          job.progress = progress.timeProcessed;
          job.duration = progress.duration;
          job.status = "downloading";
        }
      },
      onComplete: (success, error) => {
        const job = downloadStatuses.get(downloadId);
        if (job) {
          job.status = success ? "completed" : "error";
          if (error) job.error = error;
          if (success) job.progress = 100;
        }
      },
    });

    // Track the download
    downloadStatuses.set(downloadId, {
      id: downloadId,
      filename: sanitizedFilename,
      status: "starting",
      progress: 0,
    });

    return NextResponse.json({
      success: true,
      downloadId,
      filename: sanitizedFilename,
      provider: resolved.provider,
      message: "Download started successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
