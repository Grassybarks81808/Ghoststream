"use client";

import type { MediaItem } from "@/lib/catalog";
import { posterUrl, formatRuntime } from "@/lib/catalog";
import { GhostLogo } from "./GhostLogo";

interface Props {
  item: MediaItem;
  onPlay: () => void;
  onDetails: () => void;
}

export function HeroSection({ item, onPlay, onDetails }: Props) {
  const poster = posterUrl(item.id);

  return (
    <section className="hero-section">
      {/* Blurred backdrop built from the poster */}
      <div className="hero-backdrop overflow-hidden">
        <img
          src={poster}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          style={{ filter: "blur(18px) saturate(1.3) brightness(0.55)", transform: "scale(1.25)" }}
        />
      </div>
      {/* Sharp poster, right side */}
      <div className="hero-poster-wrap">
        <img
          src={poster}
          alt={item.title}
          className="hero-poster-img"
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
