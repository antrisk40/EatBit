"use client";
import { downloadWithGate } from "@/lib/downloadWithGate";
import FeedbackModal from "@/components/FeedbackModal";
import { getToolFeedback, checkLimits, type ToolFeedbackSummary, type UsageLimits } from "@/lib/api";
import { trackEvent, useProcessDownloadFunnel } from "@/lib/analytics";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";
import AdBanner from "@/components/AdBanner";
import WatermarkProofCard from "@/components/WatermarkProofCard";
import {
  FaDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaMagic,
  FaShieldAlt,
  FaCheck,
  FaArrowRight,
  FaChevronDown,
  FaImage,
  FaLock,
  FaBolt,
  FaFilm,
  FaPlay,
  FaPause,
  FaTimes,
  FaPaperPlane,
  FaFileArchive,
  FaTrash,
  FaPlus,
  FaStar,
} from "react-icons/fa";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLnyGXKrgLTdkMgXnwL38DafnGxE-vhb-SzHG0gCKCl7aWrduKWGAomaiSUve4jrAY/exec";

type FileKind = "image" | "video";
type ItemStatus = "queued" | "loading" | "processing" | "done" | "error";

interface WatermarkResult {
  applied: boolean;
  skipReason: string | null;
  size: number | null;
}

interface VideoProgress {
  phase: string;
  progress: number;
  processedFrames: number | null;
  frameEstimate: number | null;
}

interface FileItem {
  id: string;
  file: File;
  name: string;
  kind: FileKind;
  status: ItemStatus;
  statusMsg: string;
  originalSrc: string | null;
  processedSrc: string | null;
  downloadUrl: string | null;
  downloadName: string;
  result: WatermarkResult | null;
  videoProgress: VideoProgress | null;
}

const FEATURES = [
  {
    icon: <FaShieldAlt className="w-6 h-6" />,
    title: "100% Private",
    desc: "Files never leave your browser. Zero uploads, zero privacy risk.",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    icon: <FaBolt className="w-6 h-6" />,
    title: "Precision Algorithm",
    desc: "Reverse Alpha Blending — mathematically exact, not AI guesswork.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: <FaFilm className="w-6 h-6" />,
    title: "Images & Videos",
    desc: "Both image and video Gemini outputs are fully supported.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: <FaLock className="w-6 h-6" />,
    title: "1 Free Download/Day",
    desc: "1 free download per day with no sign-up. Upgrade to Pro for unlimited downloads.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
];

const FAQS = [
  { q: "What file types are supported?", a: "Images: JPG, PNG, WebP. Videos: MP4, WebM, MOV — the same formats Gemini uses when generating media." },
  { q: "Is my file uploaded to any server?", a: "No. Everything runs locally in your browser. Your files never leave your device." },
  { q: "How does video watermark removal work?", a: "The tool processes your video frame-by-frame to smoothly erase the watermark entirely in your browser, without needing to upload the file anywhere." },
  { q: "Do I need to create an account or pay?", a: "No account is needed. You get 1 free download per day without signing in — no credit card, no sign-up. If you need more, creating a free account gives you 3 downloads per day. Upgrade to EatBit Pro for unlimited downloads and bulk processing." },
  { q: "What if the watermark isn't fully removed?", a: "Our tool handles all standard Gemini outputs. In rare edge cases, use the feedback form below the result to let us know." },
  { q: "Does this remove the SynthID invisible watermark?", a: "No. SynthID is Google DeepMind's cryptographic provenance watermark embedded in the pixel data at a level invisible to the human eye. Our tool removes only the visible Gemini overlay watermark — the semi-transparent logo you can see in the bottom-right corner. SynthID cannot be removed by any browser-based tool." },
  { q: "What is Reverse Alpha Blending and why does it matter?", a: "Alpha blending is how Gemini composites its watermark onto your image: result = foreground × alpha + background × (1 − alpha). Reverse alpha blending inverts this formula — given the composited result and known watermark pixels, we can solve for the original background with pixel-perfect accuracy. Unlike AI inpainting (which guesses), this is a mathematical reconstruction — deterministic and lossless." },
  { q: "How do I remove the Gemini logo?", a: "Simply upload your image or video directly to our tool. It automatically detects the position of the Gemini watermark and uses reverse alpha blending to smoothly remove it without uploading your files anywhere." },
  { q: "Does this Gemini watermark remover keep my data private?", a: "Yes. All processing happens entirely inside your browser (client-side). Your files are never uploaded to any server, making this the most secure and private way to erase Gemini watermarks." },
  { q: "How do I remove the Gemini watermark from a video?", a: "Upload your Gemini-generated video (MP4, WebM, or MOV) directly to this tool. It will automatically detect the Gemini logo watermark, process every frame using Reverse Alpha Blending inside your browser, and let you download a clean MP4 — all without uploading your file to any server." },
  { q: "Is there a free Gemini video watermark remover with no sign-up?", a: "Yes — this tool is completely free and requires no account or sign-up. Just open the page, drop your Gemini video onto the upload area, and download the watermark-free version in minutes. You get 1 free download per day without signing in. Create a free account for 3 downloads/day, or upgrade to Pro for unlimited." },
  { q: "Does removing the Gemini watermark work on MP4 video files?", a: "Yes. MP4 is the primary supported video format. WebM and MOV are also supported. The tool decodes your video frame-by-frame using the Canvas API, applies Reverse Alpha Blending to each frame to erase the Gemini logo, then remuxes the clean frames back into a downloadable MP4 file — all in your browser." },
  { q: "Can I remove the Gemini watermark from a video online without downloading any software?", a: "Yes. This is a 100% browser-based tool — no downloads, no installations, no extensions required. Open the page in any modern browser (Chrome, Safari, Firefox, Edge), upload your video, and the watermark removal happens entirely online inside your browser tab." },
  { q: "Why does my Google Gemini video have a watermark, and can it be removed?", a: "Google Gemini adds a visible semi-transparent logo watermark to the bottom-right corner of every image and video it generates. This is a visual brand mark, not a cryptographic watermark. Our tool removes this visible overlay using a mathematical algorithm (Reverse Alpha Blending) that reconstructs the original pixels beneath the logo — completely free, with no sign-up and no uploads." },
];

const USE_CASES = [
  { emoji: "📱", title: "Social Media Creators", desc: "Remove the Gemini logo before posting AI-generated thumbnails, reels covers, and carousel images to Instagram, X, or YouTube." },
  { emoji: "🎬", title: "Video Editors", desc: "Clean up Gemini-generated B-roll or stock-style clips before adding them to your edit — without the visible AI watermark breaking the shot." },
  { emoji: "🏢", title: "Businesses & Marketers", desc: "Use Gemini-generated visuals in professional presentations, ad creatives, or brand collateral without the watermark distracting from your message." },
  { emoji: "🎨", title: "Designers", desc: "Generate concept art or mood board images with Gemini, then remove the overlay before sharing with clients or incorporating into mockups." },
  { emoji: "📚", title: "Educators & Students", desc: "Create clean AI illustrations for course materials, presentations, or research papers — without the Gemini watermark appearing in your documents." },
  { emoji: "💻", title: "Developers & Indie Hackers", desc: "Quickly generate placeholder art, app icons, or hero images with Gemini and remove the overlay before shipping your product or side project." },
];

function getFileKind(file: File): FileKind | null {
  if (file.type.match(/image\/(jpeg|png|webp)/i)) return "image";
  if (file.type.match(/video\/(mp4|webm|quicktime)/i)) return "video";
  return null;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}



interface FileItemCardProps {
  item: FileItem;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

function FileItemCard({ item, onRemove, onDownload }: FileItemCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const origVideoRef = useRef<HTMLVideoElement>(null);
  const procVideoRef = useRef<HTMLVideoElement>(null);
  const [sliderX, setSliderX] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoProgressPct = item.videoProgress
    ? Math.round(item.videoProgress.phase === "detect" ? item.videoProgress.progress * 12 : 12 + item.videoProgress.progress * 88)
    : 0;

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingSlider || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      setSliderX(Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100));
    };
    const onUp = () => setIsDraggingSlider(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove as EventListener);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDraggingSlider]);

  const togglePlay = () => {
    const orig = origVideoRef.current;
    const proc = procVideoRef.current;
    if (!orig) return;
    if (orig.paused) { orig.play(); proc?.play(); setIsPlaying(true); }
    else { orig.pause(); proc?.pause(); setIsPlaying(false); }
  };

  const isProcessing = item.status === "loading" || item.status === "processing";

  const statusBar: Record<ItemStatus, string> = {
    queued: "border-border bg-muted/40 text-muted-foreground",
    loading: "border-primary/30 bg-primary/5 text-primary",
    processing: "border-primary/30 bg-primary/5 text-primary",
    done: "border-green-500/30 bg-green-500/5 text-green-400",
    error: "border-red-500/30 bg-red-500/5 text-red-400",
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-border text-sm font-medium ${statusBar[item.status]}`}>
        {isProcessing ? <FaSpinner className="animate-spin shrink-0" />
          : item.status === "done" ? <FaCheckCircle className="shrink-0" />
          : item.status === "error" ? <FaExclamationTriangle className="shrink-0" />
          : <FaSpinner className="shrink-0 opacity-20" />}
        <span className="flex-1 truncate text-xs font-bold" title={item.name}>{item.name}</span>
        <span className="text-xs opacity-60 shrink-0 capitalize">{item.status}</span>
        {(item.status === "queued" || item.status === "error") && (
          <button onClick={() => onRemove(item.id)} data-ga-event="click" data-ga-label="remove_file" className="ml-2 text-muted-foreground hover:text-red-400 transition-colors shrink-0" aria-label={`Remove ${item.name}`}>
            <FaTrash className="w-3 h-3" />
          </button>
        )}
      </div>

      {item.statusMsg && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/50">{item.statusMsg}</div>
      )}

      {/* Video progress bar */}
      {item.kind === "video" && isProcessing && item.videoProgress && (
        <div className="px-4 py-3 border-b border-border/50 space-y-1.5">
          <div className="w-full bg-muted h-1.5 overflow-hidden rounded-full">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: `${videoProgressPct}%` }} transition={{ duration: 0.4 }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{item.videoProgress.phase === "detect" ? "Detecting watermark" : "Removing watermark"}</span>
            <span>{videoProgressPct}%</span>
          </div>
        </div>
      )}

      {/* Image comparison slider — original stays on the right so the Gemini logo (bottom-right) remains visible */}
      {item.kind === "image" && item.originalSrc && (
        <div ref={containerRef} className="relative w-full overflow-hidden select-none border-b border-border" style={{ aspectRatio: "16/9", background: "#111" }}>
          <img src={item.originalSrc} alt="Original with watermark" className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" draggable={false} />
          {item.processedSrc && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)`, WebkitClipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
            >
              <img src={item.processedSrc} alt="Watermark removed" className="absolute inset-0 w-full h-full max-w-none object-contain pointer-events-none select-none" draggable={false} />
            </div>
          )}
          {item.processedSrc && (
            <div className="absolute top-0 bottom-0 z-10 flex flex-col items-center cursor-col-resize" style={{ left: `${sliderX}%`, transform: "translateX(-50%)" }}
              onMouseDown={(e) => { e.preventDefault(); setIsDraggingSlider(true); }}
              onTouchStart={() => setIsDraggingSlider(true)}
              role="slider" aria-label="Comparison slider" aria-valuenow={Math.round(sliderX)}>
              <div className="w-0.5 h-full bg-white/80 shadow-[0_0_12px_rgba(0,0,0,0.8)]" />
              <div className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-primary">
                <svg width="18" height="10" viewBox="0 0 20 12" fill="none">
                  <path d="M6 6L1 1M6 6L1 11" stroke="#EA8C32" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 6L19 1M14 6L19 11" stroke="#EA8C32" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          )}
          {item.processedSrc && <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] px-2 py-0.5 font-bold">AFTER</div>}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 font-bold">BEFORE</div>
          {isProcessing && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Video side-by-side */}
      {item.kind === "video" && item.originalSrc && (
        <div className="border-b border-border">
          <div className="grid grid-cols-2">
            <div className="relative border-r border-border overflow-hidden bg-black">
              <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 font-bold z-10">BEFORE</div>
              <video ref={origVideoRef} src={item.originalSrc} className="w-full aspect-video object-contain" muted loop playsInline />
            </div>
            <div className="relative overflow-hidden bg-black">
              <div className={`absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0.5 font-bold z-10 ${item.processedSrc ? "bg-primary/90 text-white" : "bg-black/70 text-white"}`}>
                {item.processedSrc ? "AFTER" : isProcessing ? "Processing…" : "Pending"}
              </div>
              {item.processedSrc
                ? <video ref={procVideoRef} src={item.processedSrc} className="w-full aspect-video object-contain" muted loop playsInline />
                : <div className="w-full aspect-video flex items-center justify-center">
                    {isProcessing && <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />}
                  </div>}
            </div>
          </div>
          {item.processedSrc && (
            <div className="flex justify-center py-2 border-t border-border/50">
              <button onClick={togglePlay} data-ga-event="click" data-ga-label="play_compare" className="flex items-center gap-2 px-4 py-1.5 border border-border bg-background text-foreground text-xs font-bold hover:border-primary/50 transition-all">
                {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"} Both
              </button>
            </div>
          )}
        </div>
      )}

      {/* Download row */}
      {item.status === "done" && (
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <button onClick={() => onDownload(item.id)} id={`download-btn-${item.id}`}
            data-ga-event="click" data-ga-label="download_file"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
            <FaDownload /> {item.kind === "image" ? "Download Image" : "Download Video"}
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent("eatbit:ask-feedback"))}
            data-ga-event="click" data-ga-label="give_feedback"
            className="flex items-center gap-2 px-4 py-2 border border-border bg-background text-foreground font-bold text-xs hover:border-primary/50 transition-all hover:scale-105">
            <FaStar className="text-yellow-400" /> Give Feedback
          </button>
          {item.result && item.kind === "image" && (
            <span className="text-xs text-muted-foreground">
              {item.result.applied ? "✓ Watermark removed" : "No watermark detected"}
              {item.result.size ? ` · ${item.result.size}px` : ""}
            </span>
          )}
          <span className="ml-auto text-xs text-muted-foreground truncate max-w-[200px]" title={item.downloadName}>{item.downloadName}</span>
        </div>
      )}
    </motion.div>
  );
}
// ── Ratings Section ──────────────────────────────────────────────────────────

function StarBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <FaStar
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(value) ? "text-yellow-400" : "text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function RatingsSection({ data }: { data: ToolFeedbackSummary }) {
  const { average, total, distribution, reviews } = data;
  const displayReviews = reviews.filter((r) => r.message && r.message.trim().length > 10).slice(0, 6);

  return (
    <section className="bg-background py-16 border-b border-border" id="reviews">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-extrabold text-foreground mb-8">
            User <span className="text-primary">Reviews</span>
          </h2>

          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row gap-8 p-6 border border-border bg-card mb-8">
            {/* Big score */}
            <div className="flex flex-col items-center justify-center shrink-0 gap-1 min-w-[100px]">
              <span className="text-5xl font-extrabold text-foreground tabular-nums">
                {average.toFixed(1)}
              </span>
              <StarBar value={average} />
              <span className="text-xs text-muted-foreground mt-1">{total.toLocaleString()} review{total !== 1 ? "s" : ""}</span>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[String(star)] ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-3 shrink-0 text-right">{star}</span>
                    <FaStar className="w-3 h-3 text-yellow-400 shrink-0" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: (5 - star) * 0.07 }}
                      />
                    </div>
                    <span className="w-6 text-right shrink-0">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual reviews */}
          {displayReviews.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-border bg-card p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {review.name ? review.name[0].toUpperCase() : "?"}
                      </div>
                      <span className="text-sm font-semibold text-foreground truncate">
                        {review.name ?? "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StarBar value={review.rating} />
                      <span className="text-[10px] text-muted-foreground">{timeAgo(review.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{review.message}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GeminiWatermarkRemoverPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef = useRef<any>(null);

  const [queue, setQueue] = useState<FileItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [ratings, setRatings] = useState<ToolFeedbackSummary | null>(null);
  const [dailyLimits, setDailyLimits] = useState<UsageLimits | null>(null);
  const { markDownloaded, flushSkips } = useProcessDownloadFunnel(queue);

  // Fetch published reviews for this tool
  useEffect(() => {
    getToolFeedback("gemini-watermark-remover").then((data) => {
      if (data && data.total > 0) setRatings(data);
    });
    checkLimits().then(setDailyLimits).catch(() => {});
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import("@pilio/gemini-watermark-remover/browser").then((mod: any) => {
      mod.createWatermarkEngine().then((eng: unknown) => { engineRef.current = eng; });
    });
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<FileItem>) => {
    setQueue((prev) => prev.map((it) => it.id === id ? { ...it, ...patch } : it));
  }, []);

  const processImageItem = useCallback(async (item: FileItem) => {
    const { id, file } = item;
    updateItem(id, { status: "loading", statusMsg: "Reading image…" });
    const origUrl = URL.createObjectURL(file);
    updateItem(id, { originalSrc: origUrl });
    const img = new window.Image();
    img.src = origUrl;
    await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("Failed to load image")); });
    try {
      updateItem(id, { status: "processing", statusMsg: "Removing watermark…" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod = await import("@pilio/gemini-watermark-remover/browser") as any;
      const engine = engineRef.current ?? (await mod.createWatermarkEngine());
      if (!engineRef.current) engineRef.current = engine;
      const resultCanvas = await engine.removeWatermarkFromImage(img, { adaptiveMode: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = (resultCanvas as any).__watermarkMeta;
      const processedBlob: Blob = await new Promise((res, rej) => {
        if (resultCanvas.convertToBlob) { resultCanvas.convertToBlob({ type: "image/webp", quality: 0.95 }).then(res).catch(rej); }
        else if (resultCanvas.toBlob) { resultCanvas.toBlob((b: Blob | null) => (b ? res(b) : rej(new Error("Blob failed"))), "image/webp", 0.95); }
        else { rej(new Error("No blob conversion method available")); }
      });
      const procUrl = URL.createObjectURL(processedBlob);
      const downloadName = `watermark-removed-${file.name.replace(/\.[^.]+$/, "")}.webp`;
      updateItem(id, { status: "done", processedSrc: procUrl, downloadUrl: procUrl, downloadName, result: { applied: meta?.applied ?? false, skipReason: meta?.skipReason ?? null, size: meta?.size ?? null }, statusMsg: meta?.applied ? "✓ Watermark removed successfully" : "No removable watermark detected — original preserved" });
      trackEvent("tool_process_complete", { file_kind: "image", watermark_applied: meta?.applied ?? false });
    } catch (err) {
      console.error(err);
      updateItem(id, { status: "error", statusMsg: "Processing failed. Please try another image." });
      trackEvent("tool_process_fail", { file_kind: "image" });
    }
  }, [updateItem]);

  const processVideoItem = useCallback(async (item: FileItem) => {
    const { id, file } = item;
    updateItem(id, { status: "loading", statusMsg: "Loading video…" });
    const origUrl = URL.createObjectURL(file);
    updateItem(id, { originalSrc: origUrl });
    try {
      updateItem(id, { status: "processing", statusMsg: "Processing video…" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videoMod = await import("@/lib/gwr-video/videoExport.js") as any;
      const res = await videoMod.removeGeminiVideoWatermark(file, {
        allowLowConfidence: true,
        yieldToMainThread: () => new Promise<void>((r) => { typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => setTimeout(r, 0)) : setTimeout(r, 0); }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onProgress: (info: any) => {
          const { phase, progress, processedFrames, frameEstimate, metadata, detection } = info;
          // Debug: log detection results so we can see resolution + candidate chosen
          if (phase === 'detect' && detection) {
            console.group('[GWR Debug] Detection result');
            console.log('Video resolution:', metadata?.width, 'x', metadata?.height);
            console.log('isConfident:', detection.isConfident);
            console.log('Best candidate:', detection.summary?.best);
            console.log('All candidates:', detection.summary?.candidates);
            console.log('Position:', detection.position);
            console.groupEnd();
          }
          updateItem(id, { videoProgress: { phase, progress, processedFrames, frameEstimate } });
        },
      });
      const procUrl = URL.createObjectURL(res.blob);
      const downloadName = `watermark-removed-${file.name.replace(/\.[^.]+$/, "")}.mp4`;
      updateItem(id, { status: "done", processedSrc: procUrl, downloadUrl: procUrl, downloadName, statusMsg: `✓ Done — ${res.processedFrames ?? "?"} frames processed`, videoProgress: null });
      trackEvent("tool_process_complete", { file_kind: "video" });
    } catch (err: unknown) {
      console.error(err);
      // Translate library error messages (originally in Chinese) to user-friendly English
      const raw = err instanceof Error ? err.message : String(err);
      const friendly = raw.includes("WebCodecs") || raw.includes("H.264") || raw.includes("AVC") || raw.includes("编码")
        ? "Your browser doesn't support video encoding. Please use a recent version of Chrome or Edge."
        : raw.includes("置信") || raw.includes("confidence") || raw.includes("isConfident")
        ? "Watermark not detected in this video. Make sure it's a Gemini-generated video with the visible logo."
        : raw.includes("Canvas") || raw.includes("canvas")
        ? "Could not create canvas for video processing. Please try refreshing the page."
        : "Video processing failed. Please try a different file or browser.";
      updateItem(id, { status: "error", statusMsg: friendly });
      trackEvent("tool_process_fail", { file_kind: "video" });
    }
  }, [updateItem]);

  // Sequential processor — picks next queued item
  useEffect(() => {
    if (activeItemId) return;
    const next = queue.find((it) => it.status === "queued");
    if (!next) return;
    setActiveItemId(next.id);
    const run = next.kind === "image" ? processImageItem : processVideoItem;
    
    import("@/lib/api").then(({ recordDownload }) => {
      recordDownload().then((res) => {
        if (!res.allowed) {
          updateItem(next.id, { status: "error", statusMsg: "Limit reached. Please login to continue processing." });
          setActiveItemId(null);
          trackEvent("limit_hit", { gate: res.code === "signup_required" ? "login" : "upgrade", action: "process" });
          if (res.code === "signup_required") {
            window.dispatchEvent(new CustomEvent("eatbit:open-login"));
          } else {
            window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
          }
          return;
        }
        trackEvent("tool_process_start", { file_kind: next.kind, file_size_bytes: next.file.size });
        const start = Date.now();
        run(next).finally(() => {
          setActiveItemId(null);
          import("@/lib/api").then(({ trackUsage }) => {
            trackUsage({
              tool: window.location.pathname.split('/').pop() || "unknown",
              file_name: next.name,
              file_type: next.kind || "image",
              file_size_bytes: next.file.size,
              processing_ms: Date.now() - start
            });
          }).catch(() => {});
        });
      });
    });
  }, [queue, activeItemId, processImageItem, processVideoItem, updateItem]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const { checkLimits } = await import("@/lib/api");
    const limits = await checkLimits();
    
    let arr = Array.from(files);
    
    if (!limits.downloads.unlimited) {
      if (limits.downloads.remaining <= 0) {
        trackEvent("limit_hit", { gate: limits.tier === "anonymous" ? "login" : "upgrade", action: "upload" });
        if (limits.tier === "anonymous") {
          window.dispatchEvent(new CustomEvent("eatbit:open-login", { detail: { title: "Please Login", subtitle: "to continue for free" } }));
        } else {
          window.dispatchEvent(new CustomEvent("eatbit:open-upgrade", { detail: { title: "Upgrade Required", subtitle: "A Premium plan is needed to process multiple files simultaneously." } }));
        }
        return;
      }
      
      const totalRequested = queue.length + arr.length;
      if (totalRequested > limits.downloads.remaining) {
        trackEvent("limit_hit", { gate: limits.tier === "anonymous" ? "login" : "upgrade", action: "upload" });
        if (limits.tier === "anonymous") {
          window.dispatchEvent(new CustomEvent("eatbit:open-login", { detail: { title: "Limit reached!", subtitle: `You can only process ${limits.downloads.remaining} file(s) for free. Please login to continue.` } }));
        } else {
          window.dispatchEvent(new CustomEvent("eatbit:open-upgrade", { detail: { title: "Upgrade Required", subtitle: "A Premium plan is needed to process multiple files simultaneously." } }));
        }
        return;
      }
    }

    const newItems: FileItem[] = [];
    for (const file of arr) {
      const kind = getFileKind(file);
      if (!kind) continue;
      if (kind === "image" && file.size > 20 * 1024 * 1024) continue;
      newItems.push({
        id: makeId(),
        file,
        name: file.name,
        kind,
        status: "queued",
        statusMsg: "",
        originalSrc: null,
        processedSrc: null,
        downloadUrl: null,
        downloadName: `watermark-removed-${file.name.replace(/\.[^.]+$/, "")}${kind === "image" ? ".webp" : ".mp4"}`,
        result: null,
        videoProgress: null,
      });
    }
    if (newItems.length > 0) {
      trackEvent("tool_upload", { file_count: newItems.length, file_kinds: newItems.map((it) => it.kind).join(",") });
      setQueue((prev) => [...prev, ...newItems]);
    }
  }, [queue]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = useCallback((id: string) => {
    flushSkips("remove_file", [id]);
    setQueue((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item?.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
      if (item?.originalSrc) URL.revokeObjectURL(item.originalSrc);
      return prev.filter((it) => it.id !== id);
    });
  }, [flushSkips]);

  const handleClearAll = () => {
    flushSkips("clear_queue");
    queue.forEach((it) => {
      if (it.downloadUrl) URL.revokeObjectURL(it.downloadUrl);
      if (it.originalSrc) URL.revokeObjectURL(it.originalSrc);
    });
    setQueue([]);
    setActiveItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = useCallback(async (id: string) => {
    const item = queue.find((it) => it.id === id);
    if (!item || !item.downloadUrl) return;
    const res = await downloadWithGate(item.downloadUrl, item.downloadName, true, {
      download_type: "single",
      file_kind: item.kind,
    });
    if (res !== false) {
      markDownloaded(id);
      checkLimits().then(setDailyLimits).catch(() => {});
      setShowFeedback(true);
    }
  }, [queue, markDownloaded]);

  const handleDownloadZip = async () => {
    const doneItems = queue.filter((it) => it.status === "done" && it.downloadUrl);
    if (doneItems.length === 0) return;
    setIsZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const item of doneItems) {
        const resp = await fetch(item.downloadUrl!);
        const blob = await resp.blob();
        zip.file(item.downloadName, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const ok = await downloadWithGate(
        URL.createObjectURL(zipBlob),
        "watermark-removed-files.zip",
        true,
        { download_type: "bulk_zip", file_count: doneItems.length }
      );
      if (ok !== false) {
        markDownloaded("all");
        checkLimits().then(setDailyLimits).catch(() => {});
      }
    } finally {
      setIsZipping(false);
    }
  };

  const doneCount = queue.filter((it) => it.status === "done").length;
  const allDone = queue.length > 0 && queue.every((it) => it.status === "done" || it.status === "error");
  const isAnyProcessing = !!activeItemId;

  return (
    <>
      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )}
      </AnimatePresence>



      {/* Floating processing indicator */}
      <AnimatePresence>
        {isAnyProcessing && (() => {
          const active = queue.find((it) => it.id === activeItemId);
          return (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
              <div className="bg-card border border-border px-5 py-3 shadow-2xl flex items-center gap-3 rounded-xl">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Processing…</p>
                  {active && <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{active.name}</p>}
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Gemini Watermark Remover", applicationCategory: "MultimediaApplication", operatingSystem: "Any", browserRequirements: "Requires a modern browser with JavaScript enabled", url: "https://eatbit.in/tools/gemini-watermark-remover", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free browser tool to remove visible Google Gemini AI watermarks from images and videos. Supports batch/multi-file processing with ZIP download. No signup, no upload.", featureList: ["Remove visible Gemini watermark from images", "Remove visible Gemini watermark from videos", "Batch multi-file processing", "Download all as ZIP", "Reverse alpha blending algorithm", "100% local browser processing", "No account required", "Supports JPG, PNG, WebP, MP4, WebM, MOV"], screenshot: "https://eatbit.in/og-gemini-watermark-remover.png", softwareVersion: "2.0", creator: { "@type": "Organization", name: "EatBit", url: "https://eatbit.in" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) }) }} />

      {/* HERO + TOOL — merged into one 2-col layout so sidebar is visible from the top */}
      <section className="relative overflow-hidden bg-card border-b border-border" id="tool">
        {/* Background dot pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.06] bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 min-w-0 space-y-6">

              {/* Hero content */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border font-bold text-[10px] mb-5 uppercase tracking-wider text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  1 Free Download/Day · No Signup · Images &amp; Videos · Batch + ZIP Download
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                  <span className="text-primary">Gemini</span> Watermark <span className="text-foreground">Remover</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-5">
                  Remove <strong className="text-foreground">visible Gemini AI watermarks</strong> from images and videos directly in your browser. Process multiple files at once and download them all as a ZIP.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-5">
                  {["Images & Videos", "Batch Upload", "Download as ZIP", "100% Private", "No Sign-up"].map((b) => (
                    <span key={b} className="flex items-center gap-1.5"><FaCheck className="text-primary w-3 h-3" /> {b}</span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 text-xs text-muted-foreground">
                  <span className="text-primary font-bold">✓ Free:</span> 1 download/day without signing in &nbsp;·&nbsp;
                  <span className="text-primary font-bold">Sign in free</span> for 3/day &nbsp;·&nbsp;
                  <Link href="/plans" className="text-primary font-bold underline underline-offset-2 hover:opacity-80" data-ga-event="click" data-ga-label="upgrade_pro">Pro</Link> for unlimited
                </div>
              </motion.div>

              {/* Upload zone — always visible */}
              <div
                className={`relative border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => { trackEvent("click", { event_label: "upload_box" }); fileInputRef.current?.click(); }}
              >
                <input ref={fileInputRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)} id="watermark-file-input" aria-label="Upload Gemini images or videos to remove watermarks" />
                <motion.div animate={{ y: isDragging ? -8 : 0 }} className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"><FaImage className="w-5 h-5 text-primary" /></div>
                    <div className="w-14 h-14 rounded-full bg-blue-400/10 border border-blue-400/20 flex items-center justify-center"><FaFilm className="w-5 h-5 text-blue-400" /></div>
                    <div className="w-14 h-14 rounded-full bg-purple-400/10 border border-purple-400/20 flex items-center justify-center"><FaPlus className="w-5 h-5 text-purple-400" /></div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground mb-1">{queue.length > 0 ? "Drop more files or click to add" : "Drop your Gemini files here"}</p>
                    <p className="text-muted-foreground text-sm">or <span className="text-primary font-semibold underline underline-offset-4">click to browse</span> &mdash; <span className="font-semibold">multiple files supported</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                    {["JPG", "PNG", "WebP", "MP4", "WebM", "MOV"].map((fmt) => (
                      <span key={fmt} className="px-2 py-0.5 border border-border bg-muted font-mono font-bold">{fmt}</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-primary mt-1">
                    {dailyLimits?.downloads.unlimited
                      ? "Unlimited downloads on Pro"
                      : `1 free download per day${dailyLimits ? ` · ${dailyLimits.downloads.remaining} left today` : " · no sign-up"}`}
                  </p>
                </motion.div>
              </div>

              <p className="text-center text-xs text-muted-foreground -mt-2">
                You can also <kbd className="px-1.5 py-0.5 border border-border rounded text-[10px] font-mono">Ctrl+V</kbd> to paste an image directly
              </p>

              {/* Queue */}
              <AnimatePresence>
                {queue.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    {/* Queue header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h2 className="font-bold text-foreground text-sm">Files ({queue.length})</h2>
                        <span className="text-xs text-muted-foreground">{doneCount} / {queue.length} done</span>
                        {isAnyProcessing && (
                          <span className="flex items-center gap-1 text-xs text-primary">
                            <FaSpinner className="animate-spin w-3 h-3" /> Processing…
                          </span>
                        )}
                      </div>
                      <button onClick={handleClearAll} data-ga-event="click" data-ga-label="clear_queue" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors font-bold">
                        <FaTrash className="w-3 h-3" /> Clear All
                      </button>
                    </div>

                    {/* File cards */}
                    <div className="space-y-4">
                      <AnimatePresence>
                        {queue.map((item) => (
                          <FileItemCard key={item.id} item={item} onRemove={handleRemove} onDownload={handleDownload} />
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Download All as ZIP */}
                    <AnimatePresence>
                      {allDone && doneCount > 0 && (
                        <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
                          className="relative overflow-hidden border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/15 blur-3xl rounded-full pointer-events-none" />
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 text-center sm:text-left">
                              <p className="font-extrabold text-foreground text-base mb-1">
                                🎉 All {doneCount} file{doneCount !== 1 ? "s" : ""} processed!
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Download all watermark-removed files in a single ZIP archive. Original filenames are preserved inside.
                              </p>
                            </div>
                            <button onClick={handleDownloadZip} disabled={isZipping} id="download-zip-btn"
                              data-ga-event="click" data-ga-label="download_zip"
                              className="flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-xl shadow-primary/25 disabled:opacity-60 disabled:scale-100 shrink-0">
                              {isZipping ? <FaSpinner className="animate-spin" /> : <FaFileArchive />}
                              {isZipping ? "Creating ZIP…" : "Download All as ZIP"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-80 shrink-0 self-start"><OtherToolsSidebar /></div>
          </div>
        </div>
      </section>

      {/* RATINGS — only rendered when reviews exist */}
      {ratings && <RatingsSection data={ratings} />}

      {/* PROOF OF QUALITY — REAL CLEANED RESULTS */}
      <section className="bg-background py-20 border-b border-border" id="proof">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4">
              <FaCheckCircle className="w-3.5 h-3.5" />
              <span>Verified Output Proof</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              Proof: <span className="text-primary">Real Watermark Removal Results</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto leading-relaxed">
              Examine the raw output from our Reverse Alpha Blending engine on real Google Gemini generations.
              Notice the bottom-right corner where the Gemini logo was located — no blurring, no AI smudges, and 100% original pixel sharpness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Proof Card 1: 3D Cartoon */}
            <WatermarkProofCard
              sampleNumber="Sample 01 · Digital Art"
              modelBadge="Gemini 2.0 / Imagen 3"
              title="Vibrant 3D Cartoon Forest Illustration"
              categoryBadgeClass="bg-primary/15 text-primary border-primary/25"
              originalSrc="/assets/gemini-watermark-remover/watermark-original-cartoon.webp"
              removedSrc="/assets/gemini-watermark-remover/watermark-removed-cartoon.webp"
              altOriginal="Original Google Gemini 3D cartoon forest illustration with visible star watermark in the bottom right corner"
              altRemoved="Google Gemini watermark cleanly removed from 3D cartoon forest illustration with squirrel and bear using EatBit Reverse Alpha Blending proof"
              aspectRatioClass="aspect-[1024/572]"
              width={1024}
              height={572}
              description="The Google Gemini star logo in the lower-right corner was completely inverted and restored. Delicate foliage textures, ground moss, and illuminated sparkle particles are preserved without any smearing or AI inpainting artifacts."
              metaTags={[
                "1024 × 572 px",
                "Lossless Alpha Inversion",
                "Zero Residual Blur",
              ]}
              initialDelay={0}
            />

            {/* Proof Card 2: Photorealistic Students */}
            <WatermarkProofCard
              sampleNumber="Sample 02 · Photorealism"
              modelBadge="Imagen 3 Photorealistic"
              title="University Students Studying on Campus"
              categoryBadgeClass="bg-blue-500/15 text-blue-400 border-blue-500/25"
              originalSrc="/assets/gemini-watermark-remover/watermark-original-students.webp"
              removedSrc="/assets/gemini-watermark-remover/watermark-removed-students.webp"
              altOriginal="Original Google Gemini photorealistic photo of university students studying on lawn with star watermark in bottom right corner"
              altRemoved="Google Gemini watermark removed from photorealistic AI photo of university students studying on lawn using EatBit precision watermark eraser"
              aspectRatioClass="aspect-[1024/687]"
              width={1024}
              height={687}
              description="Real photographic grain, complex blades of grass, and denim jean fabric fibers directly beneath where the semi-transparent Gemini overlay sat are mathematically restored without blurry patches or edge discoloration."
              metaTags={[
                "1024 × 687 px",
                "Texture Preserved",
                "Natural Grain Retained",
              ]}
              initialDelay={0.1}
            />
          </div>

          {/* Trust Banner beneath the proof cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                <FaBolt className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Want to verify on your own Gemini files?</h4>
                <p className="text-xs text-muted-foreground">Upload any image or video above to test the mathematical removal on your own media instantly.</p>
              </div>
            </div>
            <a
              href="#tool"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shrink-0 shadow-md shadow-primary/20"
            >
              <span>Test Your Own Image</span>
              <FaArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* WHAT THIS TOOL REMOVES */}
      <section className="bg-card py-20 border-b border-border" id="what-it-removes">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">What This Tool <span className="text-primary">Removes</span></h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-10">There are two very different types of Gemini watermarks. It&#39;s important to know the distinction.</p>
            <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-border/50">
              <Image src="/cartoon_watermark.jpg" alt="Cartoon Watermark Remover Illustration" width={1000} height={562} className="w-full h-auto" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border border-green-500/30 bg-green-500/5 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0"><FaCheck className="text-green-400 w-4 h-4" /></div>
                <h3 className="font-extrabold text-foreground text-lg">Visible Gemini Watermark</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">The semi-transparent Google Gemini logo overlaid in the bottom-right corner of every image and video Gemini generates. This is a visible, alpha-composited overlay.</p>
              <ul className="space-y-2 text-sm">
                {["Bottom-right corner overlay", "Semi-transparent Gemini logo", "Present on all generated images & videos", "Removed via Reverse Alpha Blending"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-green-400"><FaCheck className="w-3 h-3 shrink-0" /><span className="text-muted-foreground">{item}</span></li>
                ))}
              </ul>
              <div className="mt-5 px-3 py-2 bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-bold">✓ This tool removes this watermark</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="border border-red-500/30 bg-red-500/5 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0"><FaExclamationTriangle className="text-red-400 w-4 h-4" /></div>
                <h3 className="font-extrabold text-foreground text-lg">SynthID (Invisible Watermark)</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">Google DeepMind&#39;s cryptographic provenance technology. SynthID embeds imperceptible signals directly into the pixel data — invisible to humans, detectable only by Google&#39;s servers.</p>
              <ul className="space-y-2 text-sm">
                {["Invisible to the human eye", "Embedded in pixel-level data", "Survives screenshots & re-saves", "Cannot be removed by any browser tool"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-red-400"><FaTimes className="w-3 h-3 shrink-0" /><span className="text-muted-foreground">{item}</span></li>
                ))}
              </ul>
              <div className="mt-5 px-3 py-2 bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold">✗ SynthID cannot be removed by any browser-based tool</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Why Use This <span className="text-primary">Tool</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${f.bg}`}>
                <div className={`mb-4 ${f.color}`}>{f.icon}</div>
                <h3 className="font-bold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card py-20 border-b border-border" id="how-it-works">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">How the Algorithm <span className="text-primary">Works</span></h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">We use mathematical reconstruction, not AI guesswork. Here&apos;s exactly what happens when you drop a file.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-primary/30 bg-primary/5 p-8 mb-8">
            <h3 className="font-extrabold text-foreground text-base mb-4 flex items-center gap-2"><span className="text-primary">∑</span> The Math: Reverse Alpha Blending</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">Alpha compositing is how Gemini overlays its watermark. Given a watermark pixel <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">W</code>, an alpha value <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">α</code>, and the original background <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">B</code>, the composited result <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">C</code> is:</p>
            <div className="font-mono text-sm text-center py-4 px-6 bg-muted border border-border rounded mb-4 text-foreground">C = W × α + B × (1 − α)</div>
            <p className="text-muted-foreground text-sm leading-relaxed">By knowing <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">C</code> (the image you downloaded), <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">W</code> (the known Gemini watermark pixels), and estimating <code className="text-primary font-mono text-xs bg-muted px-1.5 py-0.5 rounded">α</code>, we can solve for the original background exactly: <span className="text-foreground font-semibold">B = (C − W × α) / (1 − α)</span>. This is deterministic and pixel-perfect — not an approximation.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: "🖼 Images", color: "border-primary/40 bg-primary/5", steps: ["Upload JPG, PNG, or WebP", "Watermark region detected via spatial sampling", "Per-pixel alpha estimated from composited vs. watermark template", "Background reconstructed via Reverse Alpha Blending formula", "Multi-pass processing for edge refinement", "Download lossless PNG — zero quality loss"] },
              { label: "🎬 Videos", color: "border-blue-400/40 bg-blue-400/5", steps: ["Upload MP4, WebM, or MOV", "Sample frames decoded via Canvas API", "Watermark position and alpha estimated from sample", "Every frame processed individually in-browser", "Optional ONNX AI denoising pass (runs via WebAssembly)", "Frames remuxed into a clean MP4 — nothing uploaded"] },
            ].map((col, i) => (
              <motion.div key={col.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className={`border p-8 ${col.color}`}>
                <h3 className="font-extrabold text-foreground text-lg mb-6">{col.label}</h3>
                <ol className="space-y-4">
                  {col.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-muted border border-border text-foreground font-bold flex items-center justify-center text-xs">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h3 className="font-extrabold text-foreground text-sm mb-3 flex items-center gap-2"><FaExclamationTriangle className="text-yellow-400 w-4 h-4" /> Known Limitations</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {["Only the visible Gemini overlay is removed — SynthID cryptographic watermarks cannot be removed by any browser tool.", "Very low-alpha watermark regions (near-transparent edges) may show minor artifacts.", "Non-standard Gemini outputs or heavily compressed images may produce less precise results.", "Video processing time depends on length and resolution — large files may take several minutes in-browser."].map((lim, i) => (
                <li key={i} className="flex items-start gap-2"><span className="shrink-0 mt-0.5 text-yellow-400">•</span>{lim}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold text-foreground mb-6">Remove Google Gemini Watermarks — <span className="text-primary">Free &amp; Private</span></h2>
            <div className="text-muted-foreground space-y-4 text-sm leading-7">
              <p>When Google Gemini generates images or videos, it embeds a visible semi-transparent logo watermark in the bottom-right corner. This tool uses an open-source <strong className="text-foreground">Reverse Alpha Blending</strong> algorithm to mathematically reconstruct the original pixels beneath the watermark — not AI inpainting — for lossless, pixel-perfect results.</p>
              <p>For <strong className="text-foreground">videos</strong>, each frame is processed individually using Canvas API and an optional ONNX AI denoising model (running via WebAssembly), then remuxed back into MP4. No data ever leaves your browser tab.</p>
              <p>It&apos;s important to note: this tool targets the <strong className="text-foreground">visible Gemini overlay watermark only</strong>. It does not remove SynthID — Google DeepMind&apos;s invisible cryptographic provenance watermark, which is embedded at the pixel level and cannot be removed by any browser-based tool. Want to understand the difference in depth?{" "}<Link href="/blogs/gemini-watermark-vs-synthid" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">Read our explainer →</Link></p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FREE vs PRO COMPARISON */}
      <section className="bg-card py-20 border-b border-border" id="pricing">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Free vs <span className="text-primary">EatBit Pro</span></h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">No hidden fees. Start free — upgrade only if you need more.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 font-bold text-foreground bg-muted/40 w-1/3">Feature</th>
                  <th className="px-6 py-4 font-bold text-foreground bg-muted/40 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Visitor</span>
                      <span className="text-lg">Free</span>
                      <span className="text-xs text-muted-foreground">No sign-up</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-foreground bg-muted/40 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">Account</span>
                      <span className="text-lg">Free</span>
                      <span className="text-xs text-muted-foreground">Sign in free</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 font-bold text-primary bg-primary/10 text-center border-x border-primary/20">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs uppercase tracking-wider text-primary/70">Premium</span>
                      <span className="text-lg">Pro</span>
                      <Link href="/plans" className="text-xs text-primary underline underline-offset-2 hover:opacity-80">See plans →</Link>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Downloads per day", "1", "3", "Unlimited"],
                  ["Bulk / batch processing", "✓", "✓", "✓"],
                  ["Download as ZIP", "✓", "✓", "✓"],
                  ["Image support (JPG, PNG, WebP)", "✓", "✓", "✓"],
                  ["Video support (MP4, WebM, MOV)", "✓", "✓", "✓"],
                  ["100% in-browser (private)", "✓", "✓", "✓"],
                  ["Priority processing", "—", "—", "✓"],
                  ["Longer video support", "—", "—", "✓"],
                  ["No daily reset wait", "—", "—", "✓"],
                ].map(([feature, visitor, account, pro], i) => (
                  <tr key={feature} className={`border-b border-border/60 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <td className="px-6 py-3 text-muted-foreground font-medium">{feature}</td>
                    <td className="px-6 py-3 text-center text-muted-foreground">{visitor === "✓" ? <FaCheck className="w-3.5 h-3.5 text-green-400 mx-auto" /> : visitor === "—" ? <FaTimes className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> : visitor}</td>
                    <td className="px-6 py-3 text-center text-muted-foreground">{account === "✓" ? <FaCheck className="w-3.5 h-3.5 text-green-400 mx-auto" /> : account === "—" ? <FaTimes className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> : account}</td>
                    <td className="px-6 py-3 text-center bg-primary/5 border-x border-primary/20 font-semibold text-foreground">{pro === "✓" ? <FaCheck className="w-3.5 h-3.5 text-primary mx-auto" /> : pro === "—" ? <FaTimes className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> : <span className="text-primary">{pro}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/plans" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
              Upgrade to Pro <FaArrowRight className="w-3 h-3" />
            </Link>
            <p className="text-xs text-muted-foreground">Visitor and signed-in free tiers require no payment whatsoever.</p>
          </motion.div>
        </div>
      </section>

      {/* VERSION CHANGELOG */}
      <section className="bg-background py-16 border-b border-border" id="changelog">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="text-2xl font-extrabold text-foreground">Tool <span className="text-primary">Changelog</span></h2>
              <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1.5 font-mono">Last updated: October 2026</span>
            </div>
            <div className="space-y-4">
              {[
                { version: "v2.1", date: "Oct 2026", tag: "latest", color: "border-primary/40 bg-primary/5", tagColor: "bg-primary text-primary-foreground", items: ["Improved detection for Gemini 2.0 Flash watermark position changes", "Faster video frame processing — up to 30% speed improvement", "Fixed edge artifact on very low-alpha watermark regions"] },
                { version: "v2.0", date: "Aug 2026", tag: "major", color: "border-blue-400/40 bg-blue-400/5", tagColor: "bg-blue-400 text-white", items: ["Added batch multi-file processing with ZIP download", "Video watermark removal now supports MOV (QuickTime)", "Upgraded ONNX denoising model to v2 for cleaner edges"] },
                { version: "v1.3", date: "Jun 2026", tag: "improvement", color: "border-border bg-muted/20", tagColor: "bg-muted text-muted-foreground", items: ["Adaptive mode for handling non-standard Gemini watermark sizes", "Added before/after comparison slider for image results", "Ctrl+V paste support for quick image upload"] },
              ].map((release) => (
                <div key={release.version} className={`border p-5 ${release.color}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono font-bold text-foreground text-sm">{release.version}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${release.tagColor}`}>{release.tag}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{release.date}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {release.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <FaCheck className="w-3 h-3 text-primary shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card py-20 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border border-border overflow-hidden">
                <button onClick={() => { setActiveFaq(activeFaq === i ? null : i); trackEvent("click", { event_label: "faq", faq_index: i }); }} className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-muted/50 transition-colors" id={`faq-${i}`} aria-expanded={activeFaq === i}>
                  <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-muted-foreground"><FaChevronDown className="w-4 h-4" /></motion.span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO USES THIS TOOL */}
      <section className="bg-background py-20 border-b border-border" id="use-cases">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Who Uses This <span className="text-primary">Tool</span></h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">From content creators to enterprise teams — anyone who needs clean, watermark-free Gemini outputs.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((uc, i) => (
              <motion.div key={uc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border bg-card p-6 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
                <div className="text-3xl mb-3">{uc.emoji}</div>
                <h3 className="font-bold text-foreground text-sm mb-2">{uc.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INLINE LEAD BANNER */}
      <section className="bg-card py-12 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/15 blur-3xl rounded-full pointer-events-none" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Built by EatBit</p>
              <h3 className="text-xl font-extrabold text-foreground mb-2">Need a custom AI tool or web app?</h3>
              <p className="text-sm text-muted-foreground">We build production-grade SaaS, AI tools, and mobile apps — just like this one. Fast, affordable, and backed by real engineering.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link href="/contact-us" data-ga-event="click" data-ga-label="gwr_quote" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Get a Free Quote <FaArrowRight className="w-3 h-3" />
              </Link>
              <a href="https://wa.me/8319212779?text=Hi%2C%20I%20saw%20the%20Gemini%20Watermark%20Remover%20on%20EatBit%20and%20I%27m%20interested%20in%20custom%20software." target="_blank" rel="noopener noreferrer" data-ga-event="click" data-ga-label="gwr_whatsapp" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-green-500/40 bg-green-500/10 text-green-400 font-bold text-sm hover:bg-green-500/20 transition-colors">
                <FaMagic className="w-3 h-3" /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RELATED READING */}
      <section className="bg-card py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-extrabold text-foreground mb-6">Learn More About <span className="text-primary">Gemini Watermarks</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/blogs/how-to-remove-gemini-watermark", title: "How to Remove a Gemini Watermark", desc: "Step-by-step guide to using this tool and understanding what gets removed." },
                { href: "/blogs/gemini-watermark-explained", title: "What Is the Gemini Watermark?", desc: "Where it appears, why Google adds it, and what it looks like." },
                { href: "/blogs/gemini-watermark-vs-synthid", title: "Gemini Watermark vs SynthID", desc: "The critical distinction between the visible overlay and invisible cryptographic provenance." },
              ].map((article) => (
                <Link key={article.href} href={article.href} data-ga-event="click" data-ga-label="gwr_related_article" className="group border border-border bg-background p-5 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{article.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold">Read more <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" /></span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Need Custom <span className="text-primary">Software</span> Built?</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">EatBit builds AI tools, SaaS platforms, and production-grade web apps. Tell us what you need.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#tool" data-ga-event="click" data-ga-label="gwr_try_tool" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all"><FaMagic /> Try the Tool</a>
              <Link href="/contact-us" data-ga-event="click" data-ga-label="gwr_contact" className="inline-flex items-center gap-2 px-8 py-4 border border-border bg-background text-foreground font-bold text-sm hover:border-primary/50 transition-all group">Get in Touch <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
            </div>
          </motion.div>
        </div>
            <AdBanner slot="tool-bottom" className="mt-6" />
      </section>

      <PasteHandler onFiles={handleFiles} />
    </>
  );
}

function PasteHandler({ onFiles }: { onFiles: (files: File[]) => void }) {
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.items ?? [])
        .filter((i) => i.kind === "file")
        .map((i) => i.getAsFile())
        .filter(Boolean) as File[];
      if (files.length > 0) {
        trackEvent("tool_paste", { file_count: files.length });
        onFiles(files);
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [onFiles]);
  return null;
}
