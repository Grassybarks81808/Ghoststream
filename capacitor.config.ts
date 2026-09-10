import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor wraps the static Next.js export (out/) into a native Android app.
 * The web app is bundled inside the APK (works offline for browsing); streams
 * and downloads still go straight to archive.org at runtime.
 */
const config: CapacitorConfig = {
  appId: "com.ghoststream.app",
  appName: "Ghoststream",
  webDir: "out",
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SystemBars: {
      // dark app → light (white) status & gesture-bar icons
      style: "DARK",
    },
  },
};

export default config;
