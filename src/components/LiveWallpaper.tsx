"use client";

import { useEffect, useState, useRef } from "react";
import type { MediaItem } from "@/lib/catalog";
import { posterUrl } from "@/lib/catalog";
import { fetchTmdbMeta } from "@/lib/tmdb";

interface Props {
  focusedItem: MediaItem | null;
}

export function LiveWallpaper({ focusedItem }: Props) {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (focusedItem) {
      const item = focusedItem;
      timerRef.current = setTimeout(() => {
        // Prefer a real TMDB backdrop; fall back to the archive thumb
        fetchTmdbMeta(item).then((meta) => {
          setBgImage(meta?.backdrop ?? posterUrl(item.id));
          setActive(true);
        });
      }, 200);
    } else {
      timerRef.current = setTimeout(() => {
        setActive(false);
        setBgImage(null);
      }, 500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [focusedItem]);

  return (
    <>
      <div className="live-wallpaper" />
      <div
        className={`live-wallpaper-image ${active ? "active" : ""}`}
        style={
          bgImage
            ? {
                backgroundImage: `url(${bgImage})`,
                filter: "blur(60px) saturate(1.4) brightness(0.45)",
                transform: "scale(1.4)",
              }
            : {}
        }
      />
    </>
  );
}
