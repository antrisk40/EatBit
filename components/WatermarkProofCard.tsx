"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCheck, FaArrowsAltH, FaEye } from "react-icons/fa";

interface WatermarkProofCardProps {
  sampleNumber: string;
  modelBadge: string;
  title: string;
  categoryBadgeClass?: string;
  originalSrc: string;
  removedSrc: string;
  altOriginal: string;
  altRemoved: string;
  aspectRatioClass: string;
  width: number;
  height: number;
  description: string;
  metaTags: string[];
  initialDelay?: number;
}

export default function WatermarkProofCard({
  sampleNumber,
  modelBadge,
  title,
  categoryBadgeClass = "bg-primary/15 text-primary border-primary/25",
  originalSrc,
  removedSrc,
  altOriginal,
  altRemoved,
  aspectRatioClass,
  width,
  height,
  description,
  metaTags,
  initialDelay = 0,
}: WatermarkProofCardProps) {
  // slider position in percentage:
  // 0 = 100% Original (with Gemini Logo) — logo lives in the bottom-right
  // 50 = Split (Clean on left, Original with Logo on right)
  // 100 = 100% Watermark Removed (Clean)
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(percent));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const toggleView = () => {
    setSliderPos((prev) => (prev >= 50 ? 0 : 100));
  };

  const clipOverlay = `inset(0 ${100 - sliderPos}% 0 0)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: initialDelay }}
      className="group bg-card border border-border hover:border-primary/40 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col"
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryBadgeClass}`}
            >
              {sampleNumber}
            </span>
            <span className="text-xs text-muted-foreground">{modelBadge}</span>
          </div>
          <h3 className="font-extrabold text-foreground text-base">{title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border/60 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              sliderPos <= 15
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Show 100% original image with Gemini watermark logo"
          >
            Original (With Logo)
          </button>

          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              sliderPos > 15 && sliderPos < 85
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Split view: Clean on left, Original with logo on right"
          >
            Split 50/50
          </button>

          <button
            type="button"
            onClick={() => setSliderPos(100)}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
              sliderPos >= 85
                ? "bg-green-500/20 text-green-400 border border-green-500/40 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Show 100% watermark-erased clean output"
          >
            After Removal
          </button>

          <button
            type="button"
            onClick={toggleView}
            className="px-2 py-1 text-xs font-semibold rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-1"
            title="Quick toggle between Original and Removed"
          >
            <FaEye className="w-3 h-3" />
            <span className="hidden md:inline">Toggle</span>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-label="Before vs After comparison slider"
        aria-valuenow={sliderPos}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(0, p - 5));
          if (e.key === "ArrowRight") setSliderPos((p) => Math.min(100, p + 5));
        }}
        className={`relative ${aspectRatioClass} w-full overflow-hidden bg-muted/40 select-none cursor-ew-resize touch-none`}
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {/* Base: original WITH Gemini logo (visible on the right, where the mark actually is) */}
        <Image
          src={originalSrc}
          alt={altOriginal}
          fill
          unoptimized
          draggable={false}
          priority
          className="object-contain object-center pointer-events-none select-none"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Overlay: cleaned image, clipped from the right so the original logo stays visible */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: clipOverlay, WebkitClipPath: clipOverlay }}
        >
          <Image
            src={removedSrc}
            alt={altRemoved}
            fill
            unoptimized
            draggable={false}
            priority
            className="object-contain object-center pointer-events-none select-none"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {sliderPos > 0 && sliderPos < 100 && (
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-0 bottom-0 -left-[1px] w-[2px] bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/90 backdrop-blur-md border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs">
              <FaArrowsAltH className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {sliderPos > 8 && (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/85 backdrop-blur-md text-green-400 border border-green-500/40 shadow-lg flex items-center gap-1.5">
              <FaCheck className="w-2.5 h-2.5 text-green-400" />
              <span>Watermark Removed (Clean)</span>
            </span>
          </div>
        )}
        {sliderPos < 92 && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/85 backdrop-blur-md text-amber-300 border border-amber-500/50 shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Original (With Gemini Logo)</span>
            </span>
          </div>
        )}

        {/* Keep badges off the bottom-right so the Gemini star stays visible */}
        {sliderPos > 20 && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-green-500/50 shadow-2xl text-xs font-semibold text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Watermark Erased</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-black/80 backdrop-blur-md text-[11px] text-white/95 px-3 py-1 rounded-full border border-white/20 shadow-lg">
            Slide right to erase watermark • Slide left to reveal original logo
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between bg-card space-y-4">
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-2">
            {metaTags.map((tag, idx) => (
              <span
                key={idx}
                className={
                  idx === metaTags.length - 1
                    ? "px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-medium"
                    : "px-2 py-1 rounded bg-muted text-muted-foreground font-mono"
                }
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="text-muted-foreground text-[11px]">100% Client-Side</span>
        </div>
      </div>
    </motion.div>
  );
}
