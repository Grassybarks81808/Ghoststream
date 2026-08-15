"use client";

import { useState, useEffect, useCallback } from "react";
import { TMDBMovie, posterURL } from "@/lib/tmdb";
import { playNavSound, playHoverSound, playBackSound } from "@/lib/sounds";
import { extractDominantColor } from "@/lib/colorExtract";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface BookmarkedItem {
  id: number;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string | null;
  releaseDate?: string;
}

interface Props {
  onSelect: (movie: TMDBMovie) => void;
  onFocus: (movie: TMDBMovie | null) => void;
}

export function MyListSection({ onSelect, onFocus }: Props) {
  const [items, setItems] = useState<BookmarkedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(() => {
    setLoading(true);
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const removeItem = useCallback(async (tmdbId: number, mediaType: string) => {
    playBackSound();
    // Optimistic removal from UI
    setItems((prev) => prev.filter((i) => !(i.tmdbId === tmdbId && i.mediaType === mediaType)));
    // Remove from server
    try {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId, mediaType }),
      });
    } catch {
      // If failed, reload the list
      loadItems();
    }
  }, [loadItems]);

  if (loading) {
    return (
      <div className="px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <GhostLogo size={36} />
          My List
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton aspect-[2/3] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-12 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <GhostLogo size={36} />
          My List
        </h1>
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <GhostLogoSad size={80} />
          <h2 className="text-xl font-bold mt-4 mb-2">Your list is empty</h2>
          <p className="text-sm text-center max-w-md">
            Add movies and TV shows to your list by clicking the + button on any title.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <GhostLogo size={36} />
        My List
        <span className="text-lg font-normal text-gray-500">({items.length})</span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {items.map((item) => (
          <MyListCard
            key={`${item.tmdbId}-${item.mediaType}`}
            item={item}
            onSelect={onSelect}
            onFocus={onFocus}
            onRemove={removeItem}
          />
        ))}
      </div>
    </div>
  );
}

function MyListCard({
  item,
  onSelect,
  onFocus,
  onRemove,
}: {
  item: BookmarkedItem;
  onSelect: (m: TMDBMovie) => void;
  onFocus: (m: TMDBMovie | null) => void;
  onRemove: (tmdbId: number, mediaType: string) => void;
}) {
  const [glowColor, setGlowColor] = useState("#e50914");
  const [isFocused, setIsFocused] = useState(false);
  const [releaseDate, setReleaseDate] = useState<string | null>(item.releaseDate || null);

  const poster = item.posterPath ? posterURL(item.posterPath, "w342") : "";
  
  // Check if released
  const isReleased = releaseDate ? new Date(releaseDate) <= new Date() : true;

  // Fetch release date if not available
  useEffect(() => {
    if (!releaseDate) {
      fetch(`/api/tmdb/details?id=${item.tmdbId}&type=${item.mediaType}`)
        .then((r) => r.json())
        .then((data) => {
          const date = data.release_date || data.first_air_date;
          if (date) setReleaseDate(date);
        })
        .catch(() => {});
    }
  }, [item.tmdbId, item.mediaType, releaseDate]);

  // Convert to TMDBMovie format
  const movie: TMDBMovie = {
    id: item.tmdbId,
    title: item.mediaType === "movie" ? item.title : undefined,
    name: item.mediaType === "tv" ? item.title : undefined,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    overview: item.overview || undefined,
    media_type: item.mediaType,
    release_date: item.mediaType === "movie" ? releaseDate || undefined : undefined,
    first_air_date: item.mediaType === "tv" ? releaseDate || undefined : undefined,
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    playHoverSound();
    onFocus(movie);
    if (poster) {
      extractDominantColor(poster).then(setGlowColor);
    }
  }, [movie, onFocus, poster]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocus(null);
  }, [onFocus]);

  return (
    <div
      className={`gs-card nav-focusable ${!isReleased ? "opacity-70" : ""}`}
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
        if (e.key === "Delete" || e.key === "Backspace") {
          e.stopPropagation();
          onRemove(item.tmdbId, item.mediaType);
        }
      }}
      style={
        isFocused
          ? {
              boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}40`,
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
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GhostLogo size={32} />
          </div>
        )}
        
        {/* Coming Soon overlay for unreleased */}
        {!isReleased && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <GhostLogoSad size={40} />
            <span className="text-xs font-bold mt-2 text-gray-300 uppercase tracking-wider">
              Coming Soon
            </span>
            {releaseDate && (
              <span className="text-xs text-gray-500 mt-1">
                {new Date(releaseDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
        
        {/* Hover overlay with remove button */}
        <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-sm font-bold line-clamp-2 mb-1">{item.title}</h3>
          <span className="text-xs text-gray-400 uppercase">{item.mediaType}</span>
          <div className="flex gap-2 mt-2">
            {isReleased && (
              <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#000">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.tmdbId, item.mediaType);
              }}
              className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
              title="Remove from My List"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
