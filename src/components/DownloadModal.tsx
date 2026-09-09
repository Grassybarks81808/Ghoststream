"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MediaItem } from "@/lib/catalog";
import { itemPageUrl } from "@/lib/catalog";
import { fetchArchiveItem, formatBytes, type VideoOption } from "@/lib/archive";
import { playSelectSound, playBackSound } from "@/lib/sounds";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface Props {
  item: MediaItem;
  onClose: () => void;
}

type Phase = "resolving" | "choose" | "downloading" | "completed" | "error";

interface DownloadState {
  received: number;
  total: number;
  speed: number; // bytes/sec
}

/** ~300 MB/s samples → MB, formatted */
function speedText(bps: number): string {
  return `${formatBytes(bps)}/s`;
}

export function DownloadModal({ item, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("resolving");
  const [options, setOptions] = useState<VideoOption[]>([]);
  const [selected, setSelected] = useState<VideoOption | null>(null);
  const [state, setState] = useState<DownloadState>({ received: 0, total: 0, speed: 0 });
  const [errorMsg, setErrorMsg] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const info = await fetchArchiveItem(item.id);
      if (cancelled) return;
      if (!info || info.options.length === 0) {
        setPhase("error");
        setErrorMsg("Couldn't fetch the file list from archive.org. Check your connection.");
        return;
      }
      setOptions(info.options.slice(0, 6));
      setSelected(info.options[0]);
      setPhase("choose");
    })();
    return () => {
      cancelled = true;
    };
  }, [item.id, reloadKey]);

  const handleClose = useCallback(() => {
    abortRef.current?.abort();
    playBackSound();
    onClose();
  }, [onClose]);

  const startDownload = useCallback(
    async (file: VideoOption) => {
      playSelectSound();
      setSelected(file);
      setPhase("downloading");
      setState({ received: 0, total: file.size, speed: 0 });

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(file.url, { signal: controller.signal });
        if (!res.ok) throw new Error(`archive.org returned ${res.status}`);

        const total = Number(res.headers.get("content-length")) || file.size;
        const reader = res.body?.getReader();
        if (!reader) throw new Error("Your browser can't stream downloads. Use the direct link instead.");

        const chunks: BlobPart[] = [];
        let received = 0;
        const started = performance.now();

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          const elapsed = (performance.now() - started) / 1000;
          setState({ received, total, speed: received / Math.max(elapsed, 0.001) });
        }

        const blob = new Blob(chunks, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        // sanitize filename
        const safeTitle = item.title.replace(/[^a-zA-Z0-9 _.-]/g, "").trim() || item.id;
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTitle} (${item.year}).mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);

        setPhase("completed");
      } catch (err) {
        if (controller.signal.aborted) return;
        setPhase("error");
        setErrorMsg(
          err instanceof Error ? err.message : "The download failed. Try the direct link below."
        );
      }
    },
    [item]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setPhase("choose");
  }, []);

  const pct = state.total > 0 ? Math.min(100, (state.received / state.total) * 100) : 0;
  const remaining =
    state.speed > 0 && state.total > state.received ? (state.total - state.received) / state.speed : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-[950]" onClick={handleClose} />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[951] bg-[#141414] rounded-2xl w-[95%] max-w-md p-6 shadow-2xl border border-white/10"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <GhostLogo size={32} />
          <h2 className="text-xl font-bold">Download</h2>
        </div>
        <p className="text-sm text-gray-400 mb-6 line-clamp-1">
          {item.title} <span className="text-gray-600">({item.year})</span>
        </p>

        {/* Resolving */}
        {phase === "resolving" && (
          <div className="text-center py-10">
            <GhostLogo size={64} animated />
            <p className="mt-4 text-sm text-gray-400">Finding available files…</p>
          </div>
        )}

        {/* Choose quality */}
        {phase === "choose" && selected && (
          <>
            <label className="block text-sm font-medium mb-3">Choose quality</label>
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
              {options.map((opt) => (
                <button
                  key={opt.name}
                  onClick={() => setSelected(opt)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition nav-focusable border ${
                    selected.name === opt.name
                      ? "bg-[#e50914]/15 border-[#e50914] text-white"
                      : "bg-white/5 border-transparent text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <span>{opt.label.split(" · ")[0]}</span>
                  <span className="text-xs text-gray-400">{formatBytes(opt.size)}</span>
                </button>
              ))}
            </div>

            {selected.size > 500 * 1024 * 1024 && (
              <p className="text-xs text-yellow-500 mb-3">
                Heads up: this file is large ({formatBytes(selected.size)}). It will be held in
                memory while saving — if that worries you, use the direct link below.
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={handleClose} className="gs-btn gs-btn-secondary flex-1 justify-center nav-focusable">
                Cancel
              </button>
              <button
                onClick={() => startDownload(selected)}
                className="gs-btn gs-btn-primary flex-1 justify-center nav-focusable"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
            </div>

            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mt-3 text-xs text-gray-500 hover:text-gray-300 underline"
            >
              or open the direct file on archive.org ↗
            </a>
          </>
        )}

        {/* Downloading */}
        {phase === "downloading" && selected && (
          <div className="py-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">Downloading…</span>
              <span className="text-gray-400">{pct.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e50914] to-[#ff4444] rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-6">
              <span>
                {formatBytes(state.received)} / {formatBytes(state.total)}
              </span>
              <span>
                {speedText(state.speed)}
                {remaining > 1 ? ` · ~${Math.ceil(remaining)}s left` : ""}
              </span>
            </div>
            <div className="flex justify-center">
              <button onClick={cancel} className="gs-btn gs-btn-secondary nav-focusable">
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">
              Tip: keep this tab open — your browser saves the file when it finishes.
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
            <p className="text-xl font-bold text-green-400 mb-2">Saved!</p>
            <p className="text-sm text-gray-400 mb-1">
              <span className="font-semibold text-gray-200">{item.title}</span> was sent to your downloads.
            </p>
            <p className="text-xs text-gray-600 mb-6">
              Public domain — keep it forever, share it anywhere. 🎁
            </p>
            <button onClick={handleClose} className="gs-btn gs-btn-primary nav-focusable">
              Done
            </button>
          </div>
        )}

        {/* Error */}
        {phase === "error" && (
          <div className="text-center py-8">
            <GhostLogoSad size={64} />
            <p className="text-xl font-bold text-red-400 mb-2">Download failed</p>
            <p className="text-sm text-gray-400 mb-6">{errorMsg}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setPhase("resolving");
                  setErrorMsg("");
                  setReloadKey((k) => k + 1);
                }}
                className="gs-btn gs-btn-secondary"
              >
                Try Again
              </button>
              <a
                href={selected ? selected.url : itemPageUrl(item.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="gs-btn gs-btn-primary"
              >
                Direct Link
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
