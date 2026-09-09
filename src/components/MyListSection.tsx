"use client";

import { useState, useCallback } from "react";
import type { MediaItem } from "@/lib/catalog";
import { getItem, formatRuntime } from "@/lib/catalog";
import {
  removeBookmark,
  clearHistory,
  useBookmarks,
  useHistoryList,
  type BookmarkEntry,
  type HistoryEntry,
} from "@/lib/localStore";
import { formatTime } from "@/lib/localStore";
import { playNavSound, playHoverSound, playBackSound } from "@/lib/sounds";
import { extractDominantColor } from "@/lib/colorExtract";
import { useTmdbMeta, artFor } from "@/lib/tmdb";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface Props {
  onSelect: (item: MediaItem) => void;
  onFocus: (item: MediaItem | null) => void;
}

export function MyListSection({ onSelect, onFocus }: Props) {
  const [tab, setTab] = useState<"list" | "history">("list");
  const bookmarks = useBookmarks();
  const history = useHistoryList();

  const removeItem = useCallback((id: string) => {
    playBackSound();
    removeBookmark(id);
  }, []);

  const toMediaItem = (b: BookmarkEntry): MediaItem => {
    const full = getItem(b.id);
    return (
      full ?? {
        id: b.id,
        title: b.title,
        year: b.year,
        overview: b.overview,
        genres: b.genres as MediaItem["genres"],
        kind: b.kind,
      }
    );
  };

  return (
    <div className="px-6 md:px-12 py-8 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <GhostLogo size={36} />
          My Library
        </h1>
        <div className="flex gap-1 bg-white/5 rounded-full p-1">
          <button
            onClick={() => {
              playNavSound();
              setTab("list");
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              tab === "list" ? "bg-white text-black" : "text-gray-300 hover:text-white"
            }`}
          >
            My List {bookmarks.length > 0 && <span className="opacity-60">({bookmarks.length})</span>}
          </button>
          <button
            onClick={() => {
              playNavSound();
              setTab("history");
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              tab === "history" ? "bg-white text-black" : "text-gray-300 hover:text-white"
            }`}
          >
            Continue Watching {history.length > 0 && <span className="opacity-60">({history.length})</span>}
          </button>
        </div>
        {tab === "history" && history.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              playBackSound();
            }}
            className="text-xs text-gray-500 hover:text-gray-300 underline ml-auto"
          >
            Clear history
          </button>
        )}
      </div>

      {/* My List */}
      {tab === "list" && bookmarks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <GhostLogoSad size={80} />
          <h2 className="text-xl font-bold mt-4 mb-2 text-gray-300">Your list is empty</h2>
          <p className="text-sm text-center max-w-md">
            Add movies and cartoons to your list with the <strong>+</strong> button on any title.
            Your list lives on this device only — private by design.
          </p>
        </div>
      )}

      {tab === "list" && bookmarks.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {bookmarks.map((b) => (
            <ListCard
              key={b.id}
              item={toMediaItem(b)}
              onRemove={removeItem}
              onSelect={onSelect}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}

      {/* History */}
      {tab === "history" && history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <GhostLogoSad size={80} />
          <h2 className="text-xl font-bold mt-4 mb-2 text-gray-300">Nothing watched yet</h2>
          <p className="text-sm text-center max-w-md">
            Movies you watch show up here so you can pick up right where you left off.
          </p>
        </div>
      )}

      {tab === "history" && history.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {history.map((h) => {
            const full = getItem(h.id);
            const item: MediaItem =
              full ?? {
                id: h.id,
                title: h.title,
                year: h.year,
                overview: "",
                genres: [],
                kind: h.kind,
              };
            return <HistoryCard key={h.id} item={item} entry={h} onSelect={onSelect} />;
          })}
        </div>
      )}
    </div>
  );
}

function HistoryCard({
  item,
  entry,
  onSelect,
}: {
  item: MediaItem;
  entry: HistoryEntry;
  onSelect: (m: MediaItem) => void;
}) {
  const meta = useTmdbMeta(item);
  const art = artFor(item, meta);
  const pct = entry.duration > 0 ? Math.min(100, (entry.position / entry.duration) * 100) : 0;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      className="gs-card gs-card-poster gs-card-poster-grid nav-focusable text-left"
      onClick={() => {
        playNavSound();
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
        <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-2.5">
          <h3 className="text-xs md:text-sm font-bold line-clamp-2">{item.title}</h3>
          <p className="text-[10px] md:text-xs text-gray-300 mt-0.5">
            {formatTime(entry.position)}
            {entry.duration > 0 ? ` / ${formatTime(entry.duration)}` : ""} watched
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
          <div className="h-full bg-[#e50914]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </button>
  );
}

function ListCard({
  item,
  onRemove,
  onSelect,
  onFocus,
}: {
  item: MediaItem;
  onRemove: (id: string) => void;
  onSelect: (m: MediaItem) => void;
  onFocus: (m: MediaItem | null) => void;
}) {
  const [glowColor, setGlowColor] = useState("#e50914");
  const [isFocused, setIsFocused] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const meta = useTmdbMeta(item);
  const art = artFor(item, meta);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    playHoverSound();
    onFocus(item);
    if (!imgFailed) extractDominantColor(art.poster).then(setGlowColor);
  }, [item, onFocus, art.poster, imgFailed]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocus(null);
  }, [onFocus]);

  return (
    <div
      className="gs-card gs-card-poster gs-card-poster-grid nav-focusable"
      tabIndex={0}
      role="button"
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
        if (e.key === "Delete" || e.key === "Backspace") {
          e.stopPropagation();
          onRemove(item.id);
        }
      }}
      style={
        isFocused
          ? {
              boxShadow: `0 0 30px ${glowColor}66, 0 0 60px ${glowColor}33`,
              outline: `2px solid ${glowColor}`,
              outlineOffset: "2px",
            }
          : {}
      }
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

        <div className="card-info absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-2.5">
          <h3 className="text-xs md:text-sm font-bold line-clamp-2">{item.title}</h3>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mt-0.5">
            <span>{item.year}</span>
            {item.runtime ? <span>· {formatRuntime(item.runtime)}</span> : null}
          </div>
          <div className="flex gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#000">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
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
