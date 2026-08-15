"use client";

import { useState, useEffect, useCallback } from "react";
import { playBackSound } from "@/lib/sounds";

interface Props {
  tmdbId: number;
  type: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

export function PlayerOverlay({ tmdbId, type, season, episode, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [showControls, setShowControls] = useState(true);

  let streamUrl: string;
  if (type === "tv" && season !== undefined && episode !== undefined) {
    streamUrl = `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${season}/${episode}`;
  } else {
    streamUrl = `https://vidsrc-embed.ru/embed/movie/${tmdbId}`;
  }

  const handleClose = useCallback(() => {
    playBackSound();
    setClosing(true);
    setTimeout(onClose, 400);
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

  // Auto-hide controls
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
      {/* Back button */}
      <div
        className={`absolute top-0 left-0 right-0 z-50 p-4 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <button
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

      {/* Video iframe */}
      <iframe
        src={streamUrl}
        className="w-full h-full border-0"
        allowFullScreen
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        title="Stream"
      />
    </div>
  );
}
