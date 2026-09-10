"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { playBackSound } from "@/lib/sounds";

interface Props {
  tmdbId: number;
  type: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

// Browser-side configuration must use the NEXT_PUBLIC_ prefix.
const BASE_EMBED_URL =
  process.env.NEXT_PUBLIC_BASE_EMBED_URL?.replace(/\/$/, "") || "";

function buildEmbedUrl(
  tmdbId: number,
  type: string,
  season?: number,
  episode?: number
): string | null {
  if (!BASE_EMBED_URL || !Number.isFinite(tmdbId)) return null;

  const id = encodeURIComponent(String(tmdbId));

  if (type.toLowerCase() === "tv") {
    if (season !== undefined && episode !== undefined) {
      return `${BASE_EMBED_URL}/tv/${id}/${encodeURIComponent(String(season))}/${encodeURIComponent(String(episode))}`;
    }
    return `${BASE_EMBED_URL}/tv/${id}`;
  }

  return `${BASE_EMBED_URL}/movie/${id}`;
}

export function PlayerOverlay({ tmdbId, type, season, episode, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const embedUrl = useMemo(
    () => buildEmbedUrl(tmdbId, type, season, episode),
    [tmdbId, type, season, episode]
  );

  const handleClose = useCallback(() => {
    playBackSound();
    setClosing(true);
    window.setTimeout(onClose, 400);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handler = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", handler);
    handler();
    return () => {
      window.removeEventListener("mousemove", handler);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`player-overlay ${closing ? "closing" : ""}`}>
      <div
        className={`absolute top-0 left-0 right-0 z-50 p-4 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="nav-focusable flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-semibold text-sm">Back</span>
        </button>
        {type === "tv" && season !== undefined && episode !== undefined && (
          <span className="text-sm text-gray-300">
            Season {season} • Episode {episode}
          </span>
        )}
      </div>

      <div className="relative h-full w-full flex items-center justify-center bg-black">
        {embedUrl ? (
          <iframe
            key={embedUrl}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Ghoststream player"
          />
        ) : (
          <div className="px-6 text-center text-white">
            <h2 className="text-lg font-bold">Playback provider not configured</h2>
            <p className="mt-2 text-sm text-gray-400">
              Set NEXT_PUBLIC_BASE_EMBED_URL in your local environment and restart the app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
