"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackClick, trackEvent, trackPageView, useScrollDepthTracker, useEngagementTimeTracker } from "@/lib/analytics";

export default function GaTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  // Track SPA navigations as page_view events
  useEffect(() => {
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView(path);
  }, [pathname, searchParams]);

  // Track clicks on any element with data-ga-event attribute
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-ga-event]");
      if (!el) return;
      const name = el.getAttribute("data-ga-event") || "click";
      const label = el.getAttribute("data-ga-label") || el.getAttribute("aria-label") || "";
      const extra: Record<string, unknown> = {};
      const raw = el.getAttribute("data-ga-params");
      if (raw) {
        try {
          Object.assign(extra, JSON.parse(raw));
        } catch {
          /* ignore bad JSON */
        }
      }
      if (name === "click") trackClick(label, extra);
      else trackEvent(name, { event_label: label, ...extra });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Scroll depth: fires scroll events at 25 / 50 / 75 / 90 / 100%
  useScrollDepthTracker();

  // Engagement time: fires user_engagement on tab hide / page unload
  useEngagementTimeTracker();

  return null;
}
