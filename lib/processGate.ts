/**
 * processGate — single-file + image/video gating.
 *
 * Rules (frontend-enforced, processing is 100% client-side):
 *   IMAGES:
 *     Anonymous      → N free processes total (localStorage), then must log in.
 *     Logged-in free → N free processes total (or unlimited if -1), then must upgrade.
 *     Premium        → unlimited.
 *   VIDEOS (daily limits, reset at midnight UTC):
 *     Anonymous      → N videos/day, then must log in.
 *     Logged-in free → N videos/day, then must buy Premium.
 *     Premium        → unlimited videos.
 *
 * Limits + SEO text are fetched live from `/tools/limits/config` (managed via CRM).
 * Falls back to hardcoded defaults if API is unreachable.
 */

import { FALLBACK_CONFIG, type LimitsConfig, type SeoText } from "@/lib/limits-config";

// ── Dynamic limits (loaded from API, managed via CRM) ───────────────────────

let _ANON_FREE_LIMIT = FALLBACK_CONFIG.tiers.anonymous.image_free_total;
let _FREE_IMAGE_LIMIT = FALLBACK_CONFIG.tiers.free.image_free_total; // -1 = unlimited
let _VIDEO_ANON_DAILY_LIMIT = FALLBACK_CONFIG.tiers.anonymous.video_daily;
let _VIDEO_FREE_DAILY_LIMIT = FALLBACK_CONFIG.tiers.free.video_daily;
let _SEO_TEXT: SeoText = FALLBACK_CONFIG.seo_text;

const LIMITS_CACHE_KEY = "eb_limits_config";

function applyLimitsData(data: Partial<LimitsConfig>): void {
  if (data?.tiers) {
    const anon = data.tiers.anonymous;
    const free = data.tiers.free;
    if (anon?.image_free_total != null) _ANON_FREE_LIMIT = anon.image_free_total;
    if (free?.image_free_total != null) _FREE_IMAGE_LIMIT = free.image_free_total;
    if (anon?.video_daily != null) _VIDEO_ANON_DAILY_LIMIT = anon.video_daily;
    if (free?.video_daily != null) _VIDEO_FREE_DAILY_LIMIT = free.video_daily;
  }
  if (data?.seo_text) {
    _SEO_TEXT = {
      ...FALLBACK_CONFIG.seo_text,
      ...data.seo_text,
      feature_list:
        Array.isArray(data.seo_text.feature_list) && data.seo_text.feature_list.length > 0
          ? data.seo_text.feature_list
          : FALLBACK_CONFIG.seo_text.feature_list,
    };
  }
}

/** Load cached limits from localStorage for instant initial paint */
function loadCachedLimits(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LIMITS_CACHE_KEY);
    if (!raw) return;
    const cached = JSON.parse(raw);
    if (cached?.tiers) {
      applyLimitsData(cached);
    } else if (cached?.anonymous || cached?.free) {
      // Backward compatibility with previous cache shape
      applyLimitsData({ tiers: { anonymous: cached.anonymous, free: cached.free, pro: FALLBACK_CONFIG.tiers.pro } });
    }
  } catch { /* ignore */ }
}

/** Fetch latest limits & SEO text config from API (bypasses browser HTTP cache) */
export async function refreshLimitsConfig(): Promise<LimitsConfig | null> {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.eatbit.in";
    const res = await fetch(`${API_BASE}/tools/limits/config`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as LimitsConfig;
    applyLimitsData(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(LIMITS_CACHE_KEY, JSON.stringify({ ...data, _ts: Date.now() }));
    }
    return data;
  } catch {
    return null;
  }
}

// Load cached limits on module init (fresh API fetch will overwrite immediately on mount)
loadCachedLimits();

// ── Getters (return current dynamic values) ─────────────────────────────────

export function getAnonFreeLimit(): number { return _ANON_FREE_LIMIT; }
export function getFreeImageLimit(): number { return _FREE_IMAGE_LIMIT; }
export function getVideoAnonDailyLimit(): number { return _VIDEO_ANON_DAILY_LIMIT; }
export function getVideoFreeDailyLimit(): number { return _VIDEO_FREE_DAILY_LIMIT; }
export function getSeoText(): SeoText { return _SEO_TEXT; }

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
const FREE_IMAGE_COUNT_KEY = "eb_gwr_free_image_count";

export function getAnonProcessCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(ANON_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getAnonRemaining(): number {
  if (_ANON_FREE_LIMIT < 0) return Infinity;
  return Math.max(0, _ANON_FREE_LIMIT - getAnonProcessCount());
}

export function incrementAnonProcessCount(): number {
  if (typeof window === "undefined") return 0;
  const next = getAnonProcessCount() + 1;
  localStorage.setItem(ANON_COUNT_KEY, String(next));
  return next;
}

export function getFreeImageCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(FREE_IMAGE_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function getFreeImageRemaining(): number {
  if (_FREE_IMAGE_LIMIT < 0) return Infinity;
  return Math.max(0, _FREE_IMAGE_LIMIT - getFreeImageCount());
}

export function incrementFreeImageCount(): number {
  if (typeof window === "undefined") return 0;
  const next = getFreeImageCount() + 1;
  localStorage.setItem(FREE_IMAGE_COUNT_KEY, String(next));
  return next;
}

export type ImageGateResult =
  | { allowed: true; tier: "anon" | "free" }
  | { allowed: false; reason: "anon_image_limit" | "free_image_limit" };

export function canProcessImage(opts: { loggedIn: boolean }): ImageGateResult {
  if (!opts.loggedIn) {
    if (_ANON_FREE_LIMIT >= 0 && getAnonProcessCount() >= _ANON_FREE_LIMIT) {
      return { allowed: false, reason: "anon_image_limit" };
    }
    return { allowed: true, tier: "anon" };
  }
  if (_FREE_IMAGE_LIMIT >= 0 && getFreeImageCount() >= _FREE_IMAGE_LIMIT) {
    return { allowed: false, reason: "free_image_limit" };
  }
  return { allowed: true, tier: "free" };
}

export function openImageLimitModal(reason: "anon_image_limit" | "free_image_limit") {
  if (reason === "anon_image_limit") {
    const freeLabel = _FREE_IMAGE_LIMIT < 0 ? "unlimited" : `${_FREE_IMAGE_LIMIT} more`;
    window.dispatchEvent(
      new CustomEvent("eatbit:open-login", {
        detail: {
          title: `Free limit reached (${_ANON_FREE_LIMIT}/${_ANON_FREE_LIMIT} used)`,
          subtitle: `Sign in free for ${freeLabel} image processing, or upgrade to Pro for unlimited.`,
        },
      })
    );
  } else {
    window.dispatchEvent(
      new CustomEvent("eatbit:open-upgrade", {
        detail: {
          title: `Free image limit reached (${_FREE_IMAGE_LIMIT}/${_FREE_IMAGE_LIMIT} used)`,
          subtitle: "Upgrade to Pro for unlimited images and bulk processing.",
        },
      })
    );
  }
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
  const limit = getVideoLimit(tier);
  if (limit < 0) return Infinity;
  return Math.max(0, limit - getVideoCount(tier));
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

export function canProcessVideo(opts: {
  loggedIn: boolean;
}): VideoGateResult {
  if (!opts.loggedIn) {
    if (_VIDEO_ANON_DAILY_LIMIT >= 0 && getVideoCount("anon") >= _VIDEO_ANON_DAILY_LIMIT) {
      return { allowed: false, reason: "anon_video_limit" };
    }
    return { allowed: true, tier: "anon" };
  }
  if (_VIDEO_FREE_DAILY_LIMIT >= 0 && getVideoCount("free") >= _VIDEO_FREE_DAILY_LIMIT) {
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
            ? `You've used all ${_ANON_FREE_LIMIT} free processes. Sign in free for more or upgrade to Pro.`
            : `Only ${remaining} free left. Sign in free for more or upgrade to Pro.`,
      },
    })
  );
}

export function openBusyNotice() {
  window.dispatchEvent(new CustomEvent("eatbit:busy-file"));
}
