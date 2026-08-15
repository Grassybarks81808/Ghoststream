# 👻 GHOSTSTREAM

**The Ultimate Streaming Experience** - A Netflix-like streaming app with epic cinematic vibes.

![Ghost Logo](https://img.shields.io/badge/GHOSTSTREAM-e50914?style=for-the-badge&logo=ghost&logoColor=white)

---

## 🚀 HOW TO RUN ON YOUR LAPTOP

### Step 1: Install Node.js (One-time)

1. Go to: **https://nodejs.org**
2. Click the big green **"LTS"** button
3. Install it (just click Next → Next → Install)
4. **Restart your computer**

### Step 2: Download This Project

Download or extract the project folder to your Desktop.

### Step 3: Open Terminal/Command Prompt

**Windows:**
1. Press `Win + R`, type `cmd`, press Enter
2. Type: `cd Desktop\ghoststream` (adjust folder name)

**Mac:**
1. Press `Cmd + Space`, type `Terminal`, press Enter  
2. Type: `cd ~/Desktop/ghoststream`

### Step 4: Install & Run

```bash
npm install
```
*(Wait 1-2 minutes)*

```bash
npm run dev
```

### Step 5: Open in Browser! 🎉

Go to: **http://localhost:3000**

---

## 🎮 CONTROLS

| Action | Keyboard | Controller/Remote |
|--------|----------|-------------------|
| Search | Press `/` or click 🔍 | Navigate to search |
| Go Back | `Escape` or `Backspace` | Back button |
| Navigate | Arrow keys / Tab | D-pad |
| Select | Enter | A / OK button |
| Scroll to top | `Home` key | - |

### Floating Menu (for TV/Gamepad)
When you scroll down, a floating red ghost button appears in the bottom-right corner. Click/select it to:
- 🏠 Go Home
- 🔍 Open Search

---

## ✨ FEATURES

### 🎬 Streaming
- Stream movies & TV shows via vidsrc-embed.ru
- Browse by category: Trending, Action, Horror, Sci-Fi, etc.
- Full episode selection for TV shows
- "Coming Soon" indicator for unreleased content

### ⬇️ Download (FFmpeg)
- Download movies and episodes using FFmpeg
- Quality selection: Best, 1080p, 720p, 480p
- Real-time progress tracking
- **Requires FFmpeg installed on your computer**

### 🎨 Design
- Ghost logo throughout the app
- Netflix-style infinite scrolling rows
- Live wallpaper that blurs to match focused content
- Color-adaptive glow borders based on movie poster

### 🔊 Audio
- **Cinematic startup** with deep bass impact
- **Scary ambient background** - monster-like presence with:
  - Deep bass breathing/pulsing
  - Random distant thuds (footsteps)
  - Eerie wind whispers
- **PS5-style navigation sounds** on every interaction

### 📺 Navigation
- **Home** - All content
- **Movies** - Only movies
- **TV Shows** - Only TV series
- **My List** - Your bookmarked content

---

## 💾 DOWNLOAD MOVIES (FFmpeg)

### Install FFmpeg First

**Windows:**
1. Go to: https://ffmpeg.org/download.html
2. Download a Windows build
3. Extract and add to PATH (or put ffmpeg.exe in project folder)

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### How to Download

1. Click on a movie/episode
2. Click **Download** button
3. You need to find the stream URL:
   - Open the video in browser
   - Right-click → Inspect → Network tab
   - Look for `.m3u8` or `.mp4` files
   - Copy the URL
4. Paste URL into the download dialog
5. Select quality
6. Click **Start Download**

---

## ⚠️ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "npm not found" | Restart computer after installing Node.js |
| Movies not loading | Check internet connection |
| Video won't play | Try a different movie (some may be blocked) |
| Download not working | Make sure FFmpeg is installed and in PATH |
| No sound | Click anywhere on the page first (browsers block autoplay) |

---

## 🛠️ TECH STACK

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Audio:** Web Audio API (no external files)
- **Data:** TMDB API
- **Streaming:** vidsrc-embed.ru
- **Downloads:** FFmpeg (local)

---

## 📱 DEVICE SUPPORT

- ✅ Desktop browsers (Chrome, Firefox, Edge, Safari)
- ✅ Laptops
- ✅ Tablets
- ✅ Smart TVs (web browser)
- ✅ Game controllers (D-pad navigation)
- ✅ TV remotes

---

## 🔑 API

This key is included for demo purposes. For production, get your own key at:
https://www.themoviedb.org/settings/api

---

Enjoy your movies! 🍿👻
