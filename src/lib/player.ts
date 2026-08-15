/**
 * Stream Player
 * Handles playback of resolved stream URLs
 * 
 * Architecture:
 * - Works with pre-resolved URLs or embed fallbacks
 * - Provides embed URLs for browser playback
 * - Supports direct HLS/MP4 playback when available
 */

import { ResolvedStream, getEmbedUrl, ResolveOptions } from "./resolver";

export interface PlaybackInfo {
  type: "embed" | "direct";
  url: string;
  headers?: Record<string, string>;
  provider?: string;
}

/**
 * Get playback info for a movie/TV episode
 * If a resolved stream is available, returns direct playback URL
 * Otherwise returns embed URL for iframe playback
 */
export function getPlaybackInfo(
  options: ResolveOptions,
  resolvedStream?: ResolvedStream | null
): PlaybackInfo {
  if (resolvedStream) {
    return {
      type: "direct",
      url: resolvedStream.url,
      headers: resolvedStream.headers,
      provider: resolvedStream.provider,
    };
  }
  
  // Fallback to embed URL
  return {
    type: "embed",
    url: getEmbedUrl(options),
  };
}

/**
 * Build embed URL for browser-based playback
 */
export function buildEmbedUrl(
  tmdbId: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): string {
  if (type === "tv" && season && episode) {
    return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
  }
  return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
}

/**
 * Get alternative embed sources for fallback
 */
export function getAlternativeEmbeds(
  tmdbId: number,
  type: "movie" | "tv",
  season?: number,
  episode?: number
): string[] {
  const sources = [
    "vidsrc.xyz",
    "vidsrc.to",
    "2embed.cc",
    "autoembed.co",
    "vidsrc.pro",
  ];
  
  return sources.map(source => {
    if (type === "tv" && season && episode) {
      switch (source) {
        case "vidsrc.xyz":
          return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
        case "vidsrc.to":
          return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
        case "2embed.cc":
          return `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
        case "autoembed.co":
          return `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`;
        case "vidsrc.pro":
          return `https://vidsrc.pro/embed/tv/${tmdbId}/${season}/${episode}`;
        default:
          return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
      }
    } else {
      switch (source) {
        case "vidsrc.xyz":
          return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
        case "vidsrc.to":
          return `https://vidsrc.to/embed/movie/${tmdbId}`;
        case "2embed.cc":
          return `https://www.2embed.cc/embed/${tmdbId}`;
        case "autoembed.co":
          return `https://autoembed.co/movie/tmdb/${tmdbId}`;
        case "vidsrc.pro":
          return `https://vidsrc.pro/embed/movie/${tmdbId}`;
        default:
          return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
      }
    }
  });
}
