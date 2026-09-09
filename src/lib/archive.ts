/**
 * Internet Archive resolver (client-side)
 *
 * Fetches item metadata directly from archive.org (CORS-enabled) in the
 * user's browser, ranks the available video files, and returns playable
 * stream URLs + direct download URLs. No server required.
 */

export interface VideoOption {
  /** file name on archive.org */
  name: string;
  /** direct playback/download URL */
  url: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  /** seconds, if archive reports it */
  length?: number;
  /** human label e.g. "480p · 597 MB" */
  label: string;
  /** derivative files stream more reliably than giant originals */
  derivative: boolean;
}

export interface ArchiveItemInfo {
  identifier: string;
  serverTitle: string | null;
  description: string | null;
  /** ranked best-first */
  options: VideoOption[];
  best: VideoOption | null;
  detailsUrl: string;
}

interface ArchiveFile {
  name: string;
  source?: string;
  format?: string;
  size?: string;
  height?: string;
  width?: string;
  length?: string;
}

interface ArchiveMetadataResponse {
  metadata?: {
    identifier?: string;
    title?: string | string[];
    description?: string | string[];
  };
  files?: ArchiveFile[];
}

const META_URL = (id: string) => `https://archive.org/metadata/${encodeURIComponent(id)}`;
const DOWNLOAD_URL = (id: string, name: string) =>
  `https://archive.org/download/${encodeURIComponent(id)}/${name
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

const CACHE_PREFIX = "gs:arch:";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

const inflight = new Map<string, Promise<ArchiveItemInfo | null>>();

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function toPlainText(value: string | string[] | undefined): string | null {
  if (!value) return null;
  const text = Array.isArray(value) ? value.join(" ") : value;
  // archive descriptions are often HTML — strip tags crudely
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/** Rank a raw archive.org file list into playable options (best first). */
export function rankFiles(identifier: string, files: ArchiveFile[]): VideoOption[] {
  const candidates: VideoOption[] = [];

  for (const f of files) {
    const name = f.name || "";
    const lower = name.toLowerCase();
    const format = (f.format || "").toLowerCase();
    const size = Number(f.size || 0);

    // skip thumbnails, subtitles, metadata
    if (lower.startsWith("__") || lower.includes(".thumbs/") || lower.includes(".srt")) continue;
    if (size <= 0) continue;

    const isMp4 = lower.endsWith(".mp4");
    const isOgv = lower.endsWith(".ogv");
    if (!isMp4 && !isOgv) continue;

    // mp4 must be an h.264-ish MPEG4 flavor to play in browsers
    const playableMp4 =
      isMp4 && (format.includes("h.264") || format.includes("h264") || format.includes("mpeg4"));
    if (!playableMp4 && !isOgv) continue;

    const height = Number(f.height || 0) || undefined;
    const width = Number(f.width || 0) || undefined;
    const length = Number(f.length || 0) || undefined;
    const derivative = f.source === "derivative";

    const quality = height ? `${height}p` : isOgv ? "OGV" : "Video";
    candidates.push({
      name,
      url: DOWNLOAD_URL(identifier, name),
      format: f.format || "",
      size,
      width,
      height,
      length,
      label: `${quality} · ${formatBytes(size)}`,
      derivative,
    });
  }

  // ranking: derivatives first (streamable), then by height desc, then size desc
  candidates.sort((a, b) => {
    if (a.derivative !== b.derivative) return a.derivative ? -1 : 1;
    if ((b.height || 0) !== (a.height || 0)) return (b.height || 0) - (a.height || 0);
    return b.size - a.size;
  });

  // dedupe by height+size (some items have several identical encodes)
  const seen = new Set<string>();
  return candidates.filter((c) => {
    const key = `${c.height || 0}-${c.size}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function readCache(id: string): ArchiveItemInfo | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { t: number; data: ArchiveItemInfo };
    if (Date.now() - parsed.t > CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(id: string, data: ArchiveItemInfo) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify({ t: Date.now(), data }));
  } catch {
    // storage full / private mode — cache is best-effort
  }
}

/**
 * Resolve an archive.org item to playable/downloadable files.
 * Returns null when the item can't be fetched (offline, removed, etc).
 */
export async function fetchArchiveItem(identifier: string): Promise<ArchiveItemInfo | null> {
  const cached = readCache(identifier);
  if (cached) return cached;

  const existing = inflight.get(identifier);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(META_URL(identifier), { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return null;

      const data = (await res.json()) as ArchiveMetadataResponse;
      const files = data.files || [];
      const options = rankFiles(identifier, files);
      if (options.length === 0) return null;

      const info: ArchiveItemInfo = {
        identifier,
        serverTitle: toPlainText(data.metadata?.title),
        description: toPlainText(data.metadata?.description),
        options,
        best: options[0],
        detailsUrl: `https://archive.org/details/${identifier}`,
      };
      writeCache(identifier, info);
      return info;
    } catch {
      return null;
    } finally {
      inflight.delete(identifier);
    }
  })();

  inflight.set(identifier, promise);
  return promise;
}

/** Best-effort stream URL used for instant <video> setup before full resolve. */
export async function resolveStreamUrl(identifier: string): Promise<VideoOption | null> {
  const info = await fetchArchiveItem(identifier);
  return info?.best ?? null;
}
