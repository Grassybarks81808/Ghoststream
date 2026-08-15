"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TMDBMovie, posterURL } from "@/lib/tmdb";
import { playNavSound, playSelectSound, playBackSound } from "@/lib/sounds";

interface Props {
  onClose: () => void;
  onSelect: (movie: TMDBMovie) => void;
  onPlay: (id: number, type: string) => void;
}

export function SearchOverlay({ onClose, onSelect, onPlay }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(
        (data.results || []).filter(
          (m: TMDBMovie) => (m.media_type === "movie" || m.media_type === "tv") && m.poster_path
        )
      );
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      setQuery(value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => search(value), 400);
    },
    [search]
  );

  const handleClose = useCallback(() => {
    playBackSound();
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[800] bg-[#0a0a0a]/95 backdrop-blur-xl" style={{ animation: "fadeInScale 0.3s ease-out" }}>
      {/* Search header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={handleClose} className="nav-focusable p-2 rounded-lg hover:bg-white/10 transition">
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
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Search movies, TV shows..."
              className="gs-search w-full pl-12 pr-4 py-4 rounded-xl text-lg"
              onKeyDown={(e) => {
                if (e.key === "Escape") handleClose();
              }}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 90px)" }}>
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[2/3] rounded-lg" />
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="text-center py-20 text-gray-500">
            <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <p className="text-lg">No results found for &quot;{query}&quot;</p>
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Start typing to search...</p>
            <p className="text-sm mt-2">Search for movies, TV shows, and more</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie) => {
              const t = movie.title || movie.name || "";
              const yr = (movie.release_date || movie.first_air_date || "").substring(0, 4);
              const rt = movie.vote_average ? movie.vote_average.toFixed(1) : "";

              return (
                <div
                  key={movie.id}
                  className="gs-card nav-focusable"
                  tabIndex={0}
                  onClick={() => {
                    playSelectSound();
                    onSelect(movie);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      playSelectSound();
                      onSelect(movie);
                    }
                  }}
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={posterURL(movie.poster_path, "w342")}
                      alt={t}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3">
                      <h3 className="text-sm font-bold line-clamp-2">{t}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                        {rt && <span className="text-green-400">★ {rt}</span>}
                        {yr && <span>{yr}</span>}
                        <span className="uppercase text-[10px] bg-white/20 px-1 rounded">
                          {movie.media_type === "tv" ? "TV" : "Movie"}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            playSelectSound();
                            onPlay(movie.id, movie.media_type || "movie");
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#000">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
