"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { MediaItem } from "@/lib/catalog";
import { searchCatalog, ROWS, formatRuntime } from "@/lib/catalog";
import { playNavSound, playSelectSound, playBackSound } from "@/lib/sounds";
import { useTmdbMeta, artFor } from "@/lib/tmdb";

interface Props {
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

const QUICK_LINKS = [
  "Horror", "Sci-Fi", "Comedy", "Cartoon", "Noir", "Western",
  "Keaton", "Chaplin", "Hitchcock", "Open Cinema", "Stooges",
];

export function SearchOverlay({ onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = useMemo(() => searchCatalog(query), [query]);

  const handleClose = useCallback(() => {
    playBackSound();
    onClose();
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[800] bg-[#0a0a0a]/95 backdrop-blur-xl overflow-y-auto"
      style={{ animation: "fadeInScale 0.3s ease-out" }}
    >
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={handleClose} className="nav-focusable p-2 rounded-lg hover:bg-white/10 transition" aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the collection — try “Keaton”, “1953” or “Lugosi”"
              className="gs-search w-full pl-12 pr-4 py-4 rounded-xl text-lg"
              onKeyDown={(e) => {
                if (e.key === "Escape") handleClose();
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 pb-24">
        {/* Quick links when empty */}
        {!query && (
          <div className="py-8">
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider font-semibold">Browse by mood</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_LINKS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    playNavSound();
                    setQuery(q);
                  }}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-sm font-medium transition nav-focusable"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && results.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-lg">Nothing found for &quot;{query}&quot;</p>
            <p className="text-sm mt-2">Try a genre, a year, or a star like Keaton, Lugosi or Chaplin.</p>
          </div>
        )}

        {/* Results grid — portrait poster cards */}
        {results.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {results.map((item) => (
                <SearchCard key={item.id} item={item} onSelect={onSelect} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SearchCard({ item, onSelect }: { item: MediaItem; onSelect: (m: MediaItem) => void }) {
  const meta = useTmdbMeta(item);
  const art = artFor(item, meta);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      className="gs-card gs-card-poster gs-card-poster-grid nav-focusable text-left"
      onClick={() => {
        playSelectSound();
        onSelect(item);
      }}
    >
      <div className="relative aspect-[2/3] bg-[#1a1a1a] overflow-hidden rounded-t-xl">
        {!imgFailed ? (
          <img
            key={art.poster}
            src={art.poster}
            alt={item.title}
            className={`w-full h-full object-cover ${art.posterIsTmdb ? "gs-art-swap" : "object-top"}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
            <span className="text-3xl">🎬</span>
            <span className="text-xs text-center px-2 line-clamp-2">{item.title}</span>
          </div>
        )}

        {meta?.rating != null && (
          <span className="gs-rating">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {meta.rating.toFixed(1)}
          </span>
        )}

        <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-2.5">
          <h3 className="text-xs md:text-sm font-bold line-clamp-2">{item.title}</h3>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-300 mt-0.5">
            <span>{item.year}</span>
            {item.runtime ? (
              <>
                <span className="text-gray-600">·</span>
                <span>{formatRuntime(item.runtime)}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
}
