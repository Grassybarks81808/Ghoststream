"use client";

import { TMDBMovie, backdropURL } from "@/lib/tmdb";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";

interface Props {
  movie: TMDBMovie;
  onPlay: () => void;
  onDetails: () => void;
}

export function HeroSection({ movie, onPlay, onDetails }: Props) {
  const title = movie.title || movie.name || "";
  const overview = movie.overview || "";
  const releaseDate = movie.release_date || movie.first_air_date;
  const year = releaseDate ? releaseDate.substring(0, 4) : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "";
  
  // Check if movie is released
  const isReleased = releaseDate ? new Date(releaseDate) <= new Date() : true;

  return (
    <section className="hero-section">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: `url(${backdropURL(movie.backdrop_path, "original")})`,
        }}
      />
      <div className="relative z-10 flex flex-col justify-end min-h-[85vh] px-6 md:px-12 lg:px-16 pb-32">
        <div style={{ animation: "slideUp 0.8s ease-out" }}>
          <div className="flex items-center gap-3 mb-3">
            <GhostLogo size={40} />
            <span className="text-[#e50914] font-bold text-sm uppercase tracking-wider">
              {isReleased ? "Now Streaming" : "Coming Soon"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 max-w-3xl leading-tight drop-shadow-2xl">
            {title}
          </h1>
          <div className="flex items-center gap-4 mb-4 text-sm md:text-base">
            {rating && (
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {rating}
              </span>
            )}
            {year && <span className="text-gray-300">{year}</span>}
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs uppercase tracking-wider">
              {movie.media_type === "tv" ? "TV Series" : "Movie"}
            </span>
            {!isReleased && (
              <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 rounded text-xs uppercase tracking-wider animate-pulse">
                Unreleased
              </span>
            )}
          </div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mb-8 line-clamp-3">
            {overview}
          </p>
          <div className="flex flex-wrap gap-3">
            {isReleased ? (
              <button onClick={onPlay} className="gs-btn gs-btn-primary nav-focusable">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Play
              </button>
            ) : (
              <div className="gs-btn bg-gray-700 cursor-not-allowed flex items-center gap-2">
                <GhostLogoSad size={24} />
                <span>Coming {releaseDate ? new Date(releaseDate).toLocaleDateString() : "Soon"}</span>
              </div>
            )}
            <button onClick={onDetails} className="gs-btn gs-btn-secondary nav-focusable">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
