"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StartupAnimation } from "@/components/StartupAnimation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ContentRow } from "@/components/ContentRow";
import { PlayerOverlay } from "@/components/PlayerOverlay";
import { DetailModal } from "@/components/DetailModal";
import { SearchOverlay } from "@/components/SearchOverlay";
import { LiveWallpaper } from "@/components/LiveWallpaper";
import { AmbientAudio } from "@/components/AmbientAudio";
import { FloatingNav } from "@/components/FloatingNav";
import { MyListSection } from "@/components/MyListSection";
import { TMDBMovie } from "@/lib/tmdb";

interface RowData {
  id: string;
  title: string;
  category: string;
  items: TMDBMovie[];
  mediaType?: string;
}

// Check if a movie is released
function isMovieReleased(movie: TMDBMovie): boolean {
  const releaseDate = movie.release_date || movie.first_air_date;
  if (!releaseDate) return true;
  return new Date(releaseDate) <= new Date();
}

const ALL_CATEGORIES = [
  { id: "trending", title: "🔥 Trending Now", category: "trending", page: 1 },
  { id: "popular", title: "⭐ Popular Movies", category: "popular", mediaType: "movie", page: 1 },
  { id: "top_rated", title: "🏆 Top Rated", category: "top_rated", mediaType: "movie", page: 2 },
  { id: "now_playing", title: "🎬 Now Playing", category: "now_playing", mediaType: "movie", page: 1 },
  { id: "upcoming", title: "📅 Coming Soon", category: "upcoming", mediaType: "movie", page: 1 },
  { id: "tv", title: "📺 Popular TV Shows", category: "tv", mediaType: "tv", page: 1 },
  { id: "28", title: "💥 Action", category: "28", mediaType: "movie", page: 1 },
  { id: "18", title: "🎭 Drama", category: "18", mediaType: "movie", page: 2 },
  { id: "35", title: "😂 Comedy", category: "35", mediaType: "movie", page: 1 },
  { id: "27", title: "👻 Horror", category: "27", mediaType: "movie", page: 2 },
  { id: "878", title: "🚀 Sci-Fi", category: "878", mediaType: "movie", page: 1 },
  { id: "10749", title: "❤️ Romance", category: "10749", mediaType: "movie", page: 2 },
  { id: "53", title: "🔪 Thriller", category: "53", mediaType: "movie", page: 1 },
  { id: "16", title: "🎨 Animation", category: "16", mediaType: "movie", page: 1 },
  { id: "99", title: "📖 Documentary", category: "99", mediaType: "movie", page: 2 },
  { id: "14", title: "🧙 Fantasy", category: "14", mediaType: "movie", page: 1 },
  { id: "10752", title: "⚔️ War", category: "10752", mediaType: "movie", page: 2 },
  { id: "80", title: "🕵️ Crime", category: "80", mediaType: "movie", page: 1 },
];

export default function Home() {
  const [showStartup, setShowStartup] = useState(true);
  const [rows, setRows] = useState<RowData[]>([]);
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [releasedHeroMovies, setReleasedHeroMovies] = useState<TMDBMovie[]>([]);
  const [focusedMovie, setFocusedMovie] = useState<TMDBMovie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<{ tmdbId: number; type: string; season?: number; episode?: number } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const loadedPages = useRef<Record<string, number>>({});
  const seenMovieIds = useRef<Set<number>>(new Set());

  const fetchRow = useCallback(async (cat: typeof ALL_CATEGORIES[0]) => {
    try {
      const res = await fetch(`/api/tmdb/feed?category=${cat.category}&page=${cat.page}`);
      const data = await res.json();
      let items = (data.results || []).filter((m: TMDBMovie) => m.poster_path);
      
      // Filter out already seen movies to avoid duplicates across categories
      items = items.filter((m: TMDBMovie) => {
        if (seenMovieIds.current.has(m.id)) return false;
        seenMovieIds.current.add(m.id);
        return true;
      });
      
      // Add media type if not present
      items = items.map((m: TMDBMovie) => ({
        ...m,
        media_type: m.media_type || cat.mediaType || "movie",
      }));
      
      loadedPages.current[cat.id] = cat.page;
      return { id: cat.id, title: cat.title, category: cat.category, items, mediaType: cat.mediaType };
    } catch {
      return { id: cat.id, title: cat.title, category: cat.category, items: [], mediaType: cat.mediaType };
    }
  }, []);

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      seenMovieIds.current.clear();
      
      const results = await Promise.all(ALL_CATEGORIES.map(fetchRow));
      
      setRows(results.filter((r) => r.items.length > 0));

      // Collect all RELEASED movies with backdrops for hero rotation
      const allReleasedWithBackdrop: TMDBMovie[] = [];
      results.forEach((row) => {
        row.items.forEach((m: TMDBMovie) => {
          if (m.backdrop_path && isMovieReleased(m)) {
            allReleasedWithBackdrop.push(m);
          }
        });
      });
      
      // Shuffle and take top 10 for hero rotation
      const shuffled = allReleasedWithBackdrop.sort(() => Math.random() - 0.5).slice(0, 10);
      setReleasedHeroMovies(shuffled);
      
      if (shuffled.length > 0) {
        setHeroMovie(shuffled[0]);
      }
      
      setLoading(false);
    }
    loadFeed();
  }, [fetchRow]);

  // Cycle hero through different released movies
  useEffect(() => {
    if (releasedHeroMovies.length < 2) return;
    
    const interval = setInterval(() => {
      setHeroIndex((prev) => {
        const next = (prev + 1) % releasedHeroMovies.length;
        setHeroMovie(releasedHeroMovies[next]);
        return next;
      });
    }, 8000);
    
    return () => clearInterval(interval);
  }, [releasedHeroMovies]);

  const loadMore = useCallback(async (rowId: string) => {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
    const currentPage = loadedPages.current[rowId] || 1;
    const nextPage = currentPage + 1;
    if (nextPage > 20) return;

    try {
      const res = await fetch(`/api/tmdb/feed?category=${row.category}&page=${nextPage}`);
      const data = await res.json();
      let newItems = (data.results || []).filter((m: TMDBMovie) => m.poster_path);
      
      // Filter duplicates
      newItems = newItems.filter((m: TMDBMovie) => {
        if (seenMovieIds.current.has(m.id)) return false;
        seenMovieIds.current.add(m.id);
        return true;
      });
      
      // Add media type
      newItems = newItems.map((m: TMDBMovie) => ({
        ...m,
        media_type: m.media_type || row.mediaType || "movie",
      }));
      
      loadedPages.current[rowId] = nextPage;
      setRows((prev) =>
        prev.map((r) => (r.id === rowId ? { ...r, items: [...r.items, ...newItems] } : r))
      );
    } catch {
      // ignore
    }
  }, [rows]);

  const handlePlay = useCallback((tmdbId: number, type: string, season?: number, episode?: number) => {
    setPlayingMovie({ tmdbId, type, season, episode });
    setSelectedMovie(null);
    // Save to history
    const movie = rows.flatMap((r) => r.items).find((m) => m.id === tmdbId);
    if (movie) {
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId,
          mediaType: type,
          title: movie.title || movie.name,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          season,
          episode,
          overview: movie.overview,
        }),
      }).catch(() => {});
    }
  }, [rows]);

  // Handle movie focus for background change
  const handleFocus = useCallback((movie: TMDBMovie | null) => {
    setFocusedMovie(movie);
  }, []);

  // Keyboard/gamepad navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (playingMovie) setPlayingMovie(null);
        else if (selectedMovie) setSelectedMovie(null);
        else if (showSearch) setShowSearch(false);
      }
      if (e.key === "/" || (e.key === "f" && e.ctrlKey)) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Backspace" && !showSearch) {
        e.preventDefault();
        if (playingMovie) setPlayingMovie(null);
        else if (selectedMovie) setSelectedMovie(null);
      }
      if (e.key === "Home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playingMovie, selectedMovie, showSearch]);

  // Filter rows based on activeFilter
  const filteredRows = rows.filter((row) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "movie") return row.mediaType === "movie" || row.id === "trending";
    if (activeFilter === "tv") return row.mediaType === "tv" || row.id === "tv";
    return true;
  });

  const handleHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveFilter("all");
  }, []);

  return (
    <>
      {showStartup && <StartupAnimation onComplete={() => setShowStartup(false)} />}

      <LiveWallpaper focusedMovie={focusedMovie} />
      <AmbientAudio muted={showStartup} />

      <div className="relative z-10">
        <Navbar
          onSearch={() => setShowSearch(true)}
          onHome={handleHome}
          onFilter={setActiveFilter}
          activeFilter={activeFilter}
        />

        {activeFilter === "mylist" ? (
          <div className="pt-24">
            <MyListSection onSelect={setSelectedMovie} onFocus={handleFocus} />
          </div>
        ) : (
          <>
            {heroMovie && (
              <HeroSection
                movie={heroMovie}
                onPlay={() => {
                  if (isMovieReleased(heroMovie)) {
                    handlePlay(heroMovie.id, heroMovie.media_type || "movie");
                  }
                }}
                onDetails={() => setSelectedMovie(heroMovie)}
              />
            )}

            <div className="relative z-10 -mt-20 pb-24">
              {loading && (
                <div className="px-6 space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="skeleton h-7 w-48 mb-4" />
                      <div className="flex gap-3 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <div key={j} className="skeleton flex-shrink-0 w-44 h-64 rounded-lg" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredRows.map((row, idx) => (
                <ContentRow
                  key={row.id}
                  title={row.title}
                  items={row.items}
                  delay={idx * 0.08}
                  onSelect={(m: TMDBMovie) => setSelectedMovie(m)}
                  onFocus={handleFocus}
                  onLoadMore={() => loadMore(row.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating navigation for TV/gamepad */}
      <FloatingNav onSearch={() => setShowSearch(true)} onHome={handleHome} />

      {showSearch && (
        <SearchOverlay
          onClose={() => setShowSearch(false)}
          onSelect={(m: TMDBMovie) => {
            setSelectedMovie(m);
            setShowSearch(false);
          }}
          onPlay={(id: number, type: string) => {
            handlePlay(id, type);
            setShowSearch(false);
          }}
        />
      )}

      {selectedMovie && (
        <DetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
        />
      )}

      {playingMovie && (
        <PlayerOverlay
          tmdbId={playingMovie.tmdbId}
          type={playingMovie.type}
          season={playingMovie.season}
          episode={playingMovie.episode}
          onClose={() => setPlayingMovie(null)}
        />
      )}
    </>
  );
}
