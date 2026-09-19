"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";
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
    title: "100% Private Bulk Processing",
    desc: "Batch process unlimited files directly in your browser. Zero uploads, zero privacy risk.",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
  {
    icon: <FaBolt className="w-6 h-6" />,
    title: "Batch Precision Algorithm",
    desc: "Reverse Alpha Blending — mathematically exact, not AI guesswork.",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
  },
  {
    icon: <FaFilm className="w-6 h-6" />,
    title: "Bulk Images & Videos",
    desc: "Process hundreds of Gemini image and video outputs simultaneously.",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    icon: <FaLock className="w-6 h-6" />,
    title: "Free, No Sign-Up",
    desc: "No account, no limits, no watermarks on output. Forever free.",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
];

const FAQS = [
  { q: "What file types are supported for batch processing?", a: "You can batch process Images (JPG, PNG, WebP) and Videos (MP4, WebM, MOV) at the same time. The tool handles mixed batches seamlessly." },
  { q: "Is my file uploaded to any server?", a: "No. Everything runs locally in your browser. Your files never leave your device." },
  { q: "How does bulk video watermark removal work?", a: "The tool queues up multiple videos and processes them frame-by-frame in your browser, smoothly erasing the watermark without any uploads." },
  { q: "Do I need to create an account or pay?", a: "Absolutely not. The tool is 100% free with no signup required." },
  { q: "What if the watermark isn't fully removed?", a: "Our tool handles all standard Gemini outputs. In rare edge cases, use the feedback form below the result to let us know." },
  { q: "Does this remove the SynthID invisible watermark?", a: "No. SynthID is Google DeepMind's cryptographic provenance watermark embedded in the pixel data at a level invisible to the human eye. Our tool removes only the visible Gemini overlay watermark — the semi-transparent logo you can see in the bottom-right corner. SynthID cannot be removed by any browser-based tool." },
  { q: "What is Reverse Alpha Blending and why does it matter?", a: "Alpha blending is how Gemini composites its watermark onto your image: result = foreground × alpha + background × (1 − alpha). Reverse alpha blending inverts this formula — given the composited result and known watermark pixels, we can solve for the original background with pixel-perfect accuracy. Unlike AI inpainting (which guesses), this is a mathematical reconstruction — deterministic and lossless." },
  { q: "How do I remove the Gemini logo from multiple files?", a: "Drag and drop all your images and videos at once. Our tool automatically processes the entire batch, removing the Gemini watermark from each file using reverse alpha blending." },
  { q: "Does this Gemini watermark remover keep my data private?", a: "Yes. All processing happens entirely inside your browser (client-side). Your files are never uploaded to any server, making this the most secure and private way to erase Gemini watermarks." },
  { q: "How do I remove the Gemini watermark from a video?", a: "Upload your Gemini-generated video (MP4, WebM, or MOV) directly to this tool. It will automatically detect the Gemini logo watermark, process every frame using Reverse Alpha Blending inside your browser, and let you download a clean MP4 — all without uploading your file to any server." },
  { q: "Is there a free Gemini video watermark remover with no sign-up?", a: "Yes — this tool is completely free and requires no account or sign-up. Just open the page, drop your Gemini video onto the upload area, and download the watermark-free version in minutes. There are no file limits, no watermarks on the output, and no hidden fees." },
  { q: "Does removing the Gemini watermark work on MP4 video files?", a: "Yes. MP4 is the primary supported video format. WebM and MOV are also supported. The tool decodes your video frame-by-frame using the Canvas API, applies Reverse Alpha Blending to each frame to erase the Gemini logo, then remuxes the clean frames back into a downloadable MP4 file — all in your browser." },
  { q: "Can I remove the Gemini watermark from a video online without downloading any software?", a: "Yes. This is a 100% browser-based tool — no downloads, no installations, no extensions required. Open the page in any modern browser (Chrome, Safari, Firefox, Edge), upload your video, and the watermark removal happens entirely online inside your browser tab." },
  { q: "Why does my Google Gemini video have a watermark, and can it be removed?", a: "Google Gemini adds a visible semi-transparent logo watermark to the bottom-right corner of every image and video it generates. This is a visual brand mark, not a cryptographic watermark. Our tool removes this visible overlay using a mathematical algorithm (Reverse Alpha Blending) that reconstructs the original pixels beneath the logo — completely free, with no sign-up and no uploads." },
];

const USE_CASES = [
  { emoji: "📱", title: "Social Media Agencies", desc: "Batch clean hundreds of Gemini-generated thumbnails, reels covers, and carousel images for multiple client accounts." },
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

interface FeedbackModalProps {
  onProceed: () => void;
  onClose: () => void;
  fileName: string;
  fileKind: FileKind;
}

function FeedbackModal({ onProceed, onClose, fileName, fileKind }: FeedbackModalProps) {
  const [improvements, setImprovements] = useState("");
  const [needsCustom, setNeedsCustom] = useState<"yes" | "no" | "">("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const descriptionParts = [
        improvements ? `Improvements: ${improvements}` : null,
        usagePurpose ? `Usage Purpose: ${usagePurpose === "fun" ? "Just for Fun" : "Business / Professional"}` : null,
        needsCustom ? `Needs Custom Software: ${needsCustom === "yes" ? "Yes" : "No"}` : null,
        fileName ? `File Name: ${fileName}` : null,
        fileKind ? `File Type: ${fileKind}` : null,
      ].filter(Boolean);
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ source: "Gemini Watermark Remover Tool", email, description: descriptionParts.join("\n\n"), improvements, needsCustomSoftware: needsCustom, usagePurpose, fileName, fileKind, submitted_at: new Date().toISOString() }),
      });
    } catch { /* no-cors */ } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(onProceed, 1200);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }} transition={{ type: "spring", damping: 22 }} className="bg-background border border-border w-full max-w-lg shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-400" />
            <span className="font-bold text-foreground text-sm">Your file is ready to download!</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close dialog"><FaTimes /></button>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <FaCheckCircle className="text-green-400 text-3xl mx-auto mb-3" />
              <p className="font-bold text-foreground">Thanks for your feedback!</p>
              <p className="text-sm text-muted-foreground mt-1">Starting your download…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">Before you download, we&apos;d love 30 seconds of your feedback to make this tool better.</p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">What improvements or new tools would you like to see?</label>
                <textarea value={improvements} onChange={(e) => setImprovements(e.target.value)} rows={3} placeholder="e.g. faster processing, batch support, an AI image generator…" className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 resize-none outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Are you using this for fun or business?</label>
                <select required value={usagePurpose} onChange={(e) => setUsagePurpose(e.target.value)} className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 transition-colors">
                  <option value="" disabled>Select an option</option>
                  <option value="fun">Just for Fun</option>
                  <option value="business">Business / Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">Do you need custom software built for your business?</label>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((val) => (
                    <button key={val} type="button" onClick={() => setNeedsCustom(val)} className={`flex-1 py-2.5 border text-sm font-bold transition-all duration-200 ${needsCustom === val ? (val === "yes" ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-muted text-foreground border-foreground/30") : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                      {val === "yes" ? "✓ Yes, I do!" : "No, thanks"}
                    </button>
                  ))}
                </div>
                {needsCustom === "yes" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 p-3 bg-primary/10 border border-primary/20 text-xs text-primary">
                    🚀 Great! EatBit builds custom AI tools, SaaS platforms & web apps. We&apos;ll reach out after you submit.
                  </motion.div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60">
                  {submitting ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  {submitting ? "Sending…" : "Submit & Download"}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
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
          <button onClick={() => onRemove(item.id)} className="ml-2 text-muted-foreground hover:text-red-400 transition-colors shrink-0" aria-label={`Remove ${item.name}`}>
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

      {/* Image comparison slider */}
      {item.kind === "image" && item.originalSrc && (
        <div ref={containerRef} className="relative w-full overflow-hidden select-none border-b border-border" style={{ aspectRatio: "16/9", background: "#111" }}>
          <img src={item.originalSrc} alt="Original with watermark" className="absolute inset-0 w-full h-full object-contain" />
          {item.processedSrc && (
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderX}%)` }}>
              <img src={item.processedSrc} alt="Watermark removed" className="absolute inset-0 w-full h-full object-contain" />
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
          <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 font-bold">BEFORE</div>
          {item.processedSrc && <div className="absolute top-2 right-2 bg-primary/90 text-white text-[10px] px-2 py-0.5 font-bold">AFTER</div>}
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
              <button onClick={togglePlay} className="flex items-center gap-2 px-4 py-1.5 border border-border bg-background text-foreground text-xs font-bold hover:border-primary/50 transition-all">
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
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
            <FaDownload /> {item.kind === "image" ? "Download Image" : "Download Video"}
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

export default function BulkGeminiWatermarkRemoverPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const engineRef = useRef<any>(null);

  const [queue, setQueue] = useState<FileItem[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<FileItem | null>(null);
  const [isZipping, setIsZipping] = useState(false);

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
        if (resultCanvas.convertToBlob) { resultCanvas.convertToBlob({ type: "image/png" }).then(res).catch(rej); }
        else if (resultCanvas.toBlob) { resultCanvas.toBlob((b: Blob | null) => (b ? res(b) : rej(new Error("Blob failed"))), "image/png"); }
        else { rej(new Error("No blob conversion method available")); }
      });
      const procUrl = URL.createObjectURL(processedBlob);
      const downloadName = `watermark-removed-${file.name.replace(/\.[^.]+$/, "")}.png`;
      updateItem(id, { status: "done", processedSrc: procUrl, downloadUrl: procUrl, downloadName, result: { applied: meta?.applied ?? false, skipReason: meta?.skipReason ?? null, size: meta?.size ?? null }, statusMsg: meta?.applied ? "✓ Watermark removed successfully" : "No removable watermark detected — original preserved" });
    } catch (err) {
      console.error(err);
      updateItem(id, { status: "error", statusMsg: "Processing failed. Please try another image." });
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
    }
  }, [updateItem]);

  // Sequential processor — picks next queued item
  useEffect(() => {
    if (activeItemId) return;
    const next = queue.find((it) => it.status === "queued");
    if (!next) return;
    setActiveItemId(next.id);
    const run = next.kind === "image" ? processImageItem : processVideoItem;
    run(next).finally(() => setActiveItemId(null));
  }, [queue, activeItemId, processImageItem, processVideoItem]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
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
        downloadName: `watermark-removed-${file.name.replace(/\.[^.]+$/, "")}${kind === "image" ? ".png" : ".mp4"}`,
        result: null,
        videoProgress: null,
      });
    }
    if (newItems.length > 0) setQueue((prev) => [...prev, ...newItems]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleRemove = useCallback((id: string) => {
    setQueue((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item?.downloadUrl) URL.revokeObjectURL(item.downloadUrl);
      if (item?.originalSrc) URL.revokeObjectURL(item.originalSrc);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const handleClearAll = () => {
    queue.forEach((it) => {
      if (it.downloadUrl) URL.revokeObjectURL(it.downloadUrl);
      if (it.originalSrc) URL.revokeObjectURL(it.originalSrc);
    });
    setQueue([]);
    setActiveItemId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = useCallback((id: string) => {
    const item = queue.find((it) => it.id === id);
    if (!item || !item.downloadUrl) return;
    if (item.kind === "video") {
      setFeedbackFor(item);
    } else {
      const a = document.createElement("a");
      a.href = item.downloadUrl;
      a.download = item.downloadName;
      a.click();
    }
  }, [queue]);

  const triggerDownloadAfterFeedback = () => {
    if (!feedbackFor) return;
    const a = document.createElement("a");
    a.href = feedbackFor.downloadUrl!;
    a.download = feedbackFor.downloadName;
    a.click();
    setFeedbackFor(null);
  };

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
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = "watermark-removed-files.zip";
      a.click();
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
        {feedbackFor && (
          <FeedbackModal
            onProceed={triggerDownloadAfterFeedback}
            onClose={() => setFeedbackFor(null)}
            fileName={feedbackFor.name}
            fileKind={feedbackFor.kind}
          />
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Bulk Gemini Watermark Remover", applicationCategory: "MultimediaApplication", operatingSystem: "Any", browserRequirements: "Requires a modern browser with JavaScript enabled", url: "https://eatbit.in/tools/bulk-gemini-watermark-remover", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Free browser tool to batch remove visible Google Gemini AI watermarks from multiple images and videos simultaneously. Perfect for bulk processing.", featureList: ["Remove visible Gemini watermark from images", "Remove visible Gemini watermark from videos", "Batch multi-file processing", "Download all as ZIP", "Reverse alpha blending algorithm", "100% local browser processing", "No account required", "Supports JPG, PNG, WebP, MP4, WebM, MOV"], screenshot: "https://eatbit.in/og-gemini-watermark-remover.png", softwareVersion: "2.0", creator: { "@type": "Organization", name: "EatBit", url: "https://eatbit.in" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } })) }) }} />

      {/* HERO */}
      <header className="relative overflow-hidden pt-28 pb-16 border-b border-border bg-background">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border font-bold text-[10px] mb-6 uppercase tracking-wider text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Free · No Signup · Images &amp; Videos · Batch + ZIP Download
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-primary">Bulk Gemini</span> Watermark
            <br /><span className="text-foreground">Remover</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Batch remove <strong className="text-foreground">visible Gemini AI watermarks</strong> from hundreds of images and videos at once directly in your browser. Download the clean files as a single ZIP.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground mb-12">
            {["Bulk Images & Videos", "Batch Upload", "Download as ZIP", "100% Private Bulk Processing"].map((b) => (
              <span key={b} className="flex items-center gap-1.5"><FaCheck className="text-primary w-3 h-3" /> {b}</span>
            ))}
          </div>
        </motion.div>
      </header>

      {/* TOOL */}
      <section className="bg-card py-16 border-b border-border" id="tool">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0 space-y-6">

              {/* Upload zone — always visible */}
              <div
                className={`relative border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
                      <button onClick={handleClearAll} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors font-bold">
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
            <div className="w-full lg:w-80 shrink-0"><OtherToolsSidebar /></div>
          </div>
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
            <h2 className="text-3xl font-extrabold text-foreground mb-6">Batch Remove Google Gemini Watermarks — <span className="text-primary">Fast Bulk Processing</span></h2>
            <div className="text-muted-foreground space-y-4 text-sm leading-7">
              <p>When Google Gemini generates images or videos, it embeds a visible semi-transparent logo watermark in the bottom-right corner. This tool uses an open-source <strong className="text-foreground">Reverse Alpha Blending</strong> algorithm to mathematically reconstruct the original pixels beneath the watermark — not AI inpainting — for lossless, pixel-perfect results.</p>
              <p>For <strong className="text-foreground">videos</strong>, each frame is processed individually using Canvas API and an optional ONNX AI denoising model (running via WebAssembly), then remuxed back into MP4. No data ever leaves your browser tab.</p>
              <p>It&apos;s important to note: this tool targets the <strong className="text-foreground">visible Gemini overlay watermark only</strong>. It does not remove SynthID — Google DeepMind&apos;s invisible cryptographic provenance watermark, which is embedded at the pixel level and cannot be removed by any browser-based tool. Want to understand the difference in depth?{" "}<Link href="/blog/gemini-watermark-vs-synthid" className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity">Read our explainer →</Link></p>
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
                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-muted/50 transition-colors" id={`faq-${i}`} aria-expanded={activeFaq === i}>
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
              <Link href="/contact-us" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Get a Free Quote <FaArrowRight className="w-3 h-3" />
              </Link>
              <a href="https://wa.me/8319212779?text=Hi%2C%20I%20saw%20the%20Gemini%20Watermark%20Remover%20on%20EatBit%20and%20I%27m%20interested%20in%20custom%20software." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-green-500/40 bg-green-500/10 text-green-400 font-bold text-sm hover:bg-green-500/20 transition-colors">
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
            <h2 className="text-xl font-extrabold text-foreground mb-6">Learn More About <span className="text-primary">Bulk Watermark Removal</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/blog/how-to-remove-gemini-watermark", title: "How to Remove a Gemini Watermark", desc: "Step-by-step guide to using this tool and understanding what gets removed." },
                { href: "/blog/gemini-watermark-explained", title: "What Is the Gemini Watermark?", desc: "Where it appears, why Google adds it, and what it looks like." },
                { href: "/blog/gemini-watermark-vs-synthid", title: "Gemini Watermark vs SynthID", desc: "The critical distinction between the visible overlay and invisible cryptographic provenance." },
              ].map((article) => (
                <Link key={article.href} href={article.href} className="group border border-border bg-background p-5 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
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
              <a href="#tool" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all"><FaMagic /> Try the Tool</a>
              <Link href="/contact-us" className="inline-flex items-center gap-2 px-8 py-4 border border-border bg-background text-foreground font-bold text-sm hover:border-primary/50 transition-all group">Get in Touch <FaArrowRight className="group-hover:translate-x-1 transition-transform" /></Link>
            </div>
          </motion.div>
        </div>
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
      if (files.length > 0) onFiles(files);
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [onFiles]);
  return null;
}
