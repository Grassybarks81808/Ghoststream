import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build — Ghoststream is a pure client-side app.
  // `npm run build` outputs to ./out and can be hosted anywhere.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Allow the dev server to be proxied by sandbox previews.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
