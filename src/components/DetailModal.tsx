"use client";

import { useState, useCallback } from "react";
import type { MediaItem } from "@/lib/catalog";
import { formatRuntime, itemPageUrl } from "@/lib/catalog";
import { playSelectSound, playBackSound } from "@/lib/sounds";
import { GhostLogo } from "./GhostLogo";
import { DownloadModal } from "./DownloadModal";
import { toggleBookmark, useIsBookmarked, useProgress } from "@/lib/localStore";
import { formatTime } from "@/lib/localStore";
import { useTmdbMeta, artFor } from "@/lib/tmdb";

interface Props {
  item: MediaItem;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
}

export function DetailModal({ item, onClose, onPlay }: Props) {
  const [showDownload, setShowDownload] = useState(false);
  const bookmarked = useIsBookmarked(item.id);
  const prior = useProgress(item.id);
  const meta = useTmdbMeta(item);
  const art = artFor(item, meta);
  const resumeText =
    prior && prior.position > 30 ? formatTime(prior.position) : null;

  const handleBookmark = useCallback(() => {
    toggleBookmark(item);
    playSelectSound();
  }, [item]);

  const handleClose = useCallback(() => {
    playBackSound();
    onClose();
  }, [onClose]);

  const genreNames = (meta?.genres?.length ? meta.genres : item.genres)
    .filter((g) => g !== "featured")
    .slice(0, 5);

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal-content">
        {/* Backdrop header — real TMDB key art when available */}
        <div className="relative h-56 md:h-80 overflow-hidden rounded-t-xl">
          <img
            key={art.backdrop}
            src={art.backdrop}
            alt={item.title}
            className={`w-full h-full object-cover ${art.backdropIsTmdb ? "gs-art-swap" : ""}`}
            style={
              art.backdropIsTmdb
                ? {}
                : { filter: "blur(6px) brightness(0.6)", transform: "scale(1.15)" }
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition nav-focusable"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Actions */}
          <div className="absolute bottom-5 left-6 right-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                playSelectSound();
                onPlay(item);
              }}
              className="gs-btn gs-btn-primary nav-focusable"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              {resumeText ? `Resume ${resumeText}` : "Play"}
            </button>
            <button
              onClick={() => {
                playSelectSound();
                setShowDownload(true);
              }}
              className="gs-btn gs-btn-secondary nav-focusable"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download
            </button>
            <button onClick={handleBookmark} className="gs-btn gs-btn-secondary nav-focusable">
              {bookmarked ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              {bookmarked ? "In My List" : "My List"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-2">
            <GhostLogo size={32} />
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">{item.title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            {meta?.rating != null && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600/25 text-green-400 rounded text-xs font-bold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {meta.rating.toFixed(1)}
                <span className="text-green-600 font-normal">/10 TMDB</span>
              </span>
            )}
            <span className="text-gray-400">{item.year}</span>
            {item.runtime ? (
              <>
                <span className="text-gray-600">·</span>
                <span className="text-gray-400">{formatRuntime(item.runtime)}</span>
              </>
            ) : null}
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs uppercase tracking-wider">
              {item.kind === "cartoon" ? "Cartoon" : "Movie"}
            </span>
            <span className="px-2 py-0.5 bg-green-600/25 text-green-400 rounded text-xs uppercase tracking-wider font-semibold">
              ✓ Public Domain
            </span>
            {item.note && (
              <span className="px-2 py-0.5 bg-yellow-600/25 text-yellow-400 rounded text-xs">
                {item.note}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {genreNames.map((g) => (
              <span
                key={g}
                className="text-xs px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-gray-300 capitalize"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            {item.overview || "No description available."}
          </p>

          <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex flex-wrap gap-x-4 gap-y-1">
            <span>🎥 Streamed from the Internet Archive</span>
            <span>🆓 Free forever · no ads · no accounts</span>
            <a
              href={itemPageUrl(item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300"
            >
              View source on archive.org ↗
            </a>
            {meta?.tmdbUrl && (
              <a
                href={meta.tmdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-300"
              >
                Metadata &amp; art from TMDB ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {showDownload && <DownloadModal item={item} onClose={() => setShowDownload(false)} />}
    </>
  );
}
