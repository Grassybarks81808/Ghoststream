/**
 * Stream URL Resolver
 * Resolves TMDB movie/TV IDs to actual playback URLs
 * 
 * Architecture:
 * - Multiple provider support with fallbacks
 * - Automatic URL extraction from embed pages
 * - No manual user input required
 */

export interface ResolvedStream {
  url: string;
  quality?: string;
  provider: string;
  headers?: Record<string, string>;
}

export interface ResolveOptions {
  tmdbId: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

// Provider configurations
const PROVIDERS = [
  {
    name: "vidsrc.xyz",
    movieUrl: (id: number) => `https://vidsrc.xyz/embed/movie/${id}`,
    tvUrl: (id: number, s: number, e: number) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}`,
    apiUrl: (id: number, type: string, s?: number, e?: number) => 
      type === "tv" ? `https://vidsrc.xyz/api/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/api/movie/${id}`,
  },
  {
    name: "vidsrc.to",
    movieUrl: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tvUrl: (id: number, s: number, e: number) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "2embed",
    movieUrl: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tvUrl: (id: number, s: number, e: number) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: "autoembed",
    movieUrl: (id: number) => `https://autoembed.co/movie/tmdb/${id}`,
    tvUrl: (id: number, s: number, e: number) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: "vidsrc.pro", 
    movieUrl: (id: number) => `https://vidsrc.pro/embed/movie/${id}`,
    tvUrl: (id: number, s: number, e: number) => `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
];

/**
 * Fetch with timeout and proper headers
 */
async function fetchWithHeaders(url: string, referer?: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        ...(referer && { "Referer": referer }),
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Extract stream URLs from HTML content
 */
function extractStreamUrls(html: string): string[] {
  const urls: string[] = [];
  
  // Pattern 1: Direct m3u8/mp4 URLs
  const directPatterns = [
    /https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]+\/playlist\.m3u8[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]+\/master\.m3u8[^\s"'<>]*/gi,
    /https?:\/\/[^\s"'<>]+\/index\.m3u8[^\s"'<>]*/gi,
  ];
  
  for (const pattern of directPatterns) {
    const matches = html.match(pattern);
    if (matches) {
      urls.push(...matches.map(u => u.replace(/[\\'"]/g, '').trim()));
    }
  }
  
  // Pattern 2: JSON/JS source definitions
  const sourcePatterns = [
    /"(?:file|source|src|url|stream|hls|video)":\s*"(https?:\/\/[^"]+)"/gi,
    /'(?:file|source|src|url|stream|hls|video)':\s*'(https?:\/\/[^']+)'/gi,
    /(?:file|source|src|url|stream|hls|video)\s*[:=]\s*["'](https?:\/\/[^"']+)/gi,
    /sources\s*:\s*\[\s*\{\s*["']?(?:file|src)["']?\s*:\s*["'](https?:\/\/[^"']+)/gi,
  ];
  
  for (const pattern of sourcePatterns) {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (match[1]) urls.push(match[1]);
    }
  }
  
  // Pattern 3: Base64 encoded URLs
  const base64Pattern = /atob\s*\(\s*["']([A-Za-z0-9+/=]+)["']\s*\)/g;
  let b64Match;
  while ((b64Match = base64Pattern.exec(html)) !== null) {
    try {
      const decoded = Buffer.from(b64Match[1], 'base64').toString('utf-8');
      const urlMatch = decoded.match(/https?:\/\/[^\s"'<>]+(?:\.m3u8|\.mp4)[^\s"'<>]*/);
      if (urlMatch) urls.push(urlMatch[0]);
    } catch {}
  }
  
  // Pattern 4: Encrypted/encoded strings that might contain URLs
  const encodedPattern = /["'][A-Za-z0-9+/=]{50,}["']/g;
  const encodedMatches = html.match(encodedPattern);
  if (encodedMatches) {
    for (const encoded of encodedMatches) {
      try {
        const cleaned = encoded.replace(/["']/g, '');
        const decoded = Buffer.from(cleaned, 'base64').toString('utf-8');
        if (decoded.includes('http') && (decoded.includes('.m3u8') || decoded.includes('.mp4'))) {
          const urlMatch = decoded.match(/https?:\/\/[^\s"'<>]+/);
          if (urlMatch) urls.push(urlMatch[0]);
        }
      } catch {}
    }
  }
  
  // Dedupe and validate
  return [...new Set(urls)].filter(url => {
    try {
      new URL(url);
      return url.includes('.m3u8') || url.includes('.mp4');
    } catch {
      return false;
    }
  });
}

/**
 * Extract iframe sources from HTML
 */
function extractIframeSources(html: string): string[] {
  const iframes: string[] = [];
  const pattern = /<iframe[^>]*src=["']([^"']+)["']/gi;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    if (match[1] && match[1].startsWith('http') && 
        !match[1].includes('google') && 
        !match[1].includes('facebook') &&
        !match[1].includes('ads')) {
      iframes.push(match[1]);
    }
  }
  return iframes;
}

/**
 * Try to resolve stream URL from a provider page
 */
async function resolveFromProvider(
  embedUrl: string, 
  providerName: string
): Promise<ResolvedStream | null> {
  try {
    // Fetch the embed page
    const res = await fetchWithHeaders(embedUrl);
    if (!res.ok) return null;
    
    const html = await res.text();
    
    // Try to extract URLs directly
    let urls = extractStreamUrls(html);
    
    if (urls.length > 0) {
      return {
        url: urls[0],
        provider: providerName,
        headers: { "Referer": embedUrl },
      };
    }
    
    // Follow iframes
    const iframes = extractIframeSources(html);
    for (const iframeSrc of iframes.slice(0, 3)) {
      try {
        const iframeRes = await fetchWithHeaders(iframeSrc, embedUrl, 8000);
        if (!iframeRes.ok) continue;
        
        const iframeHtml = await iframeRes.text();
        urls = extractStreamUrls(iframeHtml);
        
        if (urls.length > 0) {
          return {
            url: urls[0],
            provider: providerName,
            headers: { "Referer": iframeSrc },
          };
        }
        
        // Check for nested iframes
        const nestedIframes = extractIframeSources(iframeHtml);
        for (const nested of nestedIframes.slice(0, 2)) {
          try {
            const nestedRes = await fetchWithHeaders(nested, iframeSrc, 5000);
            if (!nestedRes.ok) continue;
            
            const nestedHtml = await nestedRes.text();
            urls = extractStreamUrls(nestedHtml);
            
            if (urls.length > 0) {
              return {
                url: urls[0],
                provider: providerName,
                headers: { "Referer": nested },
              };
            }
          } catch {}
        }
      } catch {}
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Validate that a stream URL is accessible
 */
export async function validateStreamUrl(url: string, referer?: string): Promise<boolean> {
  try {
    const res = await fetchWithHeaders(url, referer, 5000);
    // Check for valid video response
    const contentType = res.headers.get('content-type') || '';
    return res.ok || contentType.includes('mpegurl') || contentType.includes('mp4') || contentType.includes('video');
  } catch {
    return false;
  }
}

/**
 * Main resolver function
 * Resolves a TMDB ID to a playable stream URL
 */
export async function resolveStreamUrl(options: ResolveOptions): Promise<ResolvedStream | null> {
  const { tmdbId, type, season, episode } = options;
  
  // Try each provider
  for (const provider of PROVIDERS) {
    const embedUrl = type === "tv" && season && episode
      ? provider.tvUrl(tmdbId, season, episode)
      : provider.movieUrl(tmdbId);
    
    const resolved = await resolveFromProvider(embedUrl, provider.name);
    
    if (resolved) {
      // Validate the URL
      const isValid = await validateStreamUrl(resolved.url, resolved.headers?.Referer);
      if (isValid) {
        return resolved;
      }
    }
  }
  
  return null;
}

/**
 * Get embed URL for browser playback (fallback when resolution fails)
 */
export function getEmbedUrl(options: ResolveOptions): string {
  const { tmdbId, type, season, episode } = options;
  
  if (type === "tv" && season && episode) {
    return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
  }
  return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
}
