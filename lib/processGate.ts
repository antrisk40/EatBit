/**
 * processGate — single-file + image/video gating.
 *
 * Rules (frontend-enforced, processing is 100% client-side):
 *   IMAGES:
 *     Anonymous → 3 free processes total (localStorage), then must log in.
 *     Logged in → unlimited, strictly ONE file at a time.
 *   VIDEOS (daily limits, reset at midnight UTC):
 *     Anonymous      → 2 videos/day, then must log in.
 *     Logged-in free → 4 videos/day, then must buy Premium.
 *     Premium        → unlimited videos.
 *   Both → strictly ONE file at a time:
 *     - file input has no `multiple`
 *     - drag-drop / paste takes only the first file
 *     - new uploads blocked while a file is queued/processing/done
 *       (user must remove/clear the current file first)
 */

export const ANON_FREE_LIMIT = 3;
const ANON_COUNT_KEY = "eb_gwr_anon_process_count";

export function getAnonProcessCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(ANON_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getAnonRemaining(): number {
  return Math.max(0, ANON_FREE_LIMIT - getAnonProcessCount());
}

export function incrementAnonProcessCount(): number {
  if (typeof window === "undefined") return 0;
  const next = getAnonProcessCount() + 1;
  localStorage.setItem(ANON_COUNT_KEY, String(next));
  return next;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("eb_access_token");
}

export const VIDEO_ANON_DAILY_LIMIT = 2;
export const VIDEO_FREE_DAILY_LIMIT = 4;

export type VideoTier = "anon" | "free";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function videoCountKey(tier: VideoTier): string {
  return `eb_gwr_video_${tier}_${todayStr()}`;
}

export function getVideoCount(tier: VideoTier): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(videoCountKey(tier));
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getVideoLimit(tier: VideoTier): number {
  return tier === "anon" ? VIDEO_ANON_DAILY_LIMIT : VIDEO_FREE_DAILY_LIMIT;
}

export function getVideoRemaining(tier: VideoTier): number {
  return Math.max(0, getVideoLimit(tier) - getVideoCount(tier));
}

export function incrementVideoCount(tier: VideoTier): number {
  if (typeof window === "undefined") return 0;
  const next = getVideoCount(tier) + 1;
  localStorage.setItem(videoCountKey(tier), String(next));
  return next;
}

export type VideoGateResult =
  | { allowed: true; tier: VideoTier }
  | { allowed: false; reason: "anon_video_limit" | "free_video_limit" };

/**
 * Gate for VIDEO files. Premium bypasses all limits (checked by caller).
 * Images keep their own separate rules (3 total anon / unlimited logged in).
 */
export function canProcessVideo(opts: {
  loggedIn: boolean;
}): VideoGateResult {
  if (!opts.loggedIn) {
    if (getVideoCount("anon") >= VIDEO_ANON_DAILY_LIMIT) {
      return { allowed: false, reason: "anon_video_limit" };
    }
    return { allowed: true, tier: "anon" };
  }
  if (getVideoCount("free") >= VIDEO_FREE_DAILY_LIMIT) {
    return { allowed: false, reason: "free_video_limit" };
  }
  return { allowed: true, tier: "free" };
}

export function openVideoLimitModal(reason: "anon_video_limit" | "free_video_limit") {
  if (reason === "anon_video_limit") {
    window.dispatchEvent(
      new CustomEvent("eatbit:open-login", {
        detail: {
          title: `Daily video limit reached (${VIDEO_ANON_DAILY_LIMIT}/${VIDEO_ANON_DAILY_LIMIT} used)`,
          subtitle: `Sign in free for ${VIDEO_FREE_DAILY_LIMIT} videos/day, or go Premium for unlimited videos.`,
        },
      })
    );
  } else {
    window.dispatchEvent(
      new CustomEvent("eatbit:open-upgrade", {
        detail: {
          title: `Daily video limit reached (${VIDEO_FREE_DAILY_LIMIT}/${VIDEO_FREE_DAILY_LIMIT} used)`,
          subtitle: "Upgrade to Premium for unlimited video processing.",
        },
      })
    );
  }
}

export type GateDecision =
  | { allowed: true }
  | { allowed: false; reason: "busy" | "anon_limit" };

/**
 * Central gate called BEFORE accepting a new file.
 * - busy: there is already a file in the queue or being processed.
 * - anon_limit: anonymous user already used their 3 free processes.
 */
export function canAcceptNewFile(opts: {
  hasExistingFile: boolean;
  isProcessing: boolean;
  loggedIn: boolean;
}): GateDecision {
  if (opts.isProcessing || opts.hasExistingFile) {
    return { allowed: false, reason: "busy" };
  }
  if (!opts.loggedIn && getAnonProcessCount() >= ANON_FREE_LIMIT) {
    return { allowed: false, reason: "anon_limit" };
  }
  return { allowed: true };
}

export function openLoginForAnonLimit(remaining: number) {
  window.dispatchEvent(
    new CustomEvent("eatbit:open-login", {
      detail: {
        title: "Free limit reached (3/3 used)",
        subtitle:
          remaining <= 0
            ? "You've used all 3 free processes. Sign in free for unlimited one-at-a-time processing."
            : `Only ${remaining} free left. Sign in free for unlimited one-at-a-time processing.`,
      },
    })
  );
}

export function openBusyNotice() {
  // Re-use login modal channel? No — busy is not auth related.
  // Dispatch a lightweight toast-style event pages listen for, fallback to alert-free inline message.
  window.dispatchEvent(new CustomEvent("eatbit:busy-file"));
}
