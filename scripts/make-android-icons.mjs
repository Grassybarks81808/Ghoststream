/**
 * Generates the Android launcher icons + splash screens (android/app/src/main/res)
 * from the Ghoststream ghost logo. Run AFTER `npx cap add android`.
 * Usage: npm run icons:android  (requires devDependency: sharp)
 */
import sharp from "sharp";

/** Full rounded-square icon (same art as the PWA icon). */
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c0508"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff3333"/>
      <stop offset="50%" stop-color="#e50914"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </linearGradient>
    <filter id="ghostGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="2.2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100" height="100" rx="22" fill="url(#bg)"/>
  <path d="M50 12 C27 12 18 30 18 49 L18 83 C18 86 21 88 23 85 L28 78.5 C30 75.5 33 75.5 35 78.5 L40 84.5 C42 87.5 45 87.5 47 84.5 L50 79 C52 76 55 76 57 79 L62 84.5 C64 87.5 67 87.5 69 84.5 L74 78.5 C76 75.5 79 75.5 81 78.5 L86 85 C88 88 91 86 91 83 L91 49 C91 30 73 12 50 12 Z"
    fill="url(#ghostGrad)" filter="url(#ghostGlow)"/>
  <ellipse cx="39" cy="45" rx="7.5" ry="9.5" fill="#000"/>
  <ellipse cx="41" cy="43" rx="2.8" ry="3.6" fill="#fff"/>
  <ellipse cx="61" cy="45" rx="7.5" ry="9.5" fill="#000"/>
  <ellipse cx="63" cy="43" rx="2.8" ry="3.6" fill="#fff"/>
  <ellipse cx="50" cy="61" rx="5.5" ry="3.8" fill="#000"/>
</svg>`;

/** Ghost only, transparent background — used for the adaptive-icon foreground. */
const GHOST_ONLY_SVG = ICON_SVG.replace(/<rect[^>]*\/>/, "").replace(
  'viewBox="0 0 100 100"',
  'viewBox="8 2 84 96"'
);

/** Circle mask for legacy round launcher icons. */
const CIRCLE_MASK = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
     </svg>`
  );

/** Splash background: same dark gradient as the app. */
const SPLASH_BG = (w, h) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
       <defs>
         <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stop-color="#1c0508"/>
           <stop offset="100%" stop-color="#0a0a0a"/>
         </linearGradient>
       </defs>
       <rect width="${w}" height="${h}" fill="url(#bg)"/>
     </svg>`
  );

const RES = "android/app/src/main/res";

// ── 1. Launcher icons ────────────────────────────────────────────────────
// legacy square/round + adaptive foreground at every density
const DENSITIES = {
  mdpi: 1,
  hdpi: 1.5,
  xhdpi: 2,
  xxhdpi: 3,
  xxxhdpi: 4,
};

for (const [density, scale] of Object.entries(DENSITIES)) {
  const launcher = Math.round(48 * scale); // legacy icon base: 48dp
  const foreground = Math.round(108 * scale); // adaptive foreground base: 108dp

  // legacy square
  await sharp(Buffer.from(ICON_SVG))
    .resize(launcher, launcher)
    .png()
    .toFile(`${RES}/mipmap-${density}/ic_launcher.png`);
  console.log(`✓ mipmap-${density}/ic_launcher.png (${launcher}px)`);

  // legacy round — circle-clipped
  const round = await sharp(Buffer.from(ICON_SVG))
    .resize(launcher, launcher)
    .png()
    .toBuffer();
  await sharp(round)
    .composite([{ input: CIRCLE_MASK(launcher), blend: "dest-in" }])
    .png()
    .toFile(`${RES}/mipmap-${density}/ic_launcher_round.png`);
  console.log(`✓ mipmap-${density}/ic_launcher_round.png (${launcher}px)`);

  // adaptive foreground — ghost alone, centered inside the 66% safe zone
  await sharp(Buffer.from(GHOST_ONLY_SVG))
    .resize(Math.round(foreground * 0.62), Math.round(foreground * 0.62))
    .png()
    .toBuffer()
    .then((ghost) =>
      sharp({
        create: {
          width: foreground,
          height: foreground,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: ghost, gravity: "center" }])
        .png()
        .toFile(`${RES}/mipmap-${density}/ic_launcher_foreground.png`)
    );
  console.log(`✓ mipmap-${density}/ic_launcher_foreground.png (${foreground}px)`);
}

// ── 2. Splash screens (same dimensions as the template files) ───────────
const SPLASH_DIRS = [
  { dir: "drawable", max: 480 },
  { dir: "drawable-port-mdpi", max: 480 },
  { dir: "drawable-port-hdpi", max: 720 },
  { dir: "drawable-port-xhdpi", max: 960 },
  { dir: "drawable-port-xxhdpi", max: 1280 },
  { dir: "drawable-port-xxxhdpi", max: 1920 },
  { dir: "drawable-land-mdpi", max: 800 },
  { dir: "drawable-land-hdpi", max: 1200 },
  { dir: "drawable-land-xhdpi", max: 1600 },
  { dir: "drawable-land-xxhdpi", max: 1920 },
  { dir: "drawable-land-xxxhdpi", max: 2560 },
];

for (const { dir, max } of SPLASH_DIRS) {
  const path = `${RES}/${dir}/splash.png`;
  const meta = await sharp(path).metadata();
  const { width, height } = meta;

  const ghostW = Math.round(Math.min(width, height) * 0.34);
  const ghost = await sharp(Buffer.from(GHOST_ONLY_SVG))
    .resize(ghostW, ghostW)
    .png()
    .toBuffer();

  await sharp(SPLASH_BG(width, height))
    .composite([{ input: ghost, gravity: "center" }])
    .png()
    .toFile(path);
  console.log(`✓ ${dir}/splash.png (${width}x${height})`);
}

console.log("Android icons + splash generated.");
