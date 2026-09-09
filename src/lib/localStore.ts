/**
 * Local persistence (My List + watch history/progress) via localStorage.
 * 100% client-side — no accounts, no tracking, nothing leaves the device.
 *
 * React components read this store through the useSyncExternalStore hooks
 * below (no effects, no hydration mismatches, instant updates).
 */

import { useSyncExternalStore } from "react";
import type { MediaItem } from "./catalog";

const BOOKMARKS_KEY = "gs:bookmarks";
const HISTORY_KEY = "gs:history";

export interface BookmarkEntry {
  id: string;
  title: string;
  year: number;
  overview: string;
  kind: "movie" | "cartoon";
  genres: string[];
  addedAt: number;
}

export interface HistoryEntry {
  id: string;
  title: string;
  year: number;
  kind: "movie" | "cartoon";
  /** last playback position, seconds */
  position: number;
  /** total duration, seconds */
  duration: number;
  updatedAt: number;
}

// ─── low-level storage access ───────────────────────────────────────────

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / private mode
  }
  invalidate();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("gs:store"));
  }
}

// ─── external store plumbing (useSyncExternalStore) ─────────────────────

let bookmarksCache: BookmarkEntry[] | null = null;
let historyCache: HistoryEntry[] | null = null;
const EMPTY_BOOKMARKS: BookmarkEntry[] = [];
const EMPTY_HISTORY: HistoryEntry[] = [];

function invalidate() {
  bookmarksCache = null;
  historyCache = null;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("gs:store", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("gs:store", callback);
    window.removeEventListener("storage", callback);
  };
}

function bookmarksSnapshot(): BookmarkEntry[] {
  if (bookmarksCache === null) {
    bookmarksCache = read<BookmarkEntry>(BOOKMARKS_KEY).sort((a, b) => b.addedAt - a.addedAt);
  }
  return bookmarksCache;
}

function historySnapshot(): HistoryEntry[] {
  if (historyCache === null) {
    historyCache = read<HistoryEntry>(HISTORY_KEY).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return historyCache;
}

/** My List entries, newest first. */
export function useBookmarks(): BookmarkEntry[] {
  return useSyncExternalStore(subscribe, bookmarksSnapshot, () => EMPTY_BOOKMARKS);
}

/** Watch history, newest first. */
export function useHistoryList(): HistoryEntry[] {
  return useSyncExternalStore(subscribe, historySnapshot, () => EMPTY_HISTORY);
}

/** Whether a title is in My List. */
export function useIsBookmarked(id: string): boolean {
  return useSyncExternalStore(subscribe, () => isBookmarked(id), () => false);
}

/** Saved playback position for a title (null if never watched). */
export function useProgress(id: string): HistoryEntry | null {
  const history = useHistoryList();
  return history.find((h) => h.id === id) ?? null;
}

// ─── imperative accessors (non-hook, event handlers & effects) ──────────

export function listBookmarks(): BookmarkEntry[] {
  return [...bookmarksSnapshot()];
}

export function isBookmarked(id: string): boolean {
  return read<BookmarkEntry>(BOOKMARKS_KEY).some((b) => b.id === id);
}

export function getProgress(id: string): HistoryEntry | null {
  return read<HistoryEntry>(HISTORY_KEY).find((h) => h.id === id) ?? null;
}

/** returns the new bookmarked state */
export function toggleBookmark(item: MediaItem): boolean {
  const list = read<BookmarkEntry>(BOOKMARKS_KEY);
  const idx = list.findIndex((b) => b.id === item.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    write(BOOKMARKS_KEY, list);
    return false;
  }
  list.push({
    id: item.id,
    title: item.title,
    year: item.year,
    overview: item.overview,
    kind: item.kind,
    genres: item.genres,
    addedAt: Date.now(),
  });
  write(BOOKMARKS_KEY, list);
  return true;
}

export function removeBookmark(id: string) {
  write(
    BOOKMARKS_KEY,
    read<BookmarkEntry>(BOOKMARKS_KEY).filter((b) => b.id !== id)
  );
}

export function saveProgress(item: MediaItem, position: number, duration: number) {
  if (!Number.isFinite(position) || position < 5) return;
  const list = read<HistoryEntry>(HISTORY_KEY).filter((h) => h.id !== item.id);
  list.push({
    id: item.id,
    title: item.title,
    year: item.year,
    kind: item.kind,
    position: Math.floor(position),
    duration: Math.floor(duration || 0),
    updatedAt: Date.now(),
  });
  list.sort((a, b) => b.updatedAt - a.updatedAt);
  write(HISTORY_KEY, list.slice(0, 100));
}

export function clearHistory() {
  write(HISTORY_KEY, []);
}

/** format seconds as h:mm:ss / m:ss */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}
