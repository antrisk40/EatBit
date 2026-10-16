/**
 * downloadWithGate — enforces download limits via backend.
 *
 * Uses custom events so tool pages DON'T need to import useAuth.
 * AuthProvider listens for "eatbit:open-login" and "eatbit:open-upgrade".
 *
 * Usage (no callbacks needed):
 *   await downloadWithGate(blobUrl, "output.png");
 */

import { recordDownload } from "@/lib/api";
import { trackDownload, trackEvent } from "@/lib/analytics";

export interface DownloadMeta {
  /** "single" | "zip" | "bulk_zip" */
  download_type?: string;
  /** "image" | "video" | "pdf" etc. */
  file_kind?: string;
  /** number of files packaged (for zip) */
  file_count?: number;
}

export async function downloadWithGate(
  url: string,
  filename: string,
  skipRecording: boolean = false,
  meta: DownloadMeta = {}
): Promise<boolean> {
  if (!skipRecording) {
    const result = await recordDownload();

    if (!result.allowed) {
      trackEvent("limit_hit", {
        gate: result.code === "signup_required" ? "login" : "upgrade",
        action: "download",
      });
      if (result.code === "signup_required") {
        window.dispatchEvent(new CustomEvent("eatbit:open-login"));
      } else {
        window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
      }
      return false;
    }
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  trackDownload(filename, {
    download_type: meta.download_type ?? "single",
    file_kind: meta.file_kind,
    file_count: meta.file_count,
  });

  return true;
}

export async function canProcessBeforeDownload(): Promise<boolean> {
  const { checkLimits } = await import("@/lib/api");
  const limits = await checkLimits();
  if (!limits.downloads.unlimited && limits.downloads.remaining <= 0) {
    trackEvent("limit_hit", {
      gate: limits.tier === "anonymous" ? "login" : "upgrade",
      action: "process",
    });
    if (limits.tier === "anonymous") {
      window.dispatchEvent(new CustomEvent("eatbit:open-login"));
    } else {
      window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
    }
    return false;
  }
  return true;
}
