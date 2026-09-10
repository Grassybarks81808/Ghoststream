import { NextRequest, NextResponse } from "next/server";
import { getTrending, getPopularMovies, getTopRated, getByGenre, getTVShows, getUpcoming, getNowPlaying, TMDBMovie } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") || "trending";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");

  try {
    let data;
    switch (category) {
      case "trending": data = await getTrending(page); break;
      case "popular": data = await getPopularMovies(page); break;
      case "top_rated": data = await getTopRated(page); break;
      case "tv": data = await getTVShows(page); break;
      case "upcoming": {
        data = await getUpcoming(page);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        data.results = data.results.filter((movie: TMDBMovie) => movie.release_date && new Date(movie.release_date) > today);
        break;
      }
      case "now_playing": data = await getNowPlaying(page); break;
      default: {
        const genreId = parseInt(category);
        data = !isNaN(genreId) ? await getByGenre(genreId, page) : await getTrending(page);
      }
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [], error: "Failed to fetch" }, { status: 500 });
  }
}
