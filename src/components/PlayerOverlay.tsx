"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MediaItem } from "@/lib/catalog";
import { itemPageUrl } from "@/lib/catalog";
import { fetchArchiveItem, type VideoOption } from "@/lib/archive";
import { formatTime, getProgress, saveProgress } from "@/lib/localStore";
import { playBackSound, playSelectSound } from "@/lib/sounds";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface Props {
  item: MediaItem;
  onClose: () => void;
}

type Phase = "resolving" | "playing" | "error";

export function PlayerOverlay({ item, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [phase, setPhase] = useState<Phase>("resolving");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showControls, setShowControls] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);
  const [showResume, setShowResume] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumedRef = useRef(false);

  const requestClose = useCallback(() => {
    playBackSound();
    // save final progress
    const v = videoRef.current;
    if (v && v.currentTime > 5) {
      saveProgress(item, v.currentTime, v.duration || 0);
    }
    setClosing(true);
    setTimeout(onClose, 300);
  }, [item, onClose]);

  // Resolve the stream
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const info = await fetchArchiveItem(item.id);
      if (cancelled) return;
      if (!info || !info.best) {
        setPhase("error");
        setErrorMsg(
          "Couldn't reach the Internet Archive for this title. Check your connection and try again."
        );
        return;
      }
      const v = videoRef.current;
      if (v) {
        v.src = info.best.url;
        v.load();
      }
      const prior = getProgress(item.id);
      if (prior && prior.position > 30 && prior.position < (prior.duration || Infinity) - 30) {
        setResumeAt(prior.position);
        setShowResume(true);
      }
      setPhase("playing");
    })();
    return () => {
      cancelled = true;
    };
  }, [item.id]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
        return;
      }
      const v = videoRef.current;
      if (!v) return;
      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          v.paused ? v.play() : v.pause();
          break;
        case "arrowright":
          e.preventDefault();
          v.currentTime = Math.min(v.currentTime + 10, v.duration || 0);
          break;
        case "arrowleft":
          e.preventDefault();
          v.currentTime = Math.max(v.currentTime - 10, 0);
          break;
        case "arrowup":
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.min(1, prev + 0.1);
            v.volume = next;
            return next;
          });
          break;
        case "arrowdown":
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.max(0, prev - 0.1);
            v.volume = next;
            return next;
          });
          break;
        case "m":
          v.muted = !v.muted;
          setMuted(v.muted);
          break;
        case "f":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [requestClose, toggleFullscreen]);

  // Auto-hide controls
  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setShowControls(false);
    }, 3000);
  }, []);

  // Auto-hide controls: start the hide timer on mount; mouse/touch
  // movement re-triggers it via event handlers.
  useEffect(() => {
    hideTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setShowControls(false);
    }, 3000);
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // Periodic progress save
  useEffect(() => {
    const interval = setInterval(() => {
      const v = videoRef.current;
      if (v && v.currentTime > 5) saveProgress(item, v.currentTime, v.duration || 0);
    }, 10000);
    return () => clearInterval(interval);
  }, [item]);

  useEffect(() => {
    const onFsChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    playSelectSound();
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  }, []);

  const doResume = useCallback(() => {
    const v = videoRef.current;
    if (v && resumeAt) v.currentTime = resumeAt;
    resumedRef.current = true;
    setShowResume(false);
  }, [resumeAt]);

  const progressPct = duration > 0 ? (current / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`player-overlay bg-black ${closing ? "closing" : ""} ${
        showControls ? "cursor-default" : "cursor-none"
      }`}
      onMouseMove={bumpControls}
      onTouchStart={bumpControls}
      onClick={bumpControls}
      style={{ userSelect: "none" }}
    >
      {/* Top bar */}
      <div
        className={`gs-safe-top-pad absolute top-0 left-0 right-0 z-30 p-4 md:p-6 flex items-center gap-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={requestClose}
          className="nav-focusable flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className="font-semibold text-sm">Back</span>
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm md:text-lg font-bold truncate">{item.title}</h2>
          <p className="text-xs text-gray-400">
            {item.year} · Streaming free from the Internet Archive
          </p>
        </div>
        <a
          href={itemPageUrl(item.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-focusable hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-xs font-semibold"
          title="View on archive.org"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Archive
        </a>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full bg-black"
        playsInline
        preload="auto"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          setShowControls(true);
        }}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setCurrent(v.currentTime);
          if (v.buffered.length > 0) {
            setBuffered(v.buffered.end(v.buffered.length - 1));
          }
        }}
        onEnded={() => {
          const v = videoRef.current;
          if (v) saveProgress(item, 0, v.duration || 0);
          setShowControls(true);
        }}
        onError={() => {
          if (phase !== "error") {
            setPhase("error");
            setErrorMsg(
              "This stream failed to load. The archive.org file may be temporarily unavailable — try again, or open it directly on archive.org."
            );
          }
        }}
      />

      {/* Resolving state */}
      {phase === "resolving" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80">
          <GhostLogo size={72} animated />
          <p className="mt-6 text-lg font-semibold">Summoning your movie…</p>
          <p className="mt-1 text-sm text-gray-400">Resolving the best stream from archive.org</p>
        </div>
      )}

      {/* Buffering spinner */}
      {phase === "playing" && buffering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-[#e50914] animate-spin" />
        </div>
      )}

      {/* Center play button */}
      {phase === "playing" && !buffering && !playing && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center"
          aria-label="Play"
        >
          <span className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#e50914]/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </span>
        </button>
      )}

      {/* Resume toast */}
      {showResume && (
        <div
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#181818]/95 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-4 shadow-2xl"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <div className="text-sm">
            <p className="font-semibold">Resume where you left off?</p>
            <p className="text-gray-400">You stopped at {formatTime(resumeAt)}</p>
          </div>
          <button onClick={doResume} className="gs-btn gs-btn-primary text-sm !py-2 !px-4">
            Resume
          </button>
          <button
            onClick={() => setShowResume(false)}
            className="gs-btn gs-btn-secondary text-sm !py-2 !px-4"
          >
            Start over
          </button>
        </div>
      )}

      {/* Error state */}
      {phase === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 px-6">
          <GhostLogoSad size={72} />
          <p className="mt-6 text-xl font-bold">Playback hiccup</p>
          <p className="mt-2 text-sm text-gray-400 max-w-md text-center">{errorMsg}</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => window.location.reload()} className="gs-btn gs-btn-secondary">
              Reload
            </button>
            <a
              href={itemPageUrl(item.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="gs-btn gs-btn-primary"
            >
              Open on archive.org
            </a>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 px-4 md:px-8 pb-4 md:pb-6 pt-16 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Seek bar */}
        <div className="relative w-full h-6 flex items-center group" onClick={bumpControls}>
          <div className="absolute left-0 right-0 h-1.5 md:h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: `${bufferedPct}%` }} />
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#e50914] to-[#ff4444]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div
            className="absolute w-3.5 h-3.5 rounded-full bg-[#e50914] shadow-lg scale-0 group-hover:scale-100 transition-transform"
            style={{ left: `calc(${progressPct}% - 7px)` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => {
              const v = videoRef.current;
              const t = Number(e.target.value);
              if (v) v.currentTime = t;
              setCurrent(t);
            }}
            className="gs-seek absolute inset-0 w-full opacity-0 cursor-pointer"
            aria-label="Seek"
          />
        </div>

        {/* Buttons row */}
        <div className="mt-2 flex items-center gap-2 md:gap-4">
          <button onClick={togglePlay} className="nav-focusable p-2 hover:scale-110 transition-transform" aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <rect x="5" y="3" width="4" height="18" rx="1" />
                <rect x="15" y="3" width="4" height="18" rx="1" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) v.currentTime = Math.max(v.currentTime - 10, 0);
            }}
            className="nav-focusable p-2 hover:scale-110 transition-transform hidden sm:block"
            aria-label="Back 10 seconds"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 4 3 9 8 9" />
            </svg>
          </button>
          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) v.currentTime = Math.min(v.currentTime + 10, v.duration || 0);
            }}
            className="nav-focusable p-2 hover:scale-110 transition-transform hidden sm:block"
            aria-label="Forward 10 seconds"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <polyline points="21 4 21 9 16 9" />
            </svg>
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 group/vol">
            <button
              onClick={() => {
                const v = videoRef.current;
                if (v) {
                  v.muted = !v.muted;
                  setMuted(v.muted);
                }
              }}
              className="nav-focusable p-2 hover:scale-110 transition-transform"
              aria-label="Mute"
            >
              {muted || volume === 0 ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M16.5 12L21 7.5 19.5 6 15 10.5 10.5 6 9 7.5l3 4.5-3 4.5L10.5 18l4.5-4.5 4.5 4.5L21 16.5z" />
                  <path d="M3 9v6h4l5 4V5L7 9H3z" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M3 9v6h4l5 4V5L7 9H3z" />
                  <path d="M14 8.5a4 4 0 0 1 0 7v-7z" />
                  <path d="M14 5a8 8 0 0 1 0 14v-2a6 6 0 0 0 0-10V5z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => {
                const v = videoRef.current;
                const val = Number(e.target.value);
                setVolume(val);
                setMuted(val === 0);
                if (v) {
                  v.volume = val;
                  v.muted = val === 0;
                }
              }}
              className="gs-volume w-0 group-hover/vol:w-20 md:w-20 transition-all duration-300"
              aria-label="Volume"
            />
          </div>

          <span className="text-xs md:text-sm text-gray-300 font-medium tabular-nums ml-1">
            {formatTime(current)} <span className="text-gray-600">/ {formatTime(duration)}</span>
          </span>

          <div className="flex-1" />

          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) v.playbackRate = v.playbackRate === 1 ? 1.25 : v.playbackRate === 1.25 ? 1.5 : v.playbackRate === 1.5 ? 2 : 1;
            }}
            className="nav-focusable hidden md:block px-2 py-1 text-xs font-bold text-gray-300 hover:text-white bg-white/10 rounded hover:bg-white/20 transition"
          >
            SPEED
          </button>
          <button onClick={toggleFullscreen} className="nav-focusable p-2 hover:scale-110 transition-transform" aria-label="Fullscreen">
            {fullscreen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M8 3v3a2 2 0 01-2 2H3M16 3v3a2 2 0 002 2h3M8 21v-3a2 2 0 00-2-2H3M16 21v-3a2 2 0 012-2h3" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
