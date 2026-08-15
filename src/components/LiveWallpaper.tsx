"use client";

import { useEffect, useState, useRef } from "react";
import { TMDBMovie } from "@/lib/tmdb";

interface Props {
  focusedMovie: TMDBMovie | null;
}

export function LiveWallpaper({ focusedMovie }: Props) {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (focusedMovie?.backdrop_path) {
      // Much faster response - 200ms delay
      timerRef.current = setTimeout(() => {
        setBgImage(`https://image.tmdb.org/t/p/w1280${focusedMovie.backdrop_path}`);
        setActive(true);
      }, 200);
    } else {
      setActive(false);
      timerRef.current = setTimeout(() => setBgImage(null), 500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [focusedMovie]);

  return (
    <>
      <div className="live-wallpaper" />
      <div
        className={`live-wallpaper-image ${active ? "active" : ""}`}
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
      />
    </>
  );
}
