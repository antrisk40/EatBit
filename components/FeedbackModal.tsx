"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar, FaBriefcase, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { submitFeedback } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLnyGXKrgLTdkMgXnwL38DafnGxE-vhb-SzHG0gCKCl7aWrduKWGAomaiSUve4jrAY/exec";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [needsCustom, setNeedsCustom] = useState<"yes" | "no" | "">("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [timeline, setTimeline] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOverride, setEmailOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setLoading(true);
    const isCustom = needsCustom === "yes";
    const finalEmail = user?.email || emailOverride;

    try {
      const payload = {
        rating, message, 
        tool: window.location.pathname,
        feedback_type: isCustom ? "custom_software" : "general",
        budget: isCustom ? budget : undefined,
        requirements: isCustom ? requirements : undefined,
        timeline: isCustom ? timeline : undefined,
        phone: isCustom ? phone : undefined,
        email_override: emailOverride || undefined
      };
      
      // Submit to Backend CRM
      await submitFeedback(payload);
      
      // Submit to Google Sheet
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ 
            source: "Global Feedback Modal", 
            email: finalEmail, 
            rating, 
            description: message, 
            needsCustomSoftware: needsCustom,
            ...(isCustom ? { budget, requirements, timeline, phone } : {}),
            tool: window.location.pathname, 
            submitted_at: new Date().toISOString() 
          }),
        });
      } catch { /* ignore sheet errors */ }

      localStorage.setItem("eb_feedback", "submitted"); // Never ask again
      setSubmitted(true);
      setTimeout(onClose, 2500);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const skip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={skip}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

          {/* Close */}
          <button
            type="button"
            onClick={skip}
            className="absolute top-4 right-4 z-[100] p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close feedback modal"
          >
            <FaTimes />
          </button>

          <div className="p-6 md:p-8 relative z-10">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <FaStar className="text-green-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Thank you!</h2>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us make EatBit better.
                </p>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">How was your experience?</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  We&apos;d love to hear your thoughts on EatBit.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Star Rating */}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="text-4xl transition-colors focus:outline-none"
                      >
                        <FaStar
                          className={`${
                            (hovered || rating) >= star
                              ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                              : "text-muted-foreground/30"
                          } transition-all duration-200`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Feedback Text */}
                  {rating > 0 && rating < 3 ? (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-red-500 uppercase tracking-wider px-1">
                        We're sorry to hear that! What went wrong?
                      </label>
                      <textarea
                        required
                        placeholder="Please tell us why so we can fix it... *"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full h-20 p-3 bg-red-500/5 border border-red-500/30 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/70 transition-colors resize-none"
                      />
                    </div>
                  ) : (
                    <textarea
                      placeholder="Tell us what you loved or how we can improve... (optional)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full h-20 p-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
                    />
                  )}

                  {/* Custom Software Ask */}
                  <div className="pt-2 border-t border-border">
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 text-center">
                      Do you need custom software built for your business?
                    </label>
                    <div className="flex gap-3">
                      {(["yes", "no"] as const).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNeedsCustom(val)}
                          className={`flex-1 py-2.5 border text-sm font-bold transition-all duration-200 rounded-lg ${
                            needsCustom === val
                              ? (val === "yes" ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-muted text-foreground border-foreground/30")
                              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {val === "yes" ? "✓ Yes, I do!" : "No, thanks"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {needsCustom === "yes" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-2">
                      <div className="p-3 bg-primary/10 border border-primary/20 text-xs text-primary rounded-lg flex gap-2 items-center">
                        <FaBriefcase className="w-4 h-4" /> EatBit builds custom AI tools, SaaS platforms & web apps. Tell us about your project!
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">Budget (₹)</label>
                          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 50,000 – 2,00,000" className="w-full bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1">Timeline</label>
                          <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 1 month" className="w-full bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Phone (for quick follow-up) <span className="text-red-500">*</span></label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full bg-muted border border-border text-foreground text-xs px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">Describe your requirements <span className="text-red-500">*</span></label>
                        <textarea required value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={2} placeholder="Describe the app, features, integrations you need…" className="w-full bg-muted border border-border text-foreground text-xs px-3 py-2 resize-none outline-none focus:border-primary/60 transition-colors rounded-lg placeholder:text-muted-foreground/50" />
                      </div>
                    </motion.div>
                  )}

                  {!user && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Email</label>
                      <input type="email" required={needsCustom === "yes"} value={emailOverride} onChange={(e) => setEmailOverride(e.target.value)} placeholder="you@example.com" className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg placeholder:text-muted-foreground/50" />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={skip}
                      className="flex-1 py-3 border border-border text-foreground font-semibold rounded-xl text-sm hover:bg-muted transition-colors"
                    >
                      Remind me later
                    </button>
                    <button
                      type="submit"
                      disabled={loading || rating === 0}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                      {loading ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
