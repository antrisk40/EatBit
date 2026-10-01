"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaUser, FaCrown, FaSignOutAlt, FaCalendarAlt, FaTools, FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { user, loading, isPremium, signOut, openUpgrade } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const premiumUntil = user.premium_until
    ? new Date(user.premium_until).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              : user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>

        {/* Subscription card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl border p-6 ${isPremium
            ? "bg-primary/10 border-primary/30"
            : "bg-muted/50 border-border"}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaCrown className={isPremium ? "text-primary text-xl" : "text-muted-foreground text-xl"} />
              <div>
                <p className="font-bold text-foreground">{isPremium ? "Premium Plan" : "Free Plan"}</p>
                {isPremium && premiumUntil && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <FaCalendarAlt />
                    Active until {premiumUntil}
                  </p>
                )}
              </div>
            </div>
            {isPremium
              ? <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
                  <FaCheckCircle /> Active
                </span>
              : <button
                  onClick={openUpgrade}
                  className="text-xs font-bold text-primary-foreground bg-primary px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <FaCrown /> Upgrade to Pro
                </button>
            }
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Bulk processing", ok: isPremium },
              { label: "Unlimited downloads", ok: true },
              { label: "All image tools", ok: true },
              { label: "All video tools", ok: true },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-sm text-foreground">
                <FaCheckCircle className={f.ok ? "text-green-400" : "text-muted-foreground/40"} />
                <span className={!f.ok ? "text-muted-foreground line-through" : ""}>{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-muted/30 p-6"
        >
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FaTools className="text-primary" /> Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Bulk Watermark Remover", href: "/tools/bulk-gemini-watermark-remover", premium: true },
              { label: "Watermark Remover", href: "/tools/gemini-watermark-remover", premium: false },
              { label: "Image Converter", href: "/tools/image-converter", premium: false },
              { label: "Image Cropper", href: "/tools/image-cropper-and-resizer", premium: false },
            ].map((tool) => (
              <a
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {tool.label}
                </span>
                {tool.premium && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                )}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => { signOut(); router.push("/"); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
          >
            <FaSignOutAlt /> Sign out
          </button>
        </motion.div>

      </div>
    </main>
  );
}
