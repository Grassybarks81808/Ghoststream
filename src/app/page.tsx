"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StartupAnimation } from "@/components/StartupAnimation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ContentRow } from "@/components/ContentRow";
import { PlayerOverlay } from "@/components/PlayerOverlay";
import { DetailModal } from "@/components/DetailModal";
import { SearchOverlay } from "@/components/SearchOverlay";
import { LiveWallpaper } from "@/components/LiveWallpaper";
import { AmbientAudio } from "@/components/AmbientAudio";
import { FloatingNav } from "@/components/FloatingNav";
import { MyListSection } from "@/components/MyListSection";
import { PWARegister } from "@/components/PWARegister";
import { GhostLogo } from "@/components/GhostLogo";
import type { TMDBMovie } from "@/lib/tmdb";

interface RowData { id: string; title: string; category: string; items: TMDBMovie[]; mediaType?: string; }

const ALL_CATEGORIES = [
  ["trending", "🔥 Trending Now", "trending"], ["popular", "⭐ Popular Movies", "popular", "movie"],
  ["top_rated", "🏆 Top Rated", "top_rated", "movie"], ["now_playing", "🎬 Now Playing", "now_playing", "movie"],
  ["upcoming", "📅 Coming Soon", "upcoming", "movie"], ["tv", "📺 Popular TV Shows", "tv", "tv"],
  ["28", "💥 Action", "28", "movie"], ["18", "🎭 Drama", "18", "movie"], ["35", "😂 Comedy", "35", "movie"],
  ["27", "👻 Horror", "27", "movie"], ["878", "🚀 Sci-Fi", "878", "movie"], ["10749", "❤️ Romance", "10749", "movie"],
  ["53", "🔪 Thriller", "53", "movie"], ["16", "🎨 Animation", "16", "movie"], ["99", "📖 Documentary", "99", "movie"],
  ["14", "🧙 Fantasy", "14", "movie"], ["10752", "⚔️ War", "10752", "movie"], ["80", "🕵️ Crime", "80", "movie"],
] as const;

function released(m: TMDBMovie) { const d = m.release_date || m.first_air_date; return !d || new Date(d) <= new Date(); }

export default function Home() {
  const [showStartup, setShowStartup] = useState(true), [rows, setRows] = useState<RowData[]>([]);
  const [heroMovie, setHeroMovie] = useState<TMDBMovie | null>(null), [heroIndex, setHeroIndex] = useState(0);
  const [heroMovies, setHeroMovies] = useState<TMDBMovie[]>([]), [focusedMovie, setFocusedMovie] = useState<TMDBMovie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null), [playingMovie, setPlayingMovie] = useState<{tmdbId:number;type:string;season?:number;episode?:number}|null>(null);
  const [showSearch, setShowSearch] = useState(false), [loading, setLoading] = useState(true), [activeFilter, setActiveFilter] = useState("all");
  const loadedPages = useRef<Record<string, number>>({}); const seenIds = useRef(new Set<number>());

  const fetchRow = useCallback(async (c: typeof ALL_CATEGORIES[number]) => {
    try { const r = await fetch(`/api/tmdb/feed?category=${c[2]}&page=1`); const d = await r.json();
      let items = (d.results || []).filter((m: TMDBMovie) => m.poster_path && !seenIds.current.has(m.id));
      items.forEach((m: TMDBMovie) => seenIds.current.add(m.id)); items = items.map((m: TMDBMovie) => ({...m, media_type:m.media_type || c[3] || "movie"}));
      loadedPages.current[c[0]] = 1; return {id:c[0],title:c[1],category:c[2],items,mediaType:c[3]};
    } catch { return {id:c[0],title:c[1],category:c[2],items:[],mediaType:c[3]}; }
  }, []);

  useEffect(() => { (async () => { setLoading(true); seenIds.current.clear(); const rs = await Promise.all(ALL_CATEGORIES.map(fetchRow));
    setRows(rs.filter(r=>r.items.length)); const heroes = rs.flatMap(r=>r.items).filter(m=>m.backdrop_path && released(m)).sort(()=>Math.random()-.5).slice(0,10); setHeroMovies(heroes); setHeroMovie(heroes[0]||null); setLoading(false);
  })(); }, [fetchRow]);
  useEffect(() => { if(heroMovies.length<2)return; const t=setInterval(()=>setHeroIndex(i=>{const n=(i+1)%heroMovies.length;setHeroMovie(heroMovies[n]);return n}),8000); return()=>clearInterval(t); }, [heroMovies]);

  const handlePlay = useCallback((id:number,type:string,season?:number,episode?:number)=>{ setPlayingMovie({tmdbId:id,type,season,episode}); setSelectedMovie(null); },[]);
  const handleFocus = useCallback((m:TMDBMovie|null)=>setFocusedMovie(m),[]);
  useEffect(()=>{ const key=(e:KeyboardEvent)=>{ if(e.key==="Escape"){if(playingMovie)setPlayingMovie(null);else if(selectedMovie)setSelectedMovie(null);else if(showSearch)setShowSearch(false)} if(e.key==="/"||(e.key==="f"&&e.ctrlKey)){e.preventDefault();setShowSearch(true)} if(e.key==="Backspace"&&!showSearch){e.preventDefault();if(playingMovie)setPlayingMovie(null);else if(selectedMovie)setSelectedMovie(null)} if(e.key==="Home")scrollTo({top:0,behavior:"smooth"})}; window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[playingMovie,selectedMovie,showSearch]);
  const filtered=rows.filter(r=>activeFilter==="all"|| (activeFilter==="movie"&&(r.mediaType==="movie"||r.id==="trending")) || (activeFilter==="tv"&&(r.mediaType==="tv"||r.id==="tv")));
  const home=useCallback(()=>{scrollTo({top:0,behavior:"smooth"});setActiveFilter("all")},[]);

  return <><PWARegister/>{showStartup&&<StartupAnimation onComplete={()=>setShowStartup(false)}/>}<LiveWallpaper focusedMovie={focusedMovie}/><AmbientAudio muted={showStartup}/>
    <div className="relative z-10"><Navbar onSearch={()=>setShowSearch(true)} onHome={home} onFilter={setActiveFilter} activeFilter={activeFilter}/>
      {activeFilter==="mylist"?<div className="pt-24"><MyListSection onSelect={setSelectedMovie} onFocus={handleFocus}/></div>:<>{heroMovie&&<HeroSection movie={heroMovie} onPlay={()=>released(heroMovie)&&handlePlay(heroMovie.id,heroMovie.media_type||"movie")} onDetails={()=>setSelectedMovie(heroMovie)}/>}<div className="relative z-10 -mt-20 pb-24">{loading&&<div className="px-6 space-y-8">{[1,2,3].map(i=><div key={i}><div className="skeleton h-7 w-48 mb-4"/><div className="flex gap-3 overflow-hidden">{[1,2,3,4,5,6].map(j=><div key={j} className="skeleton flex-shrink-0 w-44 h-64 rounded-lg"/>)}</div></div>)}</div>}{filtered.map((r,i)=><ContentRow key={r.id} title={r.title} items={r.items} delay={i*.08} onSelect={setSelectedMovie} onFocus={handleFocus}/>)}</div></>}</>}
    </div><FloatingNav onSearch={()=>setShowSearch(true)} onHome={home}/>
    {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} onSelect={m=>{setSelectedMovie(m);setShowSearch(false)}} onPlay={(id,t)=>{handlePlay(id,t);setShowSearch(false)}}/>}
    {selectedMovie&&<DetailModal movie={selectedMovie} onClose={()=>setSelectedMovie(null)} onPlay={handlePlay}/>} {playingMovie&&<PlayerOverlay tmdbId={playingMovie.tmdbId} type={playingMovie.type} season={playingMovie.season} episode={playingMovie.episode} onClose={()=>setPlayingMovie(null)}/>}</>;
}
