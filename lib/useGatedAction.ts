"use client";

import { useAuth } from "@/components/AuthProvider";
import { checkBulkAccess, recordDownload, triggerDownload, checkLimits, UsageLimits } from "@/lib/api";

/**
 * useGatedAction — tier-based gating for downloads and bulk ops.
 *
 * Tier rules:
 *   Anonymous  → 1 download/day (by IP), no bulk, sees ads
 *   Free acct  → 5 downloads/day, 1 bulk/day, sees ads
 *   EatBit Pro → unlimited everything, no ads
 *
 * All limits enforced in backend — not localStorage.
 */
export function useGatedAction() {
  const { openLogin, openUpgrade } = useAuth();

  /**
   * Call before triggering a file download.
   * Anonymous users get 1 free download/day — NO signup wall on first use.
   * After their daily limit: free users → signup modal, signed-in → upgrade modal.
   * Returns true if download should proceed.
   */
  const gatedDownload = async (url: string, filename: string): Promise<boolean> => {
    const result = await recordDownload();

    if (result.allowed) {
      triggerDownload(url, filename);

      // Show soft nudge after anonymous user uses their 1 free download
      if (result.limits.tier === "anonymous" && result.limits.downloads.remaining === 0) {
        // They just used their last free download — will see signup prompt next time
        // (no modal now — don't interrupt the download experience)
      }
      return true;
    }

    // Blocked
    if (result.code === "signup_required") {
      openLogin(); // soft: "Sign up free for 5/day"
    } else {
      openUpgrade(); // "Upgrade to EatBit Pro"
    }
    return false;
  };

  /**
   * Call before starting a bulk operation.
   * Requires login (anonymous users see login modal).
   * Free users: 1/day. Pro: unlimited.
   */
  const gatedBulk = async (): Promise<boolean> => {
    const result = await checkBulkAccess();

    if (result.allowed) return true;

    if (result.code === "login_required") {
      openLogin();
    } else {
      openUpgrade();
    }
    return false;
  };

  /**
   * Fetch current usage limits for the UI (e.g. show "3 downloads left today").
   * Works for anonymous users too.
   */
  const getLimits = async (): Promise<UsageLimits> => {
    return checkLimits();
  };

  return { gatedDownload, gatedBulk, getLimits };
}
