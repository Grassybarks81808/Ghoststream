const TMDB_API_KEY = "e4787135bfa1bf143663910fa8740759";
const BASE = "https://api.themoviedb.org/3";

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  vote_average?: number;
  genre_ids?: number[];
  popularity?: number;
}

export interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface TMDBSeason {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path?: string | null;
}

export interface TMDBEpisode {
  episode_number: number;
  name: string;
  overview?: string;
  still_path?: string | null;
  air_date?: string;
}

export async function searchMulti(query: string, page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return res.json();
}

export async function getTrending(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/trending/all/week?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export async function getTopRated(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export async function getByGenre(genreId: number, page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`);
  return res.json();
}

export async function getTVShows(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export async function getMovieDetails(id: number): Promise<TMDBMovie & { genres?: { id: number; name: string }[]; runtime?: number }> {
  const res = await fetch(`${BASE}/movie/${id}?api_key=${TMDB_API_KEY}`);
  return res.json();
}

export async function getTVDetails(id: number): Promise<{ seasons: TMDBSeason[]; name: string; overview: string; backdrop_path: string | null; poster_path: string | null; number_of_seasons: number }> {
  const res = await fetch(`${BASE}/tv/${id}?api_key=${TMDB_API_KEY}`);
  return res.json();
}

export async function getSeasonEpisodes(tvId: number, seasonNum: number): Promise<{ episodes: TMDBEpisode[] }> {
  const res = await fetch(`${BASE}/tv/${tvId}/season/${seasonNum}?api_key=${TMDB_API_KEY}`);
  return res.json();
}

export async function getUpcoming(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export async function getNowPlaying(page = 1): Promise<TMDBResponse> {
  const res = await fetch(`${BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`);
  return res.json();
}

export const GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function posterURL(path: string | null | undefined, size = "w500"): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function backdropURL(path: string | null | undefined, size = "w1280"): string {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
