# 👻 GHOSTSTREAM

**The Ultimate Cinematic Streaming Experience** — A high-end, Netflix-style web application designed with epic cinematic vibes, ambient audio design, gamepad support, and local download capabilities.

---

## 📦 QUICK START: DOWNLOAD THE APP

Don't want to mess with source code, terminal commands, or Node.js?

1. Head over to the **[Releases](https://www.google.com/search?q=../../releases)** page.
2. Download the pre-built installer or executable package for your operating system (**Windows**, **macOS**, or **Linux**).
3. Run the installer and enjoy instant streaming!

---

## 🛠️ ALTERNATIVE: RUN FROM SOURCE

If you are a developer or prefer to run the project locally via source code, follow these steps:

### Prerequisites

* **Node.js**: Version 18+ recommended (Download from [nodejs.org](https://nodejs.org)).
* **FFmpeg**: Optional, required only if you want to use the local video download feature.

### Step-by-Step Installation

1. **Clone or Download the Repository**
Download and extract the project folder to your local machine (e.g., your Desktop).
2. **Open Terminal / Command Prompt**
* **Windows:** Press `Win + R`, type `cmd`, and press Enter. Then run:
```bash
cd Desktop\ghoststream

```


* **Mac / Linux:** Open your Terminal app and run:
```bash
cd ~/Desktop/ghoststream

```




3. **Install Dependencies**
```bash
npm install

```


*(Please allow 1–2 minutes for packages to download.)*
4. **Start Development Server**
```bash
npm run dev

```


5. **Open in Your Browser**
Open your web browser and navigate to: **http://localhost:3000**

---

## ✨ CORE FEATURES

### 🎬 Cinematic Streaming

* **Integrated Streaming:** Stream movies and TV shows instantly via `vidsrc-embed.ru`.
* **Rich Categories:** Browse dynamically through Trending, Action, Horror, Sci-Fi, and custom genres.
* **TV Show Support:** Full season and episode selection interface.
* **Coming Soon Badges:** Clear status indicators for unreleased or upcoming media.

### 🔊 Immersive Audio Experience

* **Cinematic Startup:** Deep bass impact upon launching the application.
* **Scary Ambient Background:** Dynamic atmospheric soundscape featuring:
* Deep bass breathing and pulsing tones.
* Random distant footsteps and atmospheric thuds.
* Eerie wind whispers for a haunted theater feel.


* **UI Sound FX:** Interactive PS5-style navigation audio ticks on every click and focus change.

### 🎨 Advanced Visual Design

* **Adaptive Interface:** Dynamic live wallpapers that softly blur and adapt to your currently focused content.
* **Glow Borders:** Color-adaptive lighting glows that match the dominant colors of movie posters.
* **Infinite Rows:** Smooth, Netflix-style horizontal scrolling categories.

### 🎮 Comprehensive Navigation & Controls

* **Standard Keyboard & Mouse:** Fully accessible via standard shortcuts.
* **Gamepad & TV Remotes:** Native-feeling D-pad support for smart TVs and game controllers.
* **Floating Ghost Menu:** Appears automatically when scrolling down on TV/Gamepad views to quickly jump Home or open Search.

| Action | Keyboard | Controller / Remote |
| --- | --- | --- |
| **Search** | Press `/` or click 🔍 | Navigate to search bar |
| **Go Back** | `Escape` or `Backspace` | Back button |
| **Navigate** | Arrow keys / Tab | D-pad |
| **Select** | Enter | `A` or `OK` button |
| **Scroll to Top** | `Home` key | — |

---

## 💾 OFFLINE DOWNLOADS (FFmpeg Integration)

GhostStream allows you to download your favorite media locally using FFmpeg.

### 1. Install FFmpeg

* **Windows:** Download a build from [ffmpeg.org](https://ffmpeg.org/download.html), extract it, and add it to your system PATH (or place `ffmpeg.exe` directly inside the project root folder).
* **Mac (Homebrew):** `brew install ffmpeg`
* **Linux (APT):** `sudo apt install ffmpeg`

### 2. How to Download

1. Click on any movie or TV episode.
2. Select the **Download** option.
3. Locate the stream URL:
* Open the video stream in your browser inspector.
* Go to the **Network** tab and filter by `.m3u8` or `.mp4`.
* Copy the direct stream URL.


4. Paste the URL into the GhostStream download dialog box.
5. Select your preferred resolution (Best, 1080p, 720p, 480p) and click **Start Download**. Track progress in real-time.

---

## ⚠️ TROUBLESHOOTING & FAQ

| Problem | Solution |
| --- | --- |
| **`npm not found` error** | Make sure you installed Node.js and **restarted your computer** afterward. |
| **Movies failing to load** | Check your internet connection or try switching to a different title (some host sources experience downtime). |
| **Video won't play** | Ad-blockers or strict browser privacy extensions may interfere with embed frames. Try disabling them temporarily. |
| **Download feature errors** | Ensure FFmpeg is correctly installed and accessible via your system PATH environment variables. |
| **No background sound** | Modern browsers block autoplay audio. **Click anywhere on the page** once after loading to unlock audio execution. |

---

## 🛠️ TECH STACK

* **Framework:** Next.js 16, React 19, TypeScript
* **Styling:** Tailwind CSS 4
* **Audio Engine:** Web Audio API (zero external audio asset files required)
* **Metadata Provider:** TMDB API
* **Media Embedding:** vidsrc-embed.ru
* **Download Pipeline:** Local FFmpeg execution

---

## 📱 DEVICE & PLATFORM SUPPORT

* ✅ Desktop Browsers (Chrome, Firefox, Edge, Safari)
* ✅ Dedicated Desktop App builds (Windows, Mac, Linux via Releases)
* ✅ Tablets & Mobile Web
* ✅ Smart TVs (via integrated web browsers)
* ✅ Game Controllers & Media Remotes

---

## 🔑 API CONFIGURATION

GhostStream comes pre-configured with a demo TMDB API key for immediate testing. For heavy production usage or custom instances, obtain your own free API key at [The Movie Database Settings](https://www.themoviedb.org/settings/api) and add it to your environment variables (`.env.local`).

---

Enjoy your movie night! 🍿👻
