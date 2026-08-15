"use client";

import { useState, useEffect, useCallback } from "react";
import { TMDBMovie, backdropURL, posterURL } from "@/lib/tmdb";
import { playSelectSound, playBackSound, playNavSound } from "@/lib/sounds";
import { GhostLogo, GhostLogoSad } from "./GhostLogo";
import { DownloadModal } from "./DownloadModal";

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path?: string | null;
}

interface Episode {
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string | null;
  air_date?: string;
}

interface Props {
  movie: TMDBMovie;
  onClose: () => void;
  onPlay: (tmdbId: number, type: string, season?: number, episode?: number) => void;
}

export function DetailModal({ movie, onClose, onPlay }: Props) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState<{ title: string; season?: number; episode?: number } | null>(null);

  const title = movie.title || movie.name || "";
  const year = (movie.release_date || movie.first_air_date || "").substring(0, 4);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "";
  const isTV = movie.media_type === "tv";
  
  // Check if released - be more thorough
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseDateObj = releaseDate ? new Date(releaseDate) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isReleased = releaseDateObj ? releaseDateObj <= today : true;

  // Check if already bookmarked
  useEffect(() => {
    const mt = movie.media_type || "movie";
    fetch(`/api/bookmarks?tmdbId=${movie.id}&mediaType=${mt}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.bookmarked === "boolean") setBookmarked(data.bookmarked);
      })
      .catch(() => {});
  }, [movie.id, movie.media_type]);

  // Fetch TV show details
  useEffect(() => {
    if (!isTV) return;
    fetch(`/api/tmdb/details?id=${movie.id}&type=tv`)
      .then((r) => r.json())
      .then((data) => {
        const s = (data.seasons || []).filter(
          (season: Season) => season.season_number > 0 && season.episode_count > 0
        );
        setSeasons(s);
        if (s.length > 0) setSelectedSeason(s[0].season_number);
      })
      .catch(() => {});
  }, [movie.id, isTV]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (selectedSeason === null || !isTV) return;
    setLoadingEpisodes(true);
    fetch(`/api/tmdb/episodes?tvId=${movie.id}&season=${selectedSeason}`)
      .then((r) => r.json())
      .then((data) => {
        setEpisodes(data.episodes || []);
        setLoadingEpisodes(false);
      })
      .catch(() => setLoadingEpisodes(false));
  }, [movie.id, selectedSeason, isTV]);

  const handleBookmark = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          mediaType: movie.media_type || "movie",
          title,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
        }),
      });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      playSelectSound();
    } catch {
      // ignore
    }
  }, [movie, title]);

  const handleClose = useCallback(() => {
    playBackSound();
    onClose();
  }, [onClose]);

  const handleDownloadMovie = useCallback(() => {
    setDownloadTarget({ title });
    setShowDownload(true);
  }, [title]);

  const handleDownloadEpisode = useCallback((ep: Episode) => {
    setDownloadTarget({
      title: `${title} S${String(selectedSeason).padStart(2, "0")}E${String(ep.episode_number).padStart(2, "0")} - ${ep.name}`,
      season: selectedSeason ?? undefined,
      episode: ep.episode_number,
    });
    setShowDownload(true);
  }, [title, selectedSeason]);

  const isEpisodeReleased = (ep: Episode) => {
    if (!ep.air_date) return true;
    return new Date(ep.air_date) <= new Date();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleClose} />
      <div className="modal-content">
        {/* Backdrop header */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-xl">
          {movie.backdrop_path ? (
            <img
              src={backdropURL(movie.backdrop_path, "w1280")}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : movie.poster_path ? (
            <img
              src={posterURL(movie.poster_path, "w780")}
              alt={title}
              className="w-full h-full object-cover blur-sm"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition nav-focusable"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Play button overlay */}
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
            {isReleased ? (
              <>
                <button
                  onClick={() => {
                    playSelectSound();
                    if (isTV && selectedSeason !== null && episodes.length > 0) {
                      onPlay(movie.id, "tv", selectedSeason, 1);
                    } else {
                      onPlay(movie.id, "movie");
                    }
                  }}
                  className="gs-btn gs-btn-primary nav-focusable"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Play
                </button>
                <button
                  onClick={handleDownloadMovie}
                  className="gs-btn gs-btn-secondary nav-focusable"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg">
                <GhostLogoSad size={36} />
                <div>
                  <span className="text-sm font-bold text-gray-300">Coming Soon</span>
                  {releaseDate && (
                    <p className="text-xs text-gray-500">{new Date(releaseDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={handleBookmark}
              className="gs-btn gs-btn-secondary nav-focusable"
            >
              {bookmarked ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              {bookmarked ? "In My List" : "My List"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-2">
            <GhostLogo size={32} />
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          </div>
          <div className="flex items-center gap-4 mb-4 text-sm">
            {rating && (
              <span className="text-green-400 font-bold flex items-center gap-1">
                ★ {rating}
              </span>
            )}
            {year && <span className="text-gray-400">{year}</span>}
            <span className="px-2 py-0.5 bg-white/10 rounded text-xs uppercase tracking-wider">
              {isTV ? "TV Series" : "Movie"}
            </span>
            {!isReleased && (
              <span className="px-2 py-0.5 bg-yellow-600/30 text-yellow-400 rounded text-xs uppercase tracking-wider">
                Unreleased
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            {movie.overview || "No description available."}
          </p>

          {/* TV Show - Seasons & Episodes */}
          {isTV && seasons.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Episodes</h3>
              {/* Season tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto gs-row-scroll pb-2">
                {seasons.map((s) => (
                  <button
                    key={s.season_number}
                    className={`category-tab nav-focusable ${selectedSeason === s.season_number ? "active" : ""}`}
                    onClick={() => {
                      playNavSound();
                      setSelectedSeason(s.season_number);
                    }}
                  >
                    Season {s.season_number}
                  </button>
                ))}
              </div>

              {/* Episodes list */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {loadingEpisodes ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-24 rounded-lg" />
                  ))
                ) : (
                  episodes.map((ep) => {
                    const epReleased = isEpisodeReleased(ep);
                    return (
                      <div
                        key={ep.episode_number}
                        className={`flex items-center gap-4 p-3 rounded-lg bg-white/5 ${epReleased ? "hover:bg-white/10" : "opacity-60"} transition`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-white/5">
                          {ep.still_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                              alt={ep.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GhostLogo size={24} />
                            </div>
                          )}
                          {!epReleased && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <GhostLogoSad size={24} />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">
                            {ep.episode_number}. {ep.name}
                          </h4>
                          {ep.overview && (
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {ep.overview}
                            </p>
                          )}
                          {!epReleased && ep.air_date && (
                            <p className="text-xs text-yellow-500 mt-1">
                              Airs: {new Date(ep.air_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        {epReleased && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => {
                                playSelectSound();
                                onPlay(movie.id, "tv", selectedSeason ?? 1, ep.episode_number);
                              }}
                              className="nav-focusable w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition"
                              title="Play"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownloadEpisode(ep)}
                              className="nav-focusable w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition"
                              title="Download"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Movie - No episodes */}
          {!isTV && isReleased && (
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  playSelectSound();
                  onPlay(movie.id, "movie");
                }}
                className="gs-btn gs-btn-primary nav-focusable flex-1 justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Now
              </button>
              <button
                onClick={handleDownloadMovie}
                className="gs-btn gs-btn-secondary nav-focusable"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Download Modal */}
      {showDownload && downloadTarget && (
        <DownloadModal
          title={downloadTarget.title}
          tmdbId={movie.id}
          mediaType={isTV ? "tv" : "movie"}
          season={downloadTarget.season}
          episode={downloadTarget.episode}
          onClose={() => setShowDownload(false)}
        />
      )}
    </>
  );
}
