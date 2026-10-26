/**
 * processGate — single-file + image/video gating.
 *
 * Rules (frontend-enforced, processing is 100% client-side):
 *   IMAGES:
 *     Anonymous → N free processes total (localStorage), then must log in.
 *     Logged in → unlimited, strictly ONE file at a time.
 *   VIDEOS (daily limits, reset at midnight UTC):
 *     Anonymous      → N videos/day, then must log in.
 *     Logged-in free → N videos/day, then must buy Premium.
 *     Premium        → unlimited videos.
 *   Both → strictly ONE file at a time:
 *     - file input has no `multiple`
 *     - drag-drop / paste takes only the first file
 *     - new uploads blocked while a file is queued/processing/done
 *       (user must remove/clear the current file first)
 *
 * Limits are now fetched from the API (managed via CRM) and cached in localStorage.
 * Falls back to hardcoded defaults if API is unreachable.
 */

// ── Dynamic limits (loaded from API, managed via CRM) ───────────────────────

// Defaults (used until API config is fetched)
let _ANON_FREE_LIMIT = 3;
let _VIDEO_ANON_DAILY_LIMIT = 2;
let _VIDEO_FREE_DAILY_LIMIT = 4;

const LIMITS_CACHE_KEY = "eb_limits_config";
const LIMITS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/** Load cached limits from localStorage */
function loadCachedLimits(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LIMITS_CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw);
    if (Date.now() - (cached._ts || 0) > LIMITS_CACHE_TTL) return; // expired
    if (cached.anonymous?.image_free_total != null) _ANON_FREE_LIMIT = cached.anonymous.image_free_total;
    if (cached.anonymous?.video_daily != null) _VIDEO_ANON_DAILY_LIMIT = cached.anonymous.video_daily;
    if (cached.free?.video_daily != null) _VIDEO_FREE_DAILY_LIMIT = cached.free.video_daily;
  } catch { /* ignore */ }
}

/** Fetch limits config from API and cache */
export async function refreshLimitsConfig(): Promise<void> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.eatbit.in";
    const res = await fetch(`${API_BASE}/tools/limits/config`);
    if (!res.ok) return;
    const data = await res.json();
    if (data?.tiers) {
      const anon = data.tiers.anonymous;
      const free = data.tiers.free;
      if (anon?.image_free_total != null) _ANON_FREE_LIMIT = anon.image_free_total;
      if (anon?.video_daily != null) _VIDEO_ANON_DAILY_LIMIT = anon.video_daily;
      if (free?.video_daily != null) _VIDEO_FREE_DAILY_LIMIT = free.video_daily;
      // Cache in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(LIMITS_CACHE_KEY, JSON.stringify({
          anonymous: anon,
          free,
          _ts: Date.now(),
        }));
      }
    }
  } catch { /* silent — use defaults */ }
}

// Load cached limits on module init
loadCachedLimits();

// ── Getters (return current dynamic values) ─────────────────────────────────

export function getAnonFreeLimit(): number { return _ANON_FREE_LIMIT; }
export function getVideoAnonDailyLimit(): number { return _VIDEO_ANON_DAILY_LIMIT; }
export function getVideoFreeDailyLimit(): number { return _VIDEO_FREE_DAILY_LIMIT; }

// Keep named exports for backward compat (these are getters that return current values)
export const ANON_FREE_LIMIT = new Proxy({ value: 3 }, {
  get: (_, prop) => prop === "valueOf" || prop === Symbol.toPrimitive ? () => _ANON_FREE_LIMIT : _ANON_FREE_LIMIT,
}) as unknown as number;

export const VIDEO_ANON_DAILY_LIMIT = new Proxy({ value: 2 }, {
  get: (_, prop) => prop === Symbol.toPrimitive ? () => _VIDEO_ANON_DAILY_LIMIT : _VIDEO_ANON_DAILY_LIMIT,
}) as unknown as number;

export const VIDEO_FREE_DAILY_LIMIT = new Proxy({ value: 4 }, {
  get: (_, prop) => prop === Symbol.toPrimitive ? () => _VIDEO_FREE_DAILY_LIMIT : _VIDEO_FREE_DAILY_LIMIT,
}) as unknown as number;


// ── Image gating ────────────────────────────────────────────────────────────

const ANON_COUNT_KEY = "eb_gwr_anon_process_count";

export function getAnonProcessCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(ANON_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getAnonRemaining(): number {
  return Math.max(0, _ANON_FREE_LIMIT - getAnonProcessCount());
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


// ── Video gating ────────────────────────────────────────────────────────────

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
  return tier === "anon" ? _VIDEO_ANON_DAILY_LIMIT : _VIDEO_FREE_DAILY_LIMIT;
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
 * Images keep their own separate rules (N total anon / unlimited logged in).
 */
export function canProcessVideo(opts: {
  loggedIn: boolean;
}): VideoGateResult {
  if (!opts.loggedIn) {
    if (getVideoCount("anon") >= _VIDEO_ANON_DAILY_LIMIT) {
      return { allowed: false, reason: "anon_video_limit" };
    }
    return { allowed: true, tier: "anon" };
  }
  if (getVideoCount("free") >= _VIDEO_FREE_DAILY_LIMIT) {
    return { allowed: false, reason: "free_video_limit" };
  }
  return { allowed: true, tier: "free" };
}

export function openVideoLimitModal(reason: "anon_video_limit" | "free_video_limit") {
  if (reason === "anon_video_limit") {
    window.dispatchEvent(
      new CustomEvent("eatbit:open-login", {
        detail: {
          title: `Daily video limit reached (${_VIDEO_ANON_DAILY_LIMIT}/${_VIDEO_ANON_DAILY_LIMIT} used)`,
          subtitle: `Sign in free for ${_VIDEO_FREE_DAILY_LIMIT} videos/day, or go Premium for unlimited videos.`,
        },
      })
    );
  } else {
    window.dispatchEvent(
      new CustomEvent("eatbit:open-upgrade", {
        detail: {
          title: `Daily video limit reached (${_VIDEO_FREE_DAILY_LIMIT}/${_VIDEO_FREE_DAILY_LIMIT} used)`,
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
 * - anon_limit: anonymous user already used their N free processes.
 */
export function canAcceptNewFile(opts: {
  hasExistingFile: boolean;
  isProcessing: boolean;
  loggedIn: boolean;
}): GateDecision {
  if (opts.isProcessing || opts.hasExistingFile) {
    return { allowed: false, reason: "busy" };
  }
  if (!opts.loggedIn && getAnonProcessCount() >= _ANON_FREE_LIMIT) {
    return { allowed: false, reason: "anon_limit" };
  }
  return { allowed: true };
}

export function openLoginForAnonLimit(remaining: number) {
  window.dispatchEvent(
    new CustomEvent("eatbit:open-login", {
      detail: {
        title: `Free limit reached (${_ANON_FREE_LIMIT}/${_ANON_FREE_LIMIT} used)`,
        subtitle:
          remaining <= 0
            ? `You've used all ${_ANON_FREE_LIMIT} free processes. Sign in free for unlimited one-at-a-time processing.`
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
