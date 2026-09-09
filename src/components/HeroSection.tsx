"use client";

import type { MediaItem } from "@/lib/catalog";
import { formatRuntime } from "@/lib/catalog";
import { useTmdbMeta, artFor } from "@/lib/tmdb";
import { GhostLogo } from "./GhostLogo";

interface Props {
  item: MediaItem;
  onPlay: () => void;
  onDetails: () => void;
}

export function HeroSection({ item, onPlay, onDetails }: Props) {
  const meta = useTmdbMeta(item);
  const art = artFor(item, meta);

  return (
    <section className="hero-section">
      {/* Full-bleed backdrop — real TMDB key art when available */}
      <div className="hero-backdrop overflow-hidden">
        <img
          key={art.backdrop}
          src={art.backdrop}
          alt=""
          aria-hidden
          className={`w-full h-full object-cover ${art.backdropIsTmdb ? "gs-art-swap" : ""}`}
          style={
            art.backdropIsTmdb
              ? { filter: "brightness(0.62) saturate(1.15)" }
              : {
                  filter: "blur(18px) saturate(1.3) brightness(0.55)",
                  transform: "scale(1.25)",
                }
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/35 to-[#0a0a0a]/70" />
      </div>
      {/* Sharp poster, right side */}
      <div className="hero-poster-wrap">
        <img
          key={art.poster}
          src={art.poster}
          alt={item.title}
          className={`hero-poster-img ${art.posterIsTmdb ? "gs-art-swap" : ""}`}
        />
      </div>

      <div className="relative z-10 flex flex-col justify-end min-h-[85vh] px-6 md:px-12 lg:px-16 pb-32">
        <div style={{ animation: "slideUp 0.8s ease-out" }} className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3">
            <GhostLogo size={40} />
            <span className="text-[#e50914] font-bold text-sm uppercase tracking-wider">
              Now Streaming · 100% Free
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight drop-shadow-2xl">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base">
            {meta?.rating != null && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-600/25 text-green-400 rounded text-xs font-bold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {meta.rating.toFixed(1)}
              </span>
            )}
            <span className="text-gray-300">{item.year}</span>
            {item.runtime ? (
              <>
                <span className="text-gray-600">·</span>
                <span className="text-gray-300">{formatRuntime(item.runtime)}</span>
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
          {(meta?.genres?.length || item.genres.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(meta?.genres?.length ? meta.genres : item.genres)
                .filter((g) => g !== "featured")
                .slice(0, 4)
                .map((g) => (
                  <span
                    key={g}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-200"
                  >
                    {g}
                  </span>
                ))}
            </div>
          )}
          <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3">{item.overview}</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onPlay} className="gs-btn gs-btn-primary nav-focusable">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Play
            </button>
            <button onClick={onDetails} className="gs-btn gs-btn-secondary nav-focusable">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
