"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaWhatsapp, FaArrowRight, FaRocket } from "react-icons/fa";

export default function ClientLeadBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25 }}
          className="relative overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 mb-4"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss banner"
          >
            <FaTimes className="w-3 h-3" />
          </button>

          {/* Glow orb */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none" />

          {/* Icon */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <FaRocket className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Need a Custom App?
            </p>
          </div>

          <p className="text-sm text-foreground font-semibold mb-1 leading-snug">
            We build AI tools, SaaS & web apps
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            EatBit turns your idea into a working product — fast. Free
            consultation, no obligation.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Get a Free Quote <FaArrowRight className="w-2.5 h-2.5" />
            </Link>
            <a
              href="https://wa.me/8319212779?text=Hi%2C%20I%20found%20your%20tool%20on%20EatBit%20and%20I%27m%20interested%20in%20custom%20software."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-green-500/40 bg-green-500/10 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors"
            >
              <FaWhatsapp className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
