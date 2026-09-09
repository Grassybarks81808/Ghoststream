"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import type { MediaItem } from "@/lib/catalog";
import { posterUrl, formatRuntime } from "@/lib/catalog";
import { useProgress } from "@/lib/localStore";
import { playNavSound, playHoverSound } from "@/lib/sounds";
import { extractDominantColor } from "@/lib/colorExtract";

interface Props {
  title: string;
  items: MediaItem[];
  delay: number;
  onSelect: (item: MediaItem) => void;
  onFocus: (item: MediaItem | null) => void;
}

export function ContentRow({ title, items, delay, onSelect, onFocus }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: number) => {
    if (!scrollRef.current) return;
    playNavSound();
    scrollRef.current.scrollBy({ left: dir * 640, behavior: "smooth" });
  }, []);

  if (items.length === 0) return null;

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

        <div ref={scrollRef} className="gs-row-scroll flex gap-2 md:gap-3 overflow-x-auto py-4">
          {items.map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} item={item} onSelect={onSelect} onFocus={onFocus} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MovieCard({
  item,
  onSelect,
  onFocus,
}: {
  item: MediaItem;
  onSelect: (m: MediaItem) => void;
  onFocus: (m: MediaItem | null) => void;
}) {
  const [glowColor, setGlowColor] = useState("#e50914");
  const [isFocused, setIsFocused] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const colorExtracted = useRef(false);
  const prior = useProgress(item.id);
  const progress =
    prior && prior.duration > 0 ? Math.min(100, (prior.position / prior.duration) * 100) : 0;

  const poster = posterUrl(item.id);

  useEffect(() => {
    if (isFocused && !colorExtracted.current && !imgFailed) {
      colorExtracted.current = true;
      extractDominantColor(poster).then(setGlowColor);
    }
  }, [isFocused, poster, imgFailed]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    playHoverSound();
    onFocus(item);
  }, [item, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocus(null);
  }, [onFocus]);

  return (
    <div
      className="gs-card gs-card-wide nav-focusable relative"
      tabIndex={0}
      role="button"
      aria-label={`${item.title} (${item.year})`}
      onClick={() => {
        playNavSound();
        onSelect(item);
      }}
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          playNavSound();
          onSelect(item);
        }
      }}
      style={
        isFocused
          ? {
              boxShadow: `0 0 30px ${glowColor}66, 0 0 60px ${glowColor}33`,
              borderColor: glowColor,
              outline: `2px solid ${glowColor}`,
              outlineOffset: "2px",
            }
          : {}
      }
    >
      <div className="relative aspect-video bg-[#1a1a1a] overflow-hidden rounded-t-xl">
        {!imgFailed ? (
          <img
            src={poster}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
            <span className="text-3xl">🎬</span>
            <span className="text-xs text-center px-2 line-clamp-2">{item.title}</span>
          </div>
        )}

        {/* hover overlay */}
        <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-sm font-bold line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
            <span>{item.year}</span>
            {item.runtime ? <span className="text-gray-600">·</span> : null}
            {item.runtime ? <span>{formatRuntime(item.runtime)}</span> : null}
            <span className="text-gray-600">·</span>
            <span className="uppercase text-[10px] tracking-wide bg-white/15 px-1.5 py-0.5 rounded">
              {item.kind === "cartoon" ? "Cartoon" : "Movie"}
            </span>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#000">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <span className="text-[10px] text-gray-400 line-clamp-1 flex-1">
              Free · Public Domain · No Ads
            </span>
          </div>
        </div>

        {/* watch progress bar */}
        {progress > 2 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
            <div
              className="h-full bg-[#e50914]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
