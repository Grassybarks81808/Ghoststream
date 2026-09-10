"use client";

import { useState, useEffect } from "react";
import { GhostLogo } from "./GhostLogo";
import { playNavSound } from "@/lib/sounds";

interface Props {
  onSearch: () => void;
  onHome: () => void;
}

export function FloatingNav({ onSearch, onHome }: Props) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`gs-safe-bottom fixed bottom-6 right-6 z-[100] flex flex-col-reverse items-end gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Expanded options */}
      {expanded && (
        <>
          <button
            onClick={() => {
              playNavSound();
              onSearch();
              setExpanded(false);
            }}
            className="nav-focusable w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 shadow-2xl"
            aria-label="Search"
            style={{ animation: "slideUp 0.2s ease-out" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            onClick={() => {
              playNavSound();
              onHome();
              setExpanded(false);
            }}
            className="nav-focusable w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 shadow-2xl"
            aria-label="Home"
            style={{ animation: "slideUp 0.3s ease-out" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </button>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => {
          playNavSound();
          setExpanded(!expanded);
        }}
        className={`nav-focusable w-16 h-16 rounded-full bg-[#e50914] flex items-center justify-center hover:bg-[#ff1a27] transition-all hover:scale-110 shadow-2xl ${
          expanded ? "rotate-45" : ""
        }`}
        style={{ boxShadow: "0 8px 32px rgba(229, 9, 20, 0.4)" }}
        aria-label="Menu"
      >
        {expanded ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        ) : (
          <GhostLogo size={32} />
        )}
      </button>
    </div>
  );
}
