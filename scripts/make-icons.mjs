/**
 * Generates PWA icons (public/icons/*) from the Ghoststream ghost logo.
 * Usage: npm run icons  (requires devDependencies: sharp)
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const GHOST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">
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

// maskable icon: same ghost, centered smaller with more safe-zone padding
const MASKABLE_SVG = GHOST_SVG.replace(
  /viewBox="0 0 100 100"/,
  'viewBox="-14 -14 128 128"'
).replace(
  /<rect width="100" height="100"/,
  '<rect x="-14" y="-14" width="128" height="128"'
);

mkdirSync("public/icons", { recursive: true });

const targets = [
  { svg: GHOST_SVG, size: 192, file: "public/icons/icon-192.png" },
  { svg: GHOST_SVG, size: 512, file: "public/icons/icon-512.png" },
  { svg: MASKABLE_SVG, size: 512, file: "public/icons/icon-maskable-512.png" },
  { svg: GHOST_SVG, size: 180, file: "public/icons/apple-touch-icon.png" },
];

for (const t of targets) {
  await sharp(Buffer.from(t.svg)).resize(t.size, t.size).png().toFile(t.file);
  console.log("✓", t.file, `(${t.size}x${t.size})`);
}

writeFileSync("public/favicon.svg", GHOST_SVG);
console.log("✓ public/favicon.svg");

console.log("Icons generated.");
