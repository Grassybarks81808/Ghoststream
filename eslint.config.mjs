import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      // Ghoststream intentionally uses plain <img> for cross-origin Internet
      // Archive thumbnails: the app is a static export, so next/image's
      // optimizer doesn't apply, and hotlinking archive.org with <img> +
      // lazy loading is the lightest-weight approach.
      "@next/next/no-img-element": "off",
      // App Router project — the pages/_document rule doesn't apply here.
      "@next/next/no-page-custom-font": "off",
    },
  },
]);
