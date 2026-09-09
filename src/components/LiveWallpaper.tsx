"use client";

import { useEffect, useState, useRef } from "react";
import type { MediaItem } from "@/lib/catalog";
import { posterUrl } from "@/lib/catalog";

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
      timerRef.current = setTimeout(() => {
        setBgImage(posterUrl(focusedItem.id));
        setActive(true);
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
