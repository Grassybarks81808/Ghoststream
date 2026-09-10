/**
 * Capacitor native-app helpers.
 *
 * All of these are silent no-ops when Ghoststream runs as a normal website /
 * PWA — they only do something inside the Android APK (WebView).
 */

interface CapListener {
  remove: () => void;
}

interface CapPlugins {
  App?: {
    addListener: (
      event: "backButton",
      cb: () => void
    ) => Promise<CapListener> | CapListener;
    exitApp?: () => void;
  };
  DownloadPlugin?: {
    download: (opts: { url: string; filename: string }) => Promise<unknown>;
  };
}

interface CapGlobal {
  isNativePlatform?: () => boolean;
  Plugins: CapPlugins;
}

function cap(): CapGlobal | null {
  if (typeof window === "undefined") return null;
  return (window as { Capacitor?: CapGlobal }).Capacitor ?? null;
}

/** True when running inside the native Android/iOS app shell. */
export function isNativeApp(): boolean {
  return Boolean(cap()?.isNativePlatform?.());
}

/**
 * Hand a file download to the native DownloadManager (Android).
 * Returns false on the web or if the native plugin is unavailable.
 */
export async function nativeDownload(url: string, filename: string): Promise<boolean> {
  const c = cap();
  if (!c?.isNativePlatform?.() || !c.Plugins.DownloadPlugin) return false;
  try {
    await c.Plugins.DownloadPlugin.download({ url, filename });
    return true;
  } catch {
    return false;
  }
}

/**
 * Subscribe to the Android hardware back button (native app only).
 * Returns an unsubscribe function, or null on the web.
 */
export function onNativeBackButton(handler: () => void): (() => void) | null {
  const c = cap();
  const app = c?.Plugins.App;
  if (!c?.isNativePlatform?.() || !app) return null;

  let removed = false;
  let pending: CapListener | null = null;
  const result = app.addListener("backButton", handler);

  if (result && typeof (result as Promise<unknown>).then === "function") {
    void (result as Promise<CapListener>).then((l) => {
      if (removed) l.remove();
      else pending = l;
    });
  } else {
    pending = result as CapListener;
  }

  return () => {
    removed = true;
    pending?.remove();
  };
}

/** Exit/minimize the native app (used when back is pressed at the root). */
export function nativeExitApp(): void {
  cap()?.Plugins.App?.exitApp?.();
}
