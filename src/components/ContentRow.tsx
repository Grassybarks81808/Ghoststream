"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { TMDBMovie, posterURL } from "@/lib/tmdb";
import { playNavSound, playHoverSound } from "@/lib/sounds";
import { extractDominantColor } from "@/lib/colorExtract";
import { GhostLogoSad } from "./GhostLogo";

interface Props {
  title: string;
  items: TMDBMovie[];
  delay: number;
  onSelect: (movie: TMDBMovie) => void;
  onFocus: (movie: TMDBMovie | null) => void;
  onLoadMore: () => void;
}

// Check if movie is released - robust check
function isMovieReleased(movie: TMDBMovie): boolean {
  const releaseDateStr = movie.release_date || movie.first_air_date;
  if (!releaseDateStr) return true; // No date = assume released
  
  try {
    const releaseDate = new Date(releaseDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    releaseDate.setHours(0, 0, 0, 0);
    return releaseDate <= today;
  } catch {
    return true;
  }
}

export function ContentRow({ title, items, delay, onSelect, onFocus, onLoadMore }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadTriggered = useRef(false);

  const scroll = useCallback((dir: number) => {
    if (!scrollRef.current) return;
    playNavSound();
    scrollRef.current.scrollBy({ left: dir * 600, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loadTriggered.current) return;
    const el = scrollRef.current;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 400) {
      loadTriggered.current = true;
      onLoadMore();
      setTimeout(() => { loadTriggered.current = false; }, 2000);
    }
  }, [onLoadMore]);

  return (
    <div className="gs-row mb-8 px-4 md:px-6 lg:px-12" style={{ animationDelay: `${delay}s` }}>
      <h2 className="text-lg md:text-xl font-bold mb-3 text-white">{title}</h2>
      <div className="relative group">
        {/* Scroll arrows */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent z-10 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity nav-focusable"
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/80 to-transparent z-10 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity nav-focusable"
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="gs-row-scroll flex gap-2 md:gap-3 overflow-x-auto py-4"
          onScroll={handleScroll}
        >
          {items.map((movie, idx) => (
            <MovieCard
              key={`${movie.id}-${idx}`}
              movie={movie}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({
  movie,
  onSelect,
  onFocus,
}: {
  movie: TMDBMovie;
  onSelect: (m: TMDBMovie) => void;
  onFocus: (m: TMDBMovie | null) => void;
}) {
  const [glowColor, setGlowColor] = useState("#e50914");
  const [isFocused, setIsFocused] = useState(false);
  const colorExtracted = useRef(false);

  const title = movie.title || movie.name || "";
  const year = (movie.release_date || movie.first_air_date || "").substring(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "";
  const poster = posterURL(movie.poster_path, "w342");

  // Check if movie is released
  const isReleased = isMovieReleased(movie);
  const releaseDate = movie.release_date || movie.first_air_date;

  // Extract color on hover
  useEffect(() => {
    if (isFocused && poster && !colorExtracted.current) {
      colorExtracted.current = true;
      extractDominantColor(poster).then(setGlowColor);
    }
  }, [isFocused, poster]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    playHoverSound();
    onFocus(movie);
  }, [movie, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocus(null);
  }, [onFocus]);

  return (
    <div
      className="gs-card flex-shrink-0 w-36 md:w-44 lg:w-48 nav-focusable relative"
      tabIndex={0}
      role="button"
      onClick={() => {
        playNavSound();
        onSelect(movie);
      }}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          playNavSound();
          onSelect(movie);
        }
      }}
      style={
        isFocused
          ? {
              boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}40`,
              borderColor: glowColor,
              outline: `2px solid ${glowColor}`,
              outlineOffset: "2px",
            }
          : {}
      }
    >
      <div className="relative aspect-[2/3] bg-[#1a1a1a]">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className={`w-full h-full object-cover ${!isReleased ? "opacity-50 grayscale-[30%]" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm text-center p-2">
            {title}
          </div>
        )}

        {/* Coming Soon overlay for unreleased movies */}
        {!isReleased && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <GhostLogoSad size={40} />
            <span className="text-xs font-bold mt-2 text-gray-300 uppercase tracking-wider">
              Coming Soon
            </span>
            {releaseDate && (
              <span className="text-[10px] text-gray-500 mt-1">
                {new Date(releaseDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Hover overlay for released movies */}
        {isReleased && (
          <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-sm font-bold line-clamp-2 mb-1">{title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              {rating && (
                <span className="text-green-400 font-semibold flex items-center gap-0.5">
                  ★ {rating}
                </span>
              )}
              {year && <span>{year}</span>}
            </div>
            <div className="flex gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#000">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
