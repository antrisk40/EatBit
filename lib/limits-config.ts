/**
 * Server-side utility to fetch tool limits config from the EatBit API.
 * Used in server components / generateMetadata / layout.tsx for SSR.
 *
 * This ensures Google sees accurate, current limits in the rendered HTML,
 * and the limits are managed from the CRM — no code changes needed.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.eatbit.in";

export interface TierLimits {
  daily_downloads: number;
  daily_bulk: number;
  ads: boolean;
  image_free_total: number;
  video_daily: number;
}

export interface SeoText {
  hero_badge: string;
  image_limit_text: string;
  video_limit_text: string;
  premium_text: string;
  meta_description: string;
  feature_list: string[];
}

export interface LimitsConfig {
  tiers: {
    anonymous: TierLimits;
    free: TierLimits;
    pro: TierLimits;
  };
  seo_text: SeoText;
  updated_at?: string;
}

// Fallback when API is unreachable (matches the defaults in the backend)
const FALLBACK_CONFIG: LimitsConfig = {
  tiers: {
    anonymous: { daily_downloads: 1, daily_bulk: 0, ads: true, image_free_total: 3, video_daily: 2 },
    free:      { daily_downloads: 5, daily_bulk: 1, ads: true, image_free_total: -1, video_daily: 4 },
    pro:       { daily_downloads: -1, daily_bulk: -1, ads: false, image_free_total: -1, video_daily: -1 },
  },
  seo_text: {
    hero_badge: "3 Free Without Login · Sign In for Unlimited · One File at a Time",
    image_limit_text: "3 free without login, unlimited after sign-in (one at a time)",
    video_limit_text: "2/day without login, 4/day signed in",
    premium_text: "Premium for unlimited videos",
    meta_description: "Free browser tool to remove visible Google Gemini AI watermarks from images and videos, one file at a time. Images: 3 free without login, unlimited after sign-in. Videos: 2/day free, 4/day signed in, unlimited on Premium.",
    feature_list: [
      "Remove visible Gemini watermark from images",
      "Remove visible Gemini watermark from videos",
      "Single-file processing, one at a time",
      "Reverse alpha blending algorithm",
      "100% local browser processing",
      "Images: 3 free without login, unlimited after sign-in",
      "Videos: 2/day free, 4/day signed in, unlimited on Premium",
      "Supports JPG, PNG, WebP, MP4, WebM, MOV",
    ],
  },
};

/**
 * Fetch current limits config from the API.
 * Caches for 60 seconds via Next.js fetch cache (revalidate).
 * Falls back to hardcoded defaults if API is unreachable.
 */
export async function getLimitsConfig(): Promise<LimitsConfig> {
  try {
    const res = await fetch(`${API_BASE}/tools/limits/config`, {
      next: { revalidate: 60 }, // re-fetch every 60 seconds
    } as RequestInit);
    if (!res.ok) return FALLBACK_CONFIG;
    const data = await res.json();
    return data as LimitsConfig;
  } catch {
    return FALLBACK_CONFIG;
  }
}

export { FALLBACK_CONFIG };
