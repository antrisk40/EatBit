"use client";

import { useEffect, useRef } from "react";

export const GA_MEASUREMENT_ID = "G-TRB57BHFJF";

export const GWR_CANONICAL = "https://eatbit.in/tools/gemini-watermark-remover";

/** One UTM pair per channel. Canonical stays clean; tagged links are safe to share. */
export const TRACKING_LINKS = {
  reddit: `${GWR_CANONICAL}?utm_source=reddit&utm_medium=community`,
  producthunt: `${GWR_CANONICAL}?utm_source=producthunt&utm_medium=launch`,
  hackernews: `${GWR_CANONICAL}?utm_source=hackernews&utm_medium=launch`,
  directories: `${GWR_CANONICAL}?utm_source=directory&utm_medium=listing`,
  youtube: `${GWR_CANONICAL}?utm_source=youtube&utm_medium=video`,
  articles: `${GWR_CANONICAL}?utm_source=devto&utm_medium=article`,
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function pageContext(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const path = window.location.pathname;
  return {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    tool: path.split("/").filter(Boolean).pop() || path,
  };
}

export function skipStageFromMs(ms?: number): "just_after_popup" | "later" | "unknown" {
  if (ms === undefined) return "unknown";
  return ms < 3000 ? "just_after_popup" : "later";
}

const popupOpenedAt: Record<string, number> = {};
let lastGateAt = 0;

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (name === "limit_hit") lastGateAt = Date.now();
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { ...pageContext(), ...params });
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackClick(label: string, extra: Record<string, unknown> = {}) {
  trackEvent("click", { event_category: "engagement", event_label: label, ...extra });
}

export function trackPopupView(popupName: string, extra: Record<string, unknown> = {}) {
  popupOpenedAt[popupName] = Date.now();
  trackEvent("popup_view", { popup_name: popupName, ...extra });
}

export function trackPopupDismiss(popupName: string, extra: Record<string, unknown> = {}) {
  const opened = popupOpenedAt[popupName];
  const timeToDismissMs = opened ? Date.now() - opened : undefined;
  const skipStage = skipStageFromMs(timeToDismissMs);
  const gated = lastGateAt > 0 && Date.now() - lastGateAt < 60_000;
  trackEvent("popup_dismiss", {
    popup_name: popupName,
    time_to_dismiss_ms: timeToDismissMs,
    skip_stage: skipStage,
    gated,
    ...extra,
  });
  if (gated && (popupName === "login" || popupName === "upgrade" || popupName === "razorpay")) {
    trackEvent("funnel_drop", {
      drop_stage: skipStage,
      popup_name: popupName,
      drop_reason: "gate_popup_dismiss",
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("eatbit:gate-skip", {
          detail: { skip_stage: skipStage, popup_name: popupName },
        }),
      );
    }
  }
  delete popupOpenedAt[popupName];
}

export function trackPopupConvert(popupName: string, extra: Record<string, unknown> = {}) {
  const opened = popupOpenedAt[popupName];
  trackEvent("popup_convert", {
    popup_name: popupName,
    time_to_convert_ms: opened ? Date.now() - opened : undefined,
    ...extra,
  });
  delete popupOpenedAt[popupName];
}

/**
 * trackDownload — fires the GA4 `file_download` event with rich metadata.
 * download_type: "single" | "zip" | "bulk_zip"
 */
export function trackDownload(
  filename: string,
  extra: { download_type?: string; file_kind?: string; file_count?: number } = {}
) {
  trackEvent("file_download", {
    file_name: filename,
    link_text: filename,
    download_type: extra.download_type ?? "single",
    file_kind: extra.file_kind,
    file_count: extra.file_count,
  });
}

/**
 * useScrollDepthTracker — fires GA4 `scroll` events at 25 / 50 / 75 / 90 / 100 %
 * thresholds. Mirrors GA4's built-in scroll event so both appear in the same
 * report under the `percent_scrolled` dimension.
 */
export function useScrollDepthTracker(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const thresholds = [25, 50, 75, 90, 100];
    const fired = new Set<number>();

    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop + el.clientHeight;
      const total = el.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll", { percent_scrolled: t });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
}

/**
 * useEngagementTimeTracker — fires `user_engagement` events with the cumulative
 * engagement time (ms) when the user leaves the page or the tab becomes hidden.
 * This supplements GA4's automatic engagement time which can be inaccurate on SPAs.
 */
export function useEngagementTimeTracker(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const startedAt = Date.now();
    let engagedMs = 0;
    let activeStart = document.visibilityState === "visible" ? startedAt : null;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (activeStart) {
          engagedMs += Date.now() - activeStart;
          activeStart = null;
        }
        trackEvent("user_engagement", { engagement_time_msec: engagedMs });
      } else {
        activeStart = Date.now();
      }
    };

    const onLeave = () => {
      if (activeStart) engagedMs += Date.now() - activeStart;
      trackEvent("user_engagement", { engagement_time_msec: engagedMs });
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onLeave);
    };
  }, [enabled]);
}

export type FunnelItem = { id: string; status: string; kind?: string };

/**
 * Fires `download_skip` when a processed file never gets downloaded
 * (leave page, navigate away, remove card, clear queue, or skip a gate popup).
 */
export function useProcessDownloadFunnel(items: FunnelItem[]) {
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const downloaded = useRef(new Set<string>());
  const skipSent = useRef(new Set<string>());

  const markDownloaded = (id: string | "all") => {
    if (id === "all") {
      for (const item of itemsRef.current) downloaded.current.add(item.id);
      return;
    }
    downloaded.current.add(id);
  };

  const flushSkips = (reason: string, ids?: string[], skipStage = "before_download") => {
    const targets = ids
      ? itemsRef.current.filter((it) => ids.includes(it.id))
      : itemsRef.current;
    for (const item of targets) {
      if (item.status !== "done") continue;
      if (downloaded.current.has(item.id) || skipSent.current.has(item.id)) continue;
      skipSent.current.add(item.id);
      trackEvent("download_skip", {
        skip_reason: reason,
        file_kind: item.kind ?? "unknown",
        skip_stage: skipStage,
      });
    }
  };

  useEffect(() => {
    const onLeave = () => flushSkips("leave_page");
    const onGateSkip = (e: Event) => {
      const detail = (e as CustomEvent<{ skip_stage?: string; popup_name?: string }>).detail;
      flushSkips("popup_dismiss", undefined, detail?.skip_stage ?? "just_after_popup");
    };
    window.addEventListener("pagehide", onLeave);
    window.addEventListener("eatbit:gate-skip", onGateSkip);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("eatbit:gate-skip", onGateSkip);
      flushSkips("navigate_away");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { markDownloaded, flushSkips };
}
