# 👻 GHOSTSTREAM

**Free movies. Zero ads. Public domain forever.**

A Netflix-style streaming app for **180+ hand-curated free classics** — horror, film noir, sci-fi, silent comedy (Keaton! Chaplin!), vintage cartoons, westerns, Hitchcock thrillers and gloriously terrible B-movies. Everything is streamed and downloaded **directly from the Internet Archive**, so it's 100% legal, 100% free, and there will never be an ad, an account, or a subscription.

---

## ⚡ Quick start (source)

```bash
git clone <this repo> ghoststream
cd ghoststream
npm install
npm run dev          # → http://localhost:3000
```

Production build (fully static, host anywhere):

```bash
npm run build        # → ./out  (pure static files — no server needed)
```

### Windows portable (no Node.js required)

Grab the **[Releases](../../releases)** page and download
`Ghoststream-x.x.x-Windows-Portable.zip`. Extract it anywhere and double-click
**`Start Ghoststream.bat`** — it ships with its own zero-dependency local server.

### Android (real APK — recommended)

Grab `Ghoststream-x.x.x-Android.apk` from the
**[Releases](../../releases)** page on your phone, tap it, and allow
"Install unknown apps" when asked (it's a normal signed APK, ~2 MB). You get:

- a real home-screen app with the ghost icon and splash screen,
- hardware **back button** that behaves like a proper Android app,
- downloads through Android's **Download Manager** (progress notification,
  files land in your Downloads folder),
- the full catalog bundled in the app — browsing works offline.

No Play Store, no account, no permissions beyond internet. It's built from
this exact source with [Capacitor](https://capacitorjs.com); the self-signed
sideload key lives in `android/` so anyone can reproduce the build.

### Android / iOS (PWA alternative)

Ghoststream is also an installable **PWA**. Host the build (or use any deployment of
it), open it in Chrome, and choose **Add to Home screen**. You get a
full-screen app with an icon, offline browsing of the catalog, and one-tap
playback.

---

## 🎬 What's inside

| Collection | Highlights |
| --- | --- |
| 👻 **Horror Classics** | *Night of the Living Dead*, *Nosferatu*, *Carnival of Souls*, *House on Haunted Hill*, *White Zombie*, *The Phantom of the Opera*, *Caligari*, *Häxan* |
| 🕵️ **Film Noir & Thrillers** | *Detour*, *D.O.A.*, *The Hitch-Hiker*, *Suddenly*, *Kansas City Confidential*, *The Stranger* (Welles), *The Amazing Mr. X* |
| 🚀 **Sci-Fi & Space** | *Metropolis*, *The Last Man on Earth*, *The Lost World*, *Rocketship X-M*, *The Phantom Planet*, *First Spaceship on Venus* |
| 🎩 **Comedy & Musical** | *His Girl Friday*, *Charade*, *My Man Godfrey*, *Nothing Sacred*, Martin & Lewis, Abbott & Costello, *Rock Rock Rock!* |
| 🎬 **Silent Masterpieces** | *The General*, *Steamboat Bill Jr.*, *Sherlock Jr.*, *The Thief of Bagdad*, *The Kid*, *Battleship Potemkin* |
| 🎨 **Vintage Cartoons** | Fleischer *Superman*, *Betty Boop*, *Popeye Meets Sindbad*, *Gulliver's Travels* (1939), Casper, Mighty Mouse, Woody Woodpecker |
| 🤠 **Wild West** | *Angel and the Badman* (John Wayne), the Lone Star westerns, *West of Hot Dog* (Keaton!) |
| 🤪 **So Bad, They're Good** | *Plan 9 from Outer Space*, *Glen or Glenda*, *Robot Monster*, *The Brain That Wouldn't Die*, *The Killer Shrews* |
| 🎭 **Hitchcock Classics** | *The 39 Steps*, *The Lady Vanishes*, *Secret Agent*, *Young and Innocent* |
| ✨ **Open Cinema (Creative Commons)** | *Sintel*, *Big Buck Bunny*, *Elephants Dream* — the Blender Foundation open movies, in HD |
| 📽️ **Pioneers of Cinema** | *A Trip to the Moon*, *The Great Train Robbery*, *Frankenstein* (1910), *Man with a Movie Camera*, *Nanook of the North* |

Plus **40+ new titles in v2.1**: Bela Lugosi & Karloff B-horror (*The Ape*, *Bowery at Midnight*), classic noir (*Fear in the Night*, *Railroaded*), westerns (*Fighting Caravans*, *The Over-the-Hill Gang*), Frank Capra's *Meet John Doe*, **10 Buster Keaton shorts** (*Cops*, *The Goat*, *The Playhouse*…), **7 Chaplin shorts** (*The Rink*, *One A.M.*, *The Cure*…) and the Three Stooges (*Disorder in the Court*, *Brideless Groom*).

Every title is in the **public domain (US)** or **Creative Commons licensed**, and was
hand-checked — this app does not touch pirated sources.

---

## ✨ Features

- **🍿 Instant streaming** — custom video player with resume, 10-second skips, playback speed, volume, fullscreen, and keyboard shortcuts (`space`, `←` `→`, `F`, `M`).
- **⬇️ Real downloads** — pick your quality, watch the progress bar, keep the file forever. Files come straight from archive.org; they're public domain, so they're *yours*.
- **🔎 Instant search** — press `/` anywhere. Search titles, genres, years, and cast names.
- **➕ My List & Continue Watching** — stored locally on your device. No accounts, no tracking, ever.
- **📱 Installable PWA** — Add to Home screen on Android/iOS, or install from Chrome/Edge on desktop. Offline catalog browsing via service worker.
- **👻 Cinematic vibes** — ambient haunted-theater soundscape, PS5-style nav sounds, adaptive glow borders that match each film's colors, live blurred wallpaper, gamepad/TV-remote friendly navigation.

---

## 🛠️ Tech stack

* **Framework:** Next.js 16 (App Router, static export) + React 19 + TypeScript
* **Styling:** Tailwind CSS 4
* **Content:** [Internet Archive](https://archive.org) — public-domain feature films & cartoons, resolved client-side via their CORS-enabled metadata API
* **Storage:** localStorage (My List, history, stream cache)
* **Audio:** Web Audio API (zero audio assets)
* **Packaging:** zero-dependency PowerShell launcher for Windows

### How it works

1. `src/lib/catalog.ts` holds a curated, verified list of ~180 archive.org identifiers with rich metadata (title, year, genres, synopsis).
2. When you press play or download, `src/lib/archive.ts` fetches that item's file list from `https://archive.org/metadata/<id>` **in your browser** (CORS-enabled), ranks the available MP4s by quality, and streams/downloads the best one.
3. There is no backend, no database, and no proxy — the app is a static site. Your device talks directly to archive.org.

---

## ⌨️ Shortcuts

| Action | Keyboard |
| --- | --- |
| Search | `/` |
| Play / pause | `space` or `K` |
| Skip ±10s | `←` / `→` |
| Volume | `↑` / `↓` |
| Mute | `M` |
| Fullscreen | `F` (or double-click video) |
| Close / back | `Esc` |

---

## ⚖️ Legal

* All films in the catalog are in the **public domain in the United States** (pre-1931 works, or post-1930 works whose copyrights lapsed through non-renewal or missing notice — e.g. *Night of the Living Dead*, *Charade*, *His Girl Friday*), or are **freely licensed** (Creative Commons — the Blender open movies).
* Content is served by the Internet Archive. Please be respectful of archive.org — downloads are direct and unthrottled by design, so don't hammer it.
* Poster art, ratings and genre metadata are fetched client-side from the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.
* This project hosts no video files itself.
