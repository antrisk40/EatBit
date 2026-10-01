"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCrown } from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";

interface AdBannerProps {
  slot?: "tool-top" | "tool-bottom" | "sidebar";
  className?: string;
}

// ── AdSense config (set in Vercel env vars for prod) ─────────────────────────
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
const ADSENSE_SLOT   = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER ?? "";
const HAS_ADSENSE    = Boolean(ADSENSE_CLIENT && !ADSENSE_CLIENT.includes("XXXX"));

// ── Fallback promo messages (shown locally / before AdSense approval) ─────────
const PROMO_MESSAGES = [
  { headline: "EatBit Pro",                                   sub: "Unlimited downloads · bulk processing · no ads" },
  { headline: "Free: 1 download/day, 1 bulk/day",           sub: "EatBit Pro removes all limits" },
  { headline: "Remove Ads + Unlimited Everything",           sub: "Upgrade to EatBit Pro" },
];

// ── Google AdSense unit ───────────────────────────────────────────────────────
function AdSenseUnit({ format = "auto" }: { format?: string }) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!HAS_ADSENSE) return;
    try {
      // Push ad only once per mount
      if (ref.current && ref.current.dataset.adStatus === undefined) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (_) {}
  }, []);

  if (!HAS_ADSENSE) return null;

  return (
    <ins
      ref={ref}
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={ADSENSE_SLOT}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdBanner({ slot = "tool-bottom", className = "" }: AdBannerProps) {
  const { isPremium, user, openUpgrade, openLogin } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Premium users never see ads
  if (isPremium || dismissed) return null;

  const msg = PROMO_MESSAGES[Math.floor(Date.now() / 60000) % PROMO_MESSAGES.length];

  // ── Sidebar slot ─────────────────────────────────────────────────────────
  if (slot === "sidebar") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className={`relative rounded-xl border border-primary/25 bg-primary/5 p-4 overflow-hidden ${className}`}
        >
          <button onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Dismiss">
            <FaTimes className="text-xs" />
          </button>

          {HAS_ADSENSE ? (
            <AdSenseUnit format="rectangle" />
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCrown className="text-primary text-xs" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground leading-snug">{msg.headline}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{msg.sub}</p>
                <button onClick={user ? openUpgrade : openLogin}
                  className="mt-2.5 text-xs font-bold text-primary-foreground bg-primary px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                  {user ? "Upgrade Now" : "Sign In Free"}
                </button>
              </div>
            </div>
          )}
          <p className="text-[9px] text-muted-foreground/50 mt-2 text-right">Sponsored</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Horizontal banner (tool-top / tool-bottom) ───────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: slot === "tool-top" ? -8 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-xl border border-border ${className}`}
      >
        {/* Dismiss button always visible */}
        <button onClick={() => setDismissed(true)}
          className="absolute top-1.5 right-2 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss ad">
          <FaTimes className="text-xs" />
        </button>

        {HAS_ADSENSE ? (
          /* Real AdSense ad */
          <div className="px-2 py-1 min-h-[90px]">
            <AdSenseUnit format="horizontal" />
          </div>
        ) : (
          /* Promo fallback */
          <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-muted/60 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <FaCrown className="text-primary text-xs" />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-foreground text-sm">{msg.headline}</span>
                <span className="hidden sm:inline text-muted-foreground text-xs ml-2">· {msg.sub}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mr-4">
              <button onClick={user ? openUpgrade : openLogin}
                className="text-xs font-bold text-primary-foreground bg-primary px-3 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all whitespace-nowrap">
                {user ? "Upgrade" : "Sign In"}
              </button>
            </div>
          </div>
        )}

        <span className="absolute bottom-0.5 right-10 text-[9px] text-muted-foreground/40 pointer-events-none">Ad</span>
      </motion.div>
    </AnimatePresence>
  );
}
