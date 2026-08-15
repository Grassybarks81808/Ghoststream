"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { playSelectSound, playBackSound } from "@/lib/sounds";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface Props {
  title: string;
  tmdbId: number;
  mediaType: string;
  season?: number;
  episode?: number;
  onClose: () => void;
}

interface DownloadStatus {
  id: string;
  filename: string;
  status: "starting" | "downloading" | "completed" | "error";
  progress: number;
  duration?: number;
  error?: string;
}

type DownloadPhase = "idle" | "resolving" | "downloading" | "completed" | "error";

export function DownloadModal({ title, tmdbId, mediaType, season, episode, onClose }: Props) {
  const [quality, setQuality] = useState("best");
  const [phase, setPhase] = useState<DownloadPhase>("idle");
  const [status, setStatus] = useState<DownloadStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const qualities = [
    { value: "best", label: "Best (Fastest)" },
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
  ];

  const handleStartDownload = useCallback(async () => {
    playSelectSound();
    setPhase("resolving");
    setErrorMessage(null);

    try {
      // Build filename
      const filename = `${title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "_")}.mp4`;

      // Call download API - it handles resolution automatically
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId,
          type: mediaType,
          season,
          episode,
          quality,
          filename,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setPhase("error");
        setErrorMessage(data.error || data.message || "Failed to start download");
        return;
      }

      // Download started successfully
      setPhase("downloading");
      setProvider(data.provider);
      setStatus({
        id: data.downloadId,
        filename: data.filename,
        status: "starting",
        progress: 0,
      });

      // Poll for progress
      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/download?id=${data.downloadId}`);
          const statusData = await statusRes.json();
          
          setStatus(statusData);
          
          if (statusData.status === "completed") {
            setPhase("completed");
            if (pollRef.current) clearInterval(pollRef.current);
          } else if (statusData.status === "error") {
            setPhase("error");
            setErrorMessage(statusData.error || "Download failed");
            if (pollRef.current) clearInterval(pollRef.current);
          }
        } catch {
          // Continue polling
        }
      }, 1000);

    } catch (error) {
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to start download");
    }
  }, [tmdbId, mediaType, season, episode, quality, title]);

  const handleClose = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    playBackSound();
    onClose();
  }, [onClose]);

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setErrorMessage(null);
    setStatus(null);
  }, []);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progressPercent = status?.duration && status.progress 
    ? Math.min(100, (status.progress / status.duration) * 100) 
    : (phase === "downloading" ? 5 : 0);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[950]" onClick={handleClose} />
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[951] bg-[#1a1a1a] rounded-xl w-[95%] max-w-md p-6 shadow-2xl" 
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <GhostLogo size={32} />
          <h2 className="text-xl font-bold">Download</h2>
        </div>
        
        <p className="text-sm text-gray-400 mb-6 line-clamp-2">{title}</p>

        {/* Idle - Quality Selection */}
        {phase === "idle" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Select Quality</label>
              <div className="grid grid-cols-4 gap-2">
                {qualities.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQuality(q.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition nav-focusable ${
                      quality === q.value
                        ? "bg-[#e50914] text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {q.value === "best" ? "Best" : q.value}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {qualities.find((q) => q.value === quality)?.label}
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleClose} className="gs-btn gs-btn-secondary flex-1 justify-center nav-focusable">
                Cancel
              </button>
              <button onClick={handleStartDownload} className="gs-btn gs-btn-primary flex-1 justify-center nav-focusable">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
            </div>
          </>
        )}

        {/* Resolving - Finding stream URL */}
        {phase === "resolving" && (
          <div className="text-center py-8">
            <div className="mb-4 animate-pulse">
              <GhostLogo size={64} animated />
            </div>
            <p className="text-lg font-semibold mb-2">Resolving stream...</p>
            <p className="text-sm text-gray-400">Finding the best available source</p>
            <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#e50914] to-[#ff4444] rounded-full animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        )}

        {/* Downloading - Progress */}
        {phase === "downloading" && (
          <div className="text-center py-6">
            <div className="mb-4">
              <GhostLogo size={64} animated />
            </div>
            <p className="text-lg font-semibold mb-1">Downloading...</p>
            {provider && (
              <p className="text-xs text-gray-500 mb-2">via {provider}</p>
            )}
            <p className="text-sm text-gray-400 mb-4 line-clamp-1">
              {status?.filename || title}
            </p>
            
            <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e50914] to-[#ff4444] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(status?.progress || 0)}</span>
              <span>{status?.duration ? formatTime(status.duration) : "--:--"}</span>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              FFmpeg is processing the video...
            </p>
          </div>
        )}

        {/* Completed */}
        {phase === "completed" && (
          <div className="text-center py-8">
            <div className="mb-4 text-green-400">
              <svg className="mx-auto" width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-green-400 mb-2">Download Complete!</p>
            <p className="text-sm text-gray-400 mb-6">{status?.filename}</p>
            <button onClick={handleClose} className="gs-btn gs-btn-primary nav-focusable">
              Done
            </button>
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div className="text-center py-8">
            <div className="mb-4">
              <GhostLogoSad size={64} />
            </div>
            <p className="text-xl font-bold text-red-400 mb-2">Download Failed</p>
            <p className="text-sm text-gray-400 mb-2">{errorMessage}</p>
            <p className="text-xs text-gray-500 mb-6">
              The stream could not be resolved or downloaded. This content may be protected.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRetry} className="gs-btn gs-btn-secondary nav-focusable">
                Try Again
              </button>
              <button onClick={handleClose} className="gs-btn gs-btn-primary nav-focusable">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
