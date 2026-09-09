"use client";

import { useState, useEffect, useCallback } from "react";
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
import { PWARegister } from "@/components/PWARegister";
import { GhostLogo } from "@/components/GhostLogo";
import type { MediaItem } from "@/lib/catalog";
import { ROWS, itemsForGenre, STATS } from "@/lib/catalog";

// Rows are pure static data — computed once, deterministically.
const ALL_ROWS = ROWS.map((row) => ({ ...row, items: itemsForGenre(row.genre) })).filter(
  (r) => r.items.length > 0
);
const HERO_LIST = itemsForGenre("featured");

export default function Home() {
  const [showStartup, setShowStartup] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [focusedItem, setFocusedItem] = useState<MediaItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playingItem, setPlayingItem] = useState<MediaItem | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const rows = ALL_ROWS;
  const heroItem = HERO_LIST.length > 0 ? HERO_LIST[heroIndex % HERO_LIST.length] : null;

  // Rotate the hero through featured titles (async — no sync state updates)
  useEffect(() => {
    if (HERO_LIST.length < 2) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_LIST.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = useCallback((item: MediaItem) => {
    setPlayingItem(item);
    setSelectedItem(null);
  }, []);

  const handleFocus = useCallback((item: MediaItem | null) => {
    setFocusedItem(item);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (playingItem) return; // player handles its own keys
      if (e.key === "Escape") {
        if (selectedItem) setSelectedItem(null);
        else if (showSearch) setShowSearch(false);
      }
      if (e.key === "/" || (e.key === "f" && e.ctrlKey)) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Backspace" && !showSearch) {
        e.preventDefault();
        if (selectedItem) setSelectedItem(null);
      }
      if (e.key === "Home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playingItem, selectedItem, showSearch]);

  const visibleRows = rows.filter((row) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "movies") return row.genre !== "cartoon";
    if (activeFilter === "cartoons") return row.genre === "cartoon";
    return true;
  });

  const handleHome = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <PWARegister />
      {showStartup && <StartupAnimation onComplete={() => setShowStartup(false)} />}

      <LiveWallpaper focusedItem={focusedItem} />
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
            <MyListSection onSelect={setSelectedItem} onFocus={handleFocus} />
          </div>
        ) : (
          <>
            {heroItem && (
              <HeroSection
                key={heroItem.id}
                item={heroItem}
                onPlay={() => handlePlay(heroItem)}
                onDetails={() => setSelectedItem(heroItem)}
              />
            )}

            <div className="relative z-10 -mt-24 pb-8">
              {visibleRows.map((row, idx) => (
                <ContentRow
                  key={row.id}
                  title={row.title}
                  items={row.items}
                  delay={Math.min(idx * 0.08, 0.6)}
                  onSelect={(m) => setSelectedItem(m)}
                  onFocus={handleFocus}
                />
              ))}
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 lg:px-16 py-10 mt-4">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <GhostLogo size={40} />
                  <div>
                    <p className="font-black text-lg tracking-wider">
                      GHOST<span className="text-[#e50914]">STREAM</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                      {STATS.titles} hand-curated public-domain classics — {STATS.oldest} to the
                      1960s. Streamed and downloaded straight from the Internet Archive. No ads, no
                      accounts, no tracking. Free forever.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-600 leading-relaxed">
                  <p>
                    📚 Content:{" "}
                    <a
                      href="https://archive.org/details/feature_films"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-400"
                    >
                      Internet Archive
                    </a>{" "}
                    — public-domain films
                  </p>
                  <p>⚖️ Every title is public domain (US) or Creative Commons licensed.</p>
                  <p>🍿 Made for movie nights. Press <kbd className="px-1 bg-white/10 rounded">/</kbd> to search.</p>
                  <p className="mt-1">
                    🎞️ This product uses the TMDB API but is not endorsed or certified by TMDB.
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>

      <FloatingNav onSearch={() => setShowSearch(true)} onHome={handleHome} />

      {showSearch && (
        <SearchOverlay
          onClose={() => setShowSearch(false)}
          onSelect={(m) => {
            setSelectedItem(m);
            setShowSearch(false);
          }}
        />
      )}

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} onPlay={handlePlay} />
      )}

      {playingItem && (
        <PlayerOverlay item={playingItem} onClose={() => setPlayingItem(null)} />
      )}
    </>
  );
}
