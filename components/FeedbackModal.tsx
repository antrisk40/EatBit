"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar } from "react-icons/fa";
import { submitFeedback } from "@/lib/api";

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setLoading(true);
    try {
      await submitFeedback({ rating, message, tool: window.location.pathname });
      localStorage.setItem("eb_feedback", "submitted"); // Never ask again
      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const skip = () => {
    // Keep it as a timestamp so it asks again in 3 days
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
          className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

          {/* Close */}
          <button
            onClick={skip}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <FaTimes />
          </button>

          <div className="p-8 relative z-10 text-center">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                <h2 className="text-2xl font-bold text-foreground mb-2">How was your experience?</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We&apos;d love to hear your thoughts on EatBit.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                  <textarea
                    placeholder="Tell us what you loved or how we can improve... (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-24 p-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />

                  <div className="flex gap-3">
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
                      className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Submitting..." : "Submit"}
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
