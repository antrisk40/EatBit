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

export async function downloadWithGate(url: string, filename: string): Promise<boolean> {
  const result = await recordDownload();

  if (!result.allowed) {
    if (result.code === "signup_required") {
      window.dispatchEvent(new CustomEvent("eatbit:open-login"));
    } else {
      window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
    }
    return false;
  }

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return true;
}

export async function canProcessBeforeDownload(): Promise<boolean> {
  const { checkLimits } = await import("@/lib/api");
  const limits = await checkLimits();
  if (!limits.downloads.unlimited && limits.downloads.remaining <= 0) {
    if (limits.tier === "anonymous") {
      window.dispatchEvent(new CustomEvent("eatbit:open-login"));
    } else {
      window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
    }
    return false;
  }
  return true;
}
