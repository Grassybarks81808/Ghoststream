package com.ghoststream.app;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Hands file downloads to Android's DownloadManager.
 *
 * The web app normally downloads via fetch + blob + <a download>, which does
 * nothing inside a WebView. When running as a native app the DownloadModal
 * calls this instead: files land in the public Downloads folder with a
 * system progress notification — no storage permission needed on API 29+.
 */
@CapacitorPlugin(name = "DownloadPlugin")
public class DownloadPlugin extends Plugin {

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String filename = call.getString("filename");

        if (url == null || url.isEmpty() || filename == null || filename.isEmpty()) {
            call.reject("url and filename are required");
            return;
        }

        // never let a mangled name escape the Downloads folder
        String safeName = filename.replaceAll("[\\\\/:*?\"<>|]", "_").trim();
        if (safeName.startsWith(".")) safeName = "_" + safeName;

        String mime = "application/octet-stream";
        String lower = safeName.toLowerCase();
        if (lower.endsWith(".mp4") || lower.endsWith(".m4v")) mime = "video/mp4";
        else if (lower.endsWith(".ogv")) mime = "video/ogg";
        else if (lower.endsWith(".webm")) mime = "video/webm";

        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setMimeType(mime);
            request.setTitle(safeName);
            request.setDescription("Ghoststream");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, safeName);
            request.setAllowedOverMetered(true);
            request.setAllowedOverRoaming(true);

            DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            if (dm == null) {
                call.reject("DownloadManager unavailable on this device");
                return;
            }
            long id = dm.enqueue(request);

            JSObject ret = new JSObject();
            ret.put("id", id);
            ret.put("filename", safeName);
            call.resolve(ret);
        } catch (SecurityException e) {
            call.reject("Storage permission denied: " + e.getMessage(), e);
        } catch (Exception e) {
            call.reject("Download failed: " + e.getMessage(), e);
        }
    }
}
