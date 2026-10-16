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
    // Microsoft Clarity custom event API
    clarity?: (method: string, ...args: unknown[]) => void;
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
  if (name === "limit_hit" || name === "limit_reached") lastGateAt = Date.now();
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, { ...pageContext(), ...params });
  }
  // Mirror to Clarity as a custom event (Clarity only accepts a string label)
  window.clarity?.("event", name);
}

/**
 * track() — Unified helper: sends to both GA4 and Microsoft Clarity.
 * Prefer this for all new event calls going forward.
 */
export function track(name: string, params: Record<string, unknown> = {}) {
  trackEvent(name, params);
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

// ─── Tool Funnel Helpers ──────────────────────────────────────────────────────

/** Fired when a user picks or drops a file — before the limit gate. */
export function trackFileSelected(file: File, tool?: string) {
  const size_mb = Math.round((file.size / (1024 * 1024)) * 10) / 10;
  // Bucket file size so GA4 reports don't blow up with 10k distinct values
  const size_bucket =
    size_mb < 1 ? "<1MB" :
    size_mb < 5 ? "1-5MB" :
    size_mb < 20 ? "5-20MB" : ">20MB";
  trackEvent("file_selected", {
    file_type: file.type || "unknown",
    file_kind: file.type.startsWith("video") ? "video" : "image",
    size_mb,
    size_bucket,
    tool: tool ?? (typeof window !== "undefined" ? window.location.pathname.split("/").pop() : ""),
  });
}

/** Fired when the user clicks a download button (before gate check). */
export function trackDownloadClick(params: {
  file_kind?: string;
  download_type?: "single" | "bulk_zip";
  plan?: string;
}) {
  trackEvent("download_click", params);
}

/** Fired after a file is successfully saved to disk. */
export function trackDownloadComplete(params: {
  file_kind?: string;
  download_type?: "single" | "bulk_zip";
  file_count?: number;
}) {
  trackEvent("download_complete", params);
}

/**
 * trackLimitReached — fired when the daily/plan limit actively blocks a user.
 * Distinct from limit_hit so it can be marked as a key event in GA4.
 * gate: "login" | "upgrade"
 * action: "upload" | "process" | "download"
 */
export function trackLimitReached(gate: "login" | "upgrade", action: "upload" | "process" | "download") {
  lastGateAt = Date.now();
  trackEvent("limit_reached", { gate, action });
  // Also fire the existing limit_hit for backwards compatibility
  trackEvent("limit_hit", { gate, action });
}

/** Fired when the user drags the before/after comparison slider. */
export function trackCompareSlider() {
  trackEvent("compare_slider_used", {});
}

// ─── Feedback Funnel Helpers ─────────────────────────────────────────────────

/**
 * trackFeedbackAbandon — fired when the feedback modal is closed
 * after the user has typed something (has_text) or selected a rating.
 */
export function trackFeedbackAbandon(params: { has_text: boolean; rating: number; source?: string }) {
  trackEvent("feedback_abandon", params);
}

// ─── Error Tracking ───────────────────────────────────────────────────────────

/** Fired for JavaScript runtime errors caught via window.onerror or ErrorBoundary. */
export function trackError(message: string, source?: string, line?: number) {
  trackEvent("js_error", {
    error_message: String(message).slice(0, 150), // GA4 max string length
    error_source: source ?? "unknown",
    error_line: line,
  });
}

/**
 * trackApiError — fired for failed API calls (4xx / 5xx).
 * Call this in fetch catch blocks.
 */
export function trackApiError(endpoint: string, status: number) {
  trackEvent("api_error", {
    endpoint: endpoint.replace(/https?:\/\/[^/]+/, ""), // strip origin
    status,
    is_rate_limit: status === 429,
    is_server_error: status >= 500,
  });
}

/**
 * useJsErrorTracker — mounts a global window.onerror + unhandledrejection listener
 * that sends js_error events to GA4 + Clarity automatically.
 * Mount once in GaTracker (already in layout).
 */
export function useJsErrorTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onError = (event: ErrorEvent) => {
      // Ignore cross-origin script errors (empty message, no source)
      if (!event.message || event.message === "Script error.") return;
      trackError(event.message, event.filename, event.lineno);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = event.reason instanceof Error
        ? event.reason.message
        : String(event.reason ?? "Unhandled rejection");
      trackError(msg, "unhandledrejection");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);
}
