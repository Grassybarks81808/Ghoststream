"use client";

import { useEffect, useState } from "react";
import { GhostLogo } from "./GhostLogo";
import { playNavSound } from "@/lib/sounds";
import { STATS } from "@/lib/catalog";

interface Props {
  onSearch: () => void;
  onHome: () => void;
  onFilter: (filter: string) => void;
  activeFilter: string;
}

export function Navbar({ onSearch, onHome, onFilter, activeFilter }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // PWA install prompt (Chrome / Edge / Android)
  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as unknown as { prompt: () => Promise<void> });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const navItems = [
    { id: "all", label: "Home" },
    { id: "movies", label: "Movies" },
    { id: "cartoons", label: "Cartoons" },
    { id: "mylist", label: "My List" },
  ];

  return (
    <nav className={`gs-nav flex items-center justify-between ${scrolled ? "scrolled" : ""}`}>
      <div className="flex items-center gap-6">
        <button
          onClick={() => {
            playNavSound();
            onHome();
            onFilter("all");
          }}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity nav-focusable"
        >
          <GhostLogo size={36} />
          <span className="text-[#e50914] font-black text-xl tracking-wider hidden sm:inline">
            GHOSTSTREAM
          </span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playNavSound();
                onFilter(item.id);
                if (item.id === "all") onHome();
              }}
              className={`nav-focusable px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === item.id
                  ? "bg-white text-black"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {installPrompt && (
          <button
            onClick={async () => {
              playNavSound();
              await installPrompt.prompt();
              setInstallPrompt(null);
            }}
            className="nav-focusable hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#e50914] hover:bg-[#ff1a27] text-sm font-bold transition-colors"
            title="Install Ghoststream as an app"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span className="hidden lg:inline">Install App</span>
          </button>
        )}
        <span className="hidden xl:block text-xs text-gray-500">
          {STATS.titles} free titles
        </span>
        <button
          onClick={() => {
            playNavSound();
            onSearch();
          }}
          className="nav-focusable p-2.5 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Search"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e50914] to-[#b81d24] flex items-center justify-center">
          <GhostLogo size={24} />
        </div>
      </div>
    </nav>
  );
}
