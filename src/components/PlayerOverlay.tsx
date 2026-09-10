"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  tmdb_id: number;
  type: "movie" | "tv" | string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

// Browser-side code needs the NEXT_PUBLIC_ prefix. Define this in your
// deployment environment (see .env.example).
const BASE_EMBED_URL = process.env.NEXT_PUBLIC_BASE_EMBED_URL?.replace(/\/$/, "") || "";

function buildEmbedUrl(
  tmdbId: number,
  type: string,
  season?: number,
  episode?: number
): string | null {
  if (!BASE_EMBED_URL || !Number.isFinite(tmdbId)) return null;

  const id = encodeURIComponent(String(tmdbId));
  if (type.toLowerCase() === "tv" && season != null && episode != null) {
    return `${BASE_EMBED_URL}/tv/${id}/${encodeURIComponent(String(season))}/${encodeURIComponent(String(episode))}`;
  }

  return `${BASE_EMBED_URL}/movie/${id}`;
}

export function PlayerOverlay({ tmdb_id, type, season, episode, onClose }: Props) {
  const [closing, setClosing] = useState(false);

  const embedUrl = useMemo(
    () => buildEmbedUrl(tmdb_id, type, season, episode),
    [tmdb_id, type, season, episode]
  );

  const requestClose = () => {
    setClosing(true);
    window.setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Backspace") {
        event.preventDefault();
        requestClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black/95 p-3 sm:p-5 md:p-8 transition-opacity duration-200 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <button
        type="button"
        onClick={requestClose}
        className="absolute left-4 top-4 z-20 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        ← Back
      </button>

      <div className="flex h-full w-full items-center justify-center pt-12 sm:pt-10">
        <div className="relative aspect-video w-full max-w-7xl overflow-hidden rounded-xl bg-black shadow-2xl">
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title="Ghoststream video player"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-white">
              <div>
                <h2 className="text-lg font-bold">Playback provider not configured</h2>
                <p className="mt-2 text-sm text-gray-400">
                  Set NEXT_PUBLIC_BASE_EMBED_URL in the app environment and restart the app.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
