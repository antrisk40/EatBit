"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaCrown, FaCheck, FaBolt, FaShieldAlt,
  FaInfinity, FaCalendarAlt, FaTag,
} from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";
import { createPremiumOrder, verifyPremiumPayment, getAvailablePlans, PlanType, PlanOption } from "@/lib/api";

declare global {
  interface Window { Razorpay: any; } // eslint-disable-line @typescript-eslint/no-explicit-any
}

const FEATURES = [
  { icon: <FaBolt className="text-yellow-400" />, text: "Bulk process unlimited files" },
  { icon: <FaShieldAlt className="text-green-400" />, text: "100% private — client-side only" },
  { icon: <FaInfinity className="text-blue-400" />, text: "Unlimited downloads" },
  { icon: <FaCheck className="text-primary" />, text: "Cancel anytime" },
];

export default function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, refreshUser, openLogin, user } = useAuth();
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load plans from server when modal opens
  useEffect(() => {
    if (showUpgradeModal) {
      getAvailablePlans().then((p) => {
        if (p.length > 0) setPlans(p);
      });
    }
  }, [showUpgradeModal]);

  if (!showUpgradeModal) return null;

  const chosen = plans.find((p) => p.plan === selectedPlan);

  const handleUpgrade = async () => {
    if (!user) { setShowUpgradeModal(false); openLogin(); return; }

    setLoading(true);
    setError("");
    try {
      const order = await createPremiumOrder(selectedPlan);

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(s);
        });
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.razorpay_key_id,
          amount: order.amount,
          currency: order.currency,
          name: "EatBit",
          description: `${chosen?.label ?? selectedPlan} Plan`,
          order_id: order.order_id,
          prefill: { email: user.email, name: user.name, contact: user.phone ?? "" },
          theme: { color: "#f97316" },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await verifyPremiumPayment({ ...response, plan: selectedPlan });
              await refreshUser();
              setSuccess(true);
              resolve();
            } catch (err: unknown) {
              reject(err instanceof Error ? err : new Error("Verification failed"));
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg !== "Payment cancelled") setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => !success && setShowUpgradeModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-background border border-primary/30 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <FaTimes />
            </button>

            <div className="p-8 relative z-10">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <FaCheck className="text-green-400 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">You&apos;re Premium! 🎉</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    Bulk tools are now unlocked. Enjoy your {selectedPlan} plan!
                  </p>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
                  >
                    Start Using Bulk Tools
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                      <FaCrown className="text-primary text-xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">EatBit Pro</h2>
                    <p className="text-sm text-muted-foreground">Unlimited tools, no ads, bulk processing</p>
                  </div>

                  {/* Plan toggle */}
                  {plans.length > 0 && (
                    <div className="flex bg-muted rounded-xl p-1 mb-5 gap-1">
                      {plans.map((p) => (
                        <button
                          key={p.plan}
                          onClick={() => setSelectedPlan(p.plan)}
                          className={`relative flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            selectedPlan === p.plan
                              ? "bg-background text-foreground shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {p.label}
                          {p.badge && (
                            <span className="absolute -top-2 -right-1 text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                              {p.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price display */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlan}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center mb-5"
                    >
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl font-bold text-muted-foreground">₹</span>
                        <span className="text-5xl font-extrabold text-foreground">
                          {chosen?.price_inr ?? (selectedPlan === "yearly" ? 699 : 99)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <FaCalendarAlt className="text-muted-foreground text-xs" />
                        <p className="text-sm text-muted-foreground">
                          {selectedPlan === "yearly"
                            ? `per year · ~₹${Math.round((chosen?.price_inr ?? 699) / 12)}/month`
                            : "per month · cancel anytime"}
                        </p>
                      </div>
                      {selectedPlan === "yearly" && (
                        <p className="text-xs text-green-400 font-semibold mt-1 flex items-center justify-center gap-1">
                          <FaTag />
                          You save ₹{((plans.find(p => p.plan === 'monthly')?.price_inr ?? 99) * 12) - (chosen?.price_inr ?? 699)} vs monthly
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-5">
                    {FEATURES.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                        <span className="flex-shrink-0">{f.icon}</span>
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  {error && (
                    <p className="text-red-400 text-xs text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-3 mb-4">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaCrown />
                    {loading
                      ? "Opening payment…"
                      : user
                        ? `Get ${selectedPlan === "yearly" ? "Yearly" : "Monthly"} — ₹${chosen?.price_inr ?? ""}`
                        : "Sign in to Upgrade"}
                  </button>
                  <p className="text-[10px] text-muted-foreground text-center mt-3">
                    Secured by Razorpay · UPI, Cards, NetBanking accepted
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
