/**
 * TMDB enrichment (client-side, legal metadata only)
 *
 * Uses the TMDB API (user-supplied key) to fetch real posters, backdrops,
 * ratings and genres for the public-domain catalog. Artwork & data are
 * cached in localStorage so each title is only looked up once.
 *
 * NOTE: TMDB provides METADATA ONLY here — all playback and downloads
 * still come from the Internet Archive (public domain).
 *
 * This product uses the TMDB API but is not endorsed or certified by TMDB.
 */

import { useEffect, useState } from "react";
import type { MediaItem } from "./catalog";

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNDc4NzEzNWJmYTFiZjE0MzY2MzkxMGZhODc0MDc1OSIsIm5pZiI6MTc3OTM3Mzk1My40ODQsInN1YiI6IjZhMGYxNzgxOTlmZDA2YTc2NjA0NjM1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cR30-l55LLly3D5gJVGM0gTsd0VQq51pnD_Mnxp3DLA";

const BASE = "https://api.themoviedb.org/3";
const CACHE_PREFIX = "gs:tmdb:";
const HIT_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days
const MISS_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days for "not found"

// Standard TMDB genre id → name map (stable, from their public genres list)
const TMDB_GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Sci-Fi", 53: "Thriller", 10752: "War", 37: "Western", 10770: "TV Movie",
};

export interface TmdbMeta {
  tmdbId: number;
  poster: string | null;   // w342
  backdrop: string | null; // w1280
  rating: number | null;   // vote_average 0-10
  genres: string[];
  tmdbUrl: string;
}

interface TmdbSearchResult {
  id: number;
  title?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
}

interface CacheEntry {
  t: number;
  meta: TmdbMeta | null; // null = looked up, not found
}

const inflight = new Map<string, Promise<TmdbMeta | null>>();

function readCache(id: string): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function writeCache(id: string, meta: TmdbMeta | null) {
  try {
    localStorage.setItem(CACHE_PREFIX + id, JSON.stringify({ t: Date.now(), meta }));
  } catch {
    // best effort
  }
}

async function tmdbFetch(path: string): Promise<unknown | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(`${BASE}${path}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        accept: "application/json",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Pick the best match from TMDB search results for our catalog item. */
function pickMatch(
  item: { title: string; year: number },
  results: TmdbSearchResult[]
): TmdbSearchResult | null {
  if (results.length === 0) return null;

  const wanted = normalize(item.title);

  const score = (r: TmdbSearchResult): number => {
    const t = normalize(r.title || "");
    if (!t) return -1;
    let s = 0;
    if (t === wanted) s += 100;
    else if (t.startsWith(wanted) || wanted.startsWith(t)) s += 60;
    else if (t.includes(wanted) || wanted.includes(t)) s += 30;
    else return -1;

    if (r.release_date) {
      const y = Number(r.release_date.slice(0, 4));
      if (Number.isFinite(y)) {
        const diff = Math.abs(y - item.year);
        if (diff === 0) s += 50;
        else if (diff <= 2) s += 25;
        else if (diff <= 5) s += 5;
        else s -= 40; // same name, wrong film
      }
    }
    if (r.poster_path) s += 10;
    if ((r.vote_average ?? 0) > 0) s += 5;
    return s;
  };

  let best: TmdbSearchResult | null = null;
  let bestScore = 0;
  for (const r of results) {
    const s = score(r);
    if (s > bestScore) {
      bestScore = s;
      best = r;
    }
  }
  return bestScore >= 30 ? best : null;
}

/** Look up TMDB art & metadata for a catalog item (cached). */
export async function fetchTmdbMeta(
  item: Pick<MediaItem, "id" | "title" | "year">
): Promise<TmdbMeta | null> {
  const cached = readCache(item.id);
  if (cached) {
    const ttl = cached.meta ? HIT_TTL : MISS_TTL;
    if (Date.now() - cached.t < ttl) return cached.meta;
  }

  const existing = inflight.get(item.id);
  if (existing) return existing;

  const promise = (async (): Promise<TmdbMeta | null> => {
    // 1) search with year for precision
    let data = (await tmdbFetch(
      `/search/movie?query=${encodeURIComponent(item.title)}&year=${item.year}&include_adult=false`
    )) as { results?: TmdbSearchResult[] } | null;

    let match = data?.results ? pickMatch(item, data.results) : null;

    // 2) retry without year (silent-film release years often differ)
    if (!match) {
      data = (await tmdbFetch(
        `/search/movie?query=${encodeURIComponent(item.title)}&include_adult=false`
      )) as { results?: TmdbSearchResult[] } | null;
      match = data?.results ? pickMatch(item, data.results) : null;
    }

    const meta: TmdbMeta | null = match
      ? {
          tmdbId: match.id,
          poster: match.poster_path
            ? `https://image.tmdb.org/t/p/w342${match.poster_path}`
            : null,
          backdrop: match.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${match.backdrop_path}`
            : null,
          rating:
            typeof match.vote_average === "number" && match.vote_average > 0
              ? match.vote_average
              : null,
          genres: (match.genre_ids || [])
            .map((g) => TMDB_GENRES[g])
            .filter((g): g is string => Boolean(g))
            .slice(0, 4),
          tmdbUrl: `https://www.themoviedb.org/movie/${match.id}`,
        }
      : null;

    writeCache(item.id, meta);
    return meta;
  })();

  inflight.set(item.id, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(item.id);
  }
}

/**
 * Progressive-enhancement hook: returns TMDB metadata for a catalog item,
 * or null until it resolves. First paint uses archive.org art, then swaps.
 */
export function useTmdbMeta(item: MediaItem): TmdbMeta | null {
  const { id, title, year } = item;
  const [state, setState] = useState<{ id: string; meta: TmdbMeta | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchTmdbMeta({ id, title, year }).then((m) => {
      if (!cancelled && m) setState({ id, meta: m });
    });
    return () => {
      cancelled = true;
    };
  }, [id, title, year]);

  // ignore results that belong to a previously-shown item
  return state && state.id === id ? state.meta : null;
}

/** Convenience: combined art URLs with archive.org fallbacks. */
export function artFor(item: MediaItem, meta: TmdbMeta | null) {
  return {
    poster: meta?.poster ?? `https://archive.org/services/img/${item.id}`,
    backdrop: meta?.backdrop ?? `https://archive.org/services/img/${item.id}`,
    posterIsTmdb: Boolean(meta?.poster),
    backdropIsTmdb: Boolean(meta?.backdrop),
  };
}
