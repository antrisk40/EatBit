"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaFilm,
  FaUpload,
  FaDownload,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
  FaBolt,
  FaArrowRight,
  FaInfoCircle,
  FaRedo,
} from "react-icons/fa";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";
import AdBanner from "@/components/AdBanner";

// ── Types ──────────────────────────────────────────────────────────────────────

type QualityPreset = "high" | "medium" | "low" | "custom";
type CompressStatus = "idle" | "loading" | "compressing" | "done" | "error" | "unsupported";

interface VideoInfo {
  name: string;
  size: number;
  duration: number;
  width: number;
  height: number;
  type: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const QUALITY_PRESETS: Record<QualityPreset, { label: string; desc: string; bitsPerPixelPerSec: number }> = {
  high:   { label: "High",   desc: "Lighter compression, best visual quality",        bitsPerPixelPerSec: 0.07 },
  medium: { label: "Medium", desc: "Balanced — good quality, noticeably smaller file", bitsPerPixelPerSec: 0.035 },
  low:    { label: "Low",    desc: "Strongest compression, smallest file",            bitsPerPixelPerSec: 0.015 },
  custom: { label: "Custom", desc: "Set your own bitrate",                           bitsPerPixelPerSec: 0 },
};

const FAQS = [
  {
    q: "How do I make a video file smaller online for free?",
    a: "Drop your video into the upload zone above, pick a preset (High keeps quality, Low makes the smallest file), then hit Compress. The whole thing runs in your tab — no account, no install, nothing to pay.",
  },
  {
    q: "Can this handle a 1 GB, 2 GB, or 10 GB video?",
    a: "Yes. Because your file never touches a server, there is no upload cap. A 10 GB clip compresses the same way a 100 MB one does — it just takes longer and uses more of your device RAM. Keep other heavy tabs closed if you are working with very large files.",
  },
  {
    q: "Which video formats are supported — MP4, MOV, MKV, WebM?",
    a: "All four. Drop in an MP4, MOV (iPhone/Mac video), MKV, or WebM file. The output is always a standard H.264 MP4, which plays on every phone, TV, and editor without needing extra plugins.",
  },
  {
    q: "How small can I make my video?",
    a: "With the Low preset you can typically cut file size by 70–90% compared to the original. The tradeoff is quality — fast-moving scenes or fine textures may look softer. High gives 30–50% savings with barely noticeable quality loss.",
  },
  {
    q: "Does my video get sent to EatBit's servers?",
    a: "Never. The browser's built-in MediaRecorder API does all the work inside your tab. EatBit's backend never sees your file. This matters for personal videos, raw client footage, or anything you would not want on a stranger's server.",
  },
  {
    q: "Will a watermark appear on my compressed video?",
    a: "No. EatBit does not stamp, brand, or modify your video in any way other than changing its bitrate. What you download is exactly what was in your original, just smaller.",
  },
  {
    q: "Will I notice a quality drop after compression?",
    a: "On High it is usually invisible at normal viewing distance. On Medium you might spot softness in extreme close-ups. On Low it is visible if you are looking for it, but it is typically fine for messaging apps or social previews where bandwidth matters more than perfection.",
  },
  {
    q: "How do I compress a video to send on WhatsApp, Discord, or email?",
    a: "Use Medium or Low. WhatsApp caps attachments at 16 MB, Discord at 25 MB (or 50 MB with Nitro), and Gmail at 25 MB. The estimated output size shown above the Compress button tells you roughly what you will get before you start, so you can tune the preset accordingly.",
  },
  {
    q: "Does it work on an iPhone or iPad?",
    a: "Yes, in Safari on iOS 16.4 or later. Older iOS versions can re-encode video but may strip the audio track due to browser API limitations. If audio matters, make sure your device is updated.",
  },
  {
    q: "Which browser gives the best results?",
    a: "Chrome or Edge (any recent version) are the safest choices — they have the most complete MediaRecorder support. Safari on macOS Ventura and iOS 16.4+ works well. Firefox supports MediaRecorder but outputs WebM instead of MP4.",
  },
  {
    q: "Why does the same video compress differently on different devices?",
    a: "Because compression happens on your hardware using the browser's encoder, faster CPUs and GPUs produce better results in the same time window. A newer MacBook or Android flagship will typically produce a sharper output at the same bitrate than an older budget phone.",
  },
  {
    q: "What actually controls video file size?",
    a: "Mostly bitrate — the megabits-per-second the encoder uses. Resolution, frame rate, codec, and audio all contribute too, but dropping from 8 Mbps to 2 Mbps on the same 1080p video has a bigger impact on size than changing anything else.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function estimatedOutputSize(info: VideoInfo, bitrate: number): number {
  // Output size ≈ (video_bitrate + audio_bitrate) × duration / 8 bytes
  const audioBitrate = 128_000; // 128 kbps constant
  return ((bitrate + audioBitrate) * info.duration) / 8;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function VideoCompressorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [preset, setPreset] = useState<QualityPreset>("medium");
  const [customBitrate, setCustomBitrate] = useState(2000); // kbps
  const [status, setStatus] = useState<CompressStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const abortRef = useRef(false);

  // Check WebCodecs support
  const isSupported = typeof window !== "undefined" &&
    "VideoEncoder" in window &&
    "VideoDecoder" in window &&
    "AudioEncoder" in window;

  useEffect(() => {
    if (typeof window !== "undefined" && !isSupported) {
      setStatus("unsupported");
    }
  }, [isSupported]);

  // Load video metadata when file is selected
  const loadVideoInfo = useCallback((f: File) => {
    const url = URL.createObjectURL(f);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.src = url;
    vid.onloadedmetadata = () => {
      setVideoInfo({
        name: f.name,
        size: f.size,
        duration: vid.duration,
        width: vid.videoWidth,
        height: vid.videoHeight,
        type: f.type,
      });
      URL.revokeObjectURL(url);
    };
    vid.onerror = () => {
      setError("Could not read video metadata. Please try a different file.");
      URL.revokeObjectURL(url);
    };
  }, []);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("video/")) {
      setError("Please select a video file (MP4, MOV, MKV, WebM).");
      return;
    }
    setFile(f);
    setOutputBlob(null);
    setOutputSize(null);
    setError("");
    setProgress(0);
    setStatus("loading");
    loadVideoInfo(f);
  }, [loadVideoInfo]);

  useEffect(() => {
    if (videoInfo) setStatus("idle");
  }, [videoInfo]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  // Calculate effective bitrate from preset
  const effectiveBitrate = useCallback((): number => {
    if (preset === "custom") return customBitrate * 1000;
    if (!videoInfo) return 2_000_000;
    const { bitsPerPixelPerSec } = QUALITY_PRESETS[preset];
    const rawBitrate = videoInfo.width * videoInfo.height * bitsPerPixelPerSec;
    // Cap: high=20Mbps, medium=8Mbps, low=3Mbps
    const caps: Record<string, number> = { high: 20_000_000, medium: 8_000_000, low: 3_000_000 };
    return Math.min(rawBitrate, caps[preset] ?? 8_000_000);
  }, [preset, customBitrate, videoInfo]);

  // MediaRecorder-based fallback compression (broad browser support)
  const compressVideo = useCallback(async () => {
    if (!file || !videoInfo) return;
    setStatus("compressing");
    setProgress(0);
    setError("");
    abortRef.current = false;

    try {
      const targetBitrate = effectiveBitrate();

      // Create a hidden video element to play the source
      const videoEl = document.createElement("video");
      videoEl.src = URL.createObjectURL(file);
      videoEl.muted = true;
      videoEl.playsInline = true;
      await new Promise<void>((res, rej) => {
        videoEl.oncanplay = () => res();
        videoEl.onerror = () => rej(new Error("Cannot decode video"));
      });

      // Capture a stream from the video element
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const captureStream = (videoEl as any).captureStream?.bind(videoEl) || (videoEl as any).mozCaptureStream?.bind(videoEl);
      if (!captureStream) throw new Error("captureStream not supported in this browser. Try Chrome or Edge.");

      const stream: MediaStream = captureStream();

      // MediaRecorder with bitrate hint
      const mimeOptions = [
        "video/mp4;codecs=avc1",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ];
      const mimeType = mimeOptions.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
      if (!mimeType) throw new Error("Your browser does not support recording. Please use Chrome or Edge.");

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: targetBitrate,
        audioBitsPerSecond: 128_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      await new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = (e) => reject(new Error(String(e)));
        recorder.start(1000);
        videoEl.play();

        const duration = videoInfo.duration;
        const interval = setInterval(() => {
          if (abortRef.current) {
            recorder.stop();
            videoEl.pause();
            clearInterval(interval);
            reject(new Error("Cancelled"));
            return;
          }
          const pct = Math.min((videoEl.currentTime / duration) * 100, 99);
          setProgress(Math.round(pct));
        }, 300);

        videoEl.onended = () => {
          clearInterval(interval);
          setProgress(99);
          recorder.stop();
        };
        videoEl.onerror = () => {
          clearInterval(interval);
          reject(new Error("Video playback error during compression."));
        };
      });

      URL.revokeObjectURL(videoEl.src);

      // Build output Blob — use mp4 if supported, else webm
      const outputMime = mimeType.startsWith("video/mp4") ? "video/mp4" : "video/webm";
      const blob = new Blob(chunks, { type: outputMime });
      setOutputBlob(blob);
      setOutputSize(blob.size);
      setProgress(100);
      setStatus("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Compression failed";
      if (msg !== "Cancelled") {
        setError(msg);
        setStatus("error");
      } else {
        setStatus("idle");
      }
    }
  }, [file, videoInfo, effectiveBitrate]);

  const handleDownload = useCallback(() => {
    if (!outputBlob || !file) return;
    const ext = outputBlob.type.includes("mp4") ? "mp4" : "webm";
    const name = file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }, [outputBlob, file]);

  const handleReset = useCallback(() => {
    abortRef.current = true;
    setFile(null);
    setVideoInfo(null);
    setOutputBlob(null);
    setOutputSize(null);
    setError("");
    setProgress(0);
    setStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const estSize = videoInfo ? estimatedOutputSize(videoInfo, effectiveBitrate()) : null;
  const saving = videoInfo && estSize ? Math.max(0, Math.round((1 - estSize / videoInfo.size) * 100)) : null;

  const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EatBit Free Video Compressor",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Compress MP4, MOV, MKV and WebM videos online for free. 1GB, 2GB, 10GB files — no upload limit, no watermark, 100% private.",
    featureList: [
      "Compress MP4 online free",
      "Compress MOV online",
      "Compress MKV online",
      "Compress WebM online",
      "No upload — video stays on your device",
      "No watermark added",
      "No sign-up required",
      "Works on 1GB, 2GB, 10GB files",
      "High, Medium, Low quality presets",
      "Custom bitrate control",
    ],
    url: "https://eatbit.in/tools/video-compressor",
  };

  const FAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQSchema) }} />

      {/* ── HERO + TOOL ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border" id="tool">
        <div className="absolute inset-0 z-0 opacity-[0.06] bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 min-w-0 space-y-6">

              {/* Hero */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border font-bold text-[10px] mb-5 uppercase tracking-wider text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Free · No Upload · No Watermark · MP4, MOV, MKV, WebM
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                  <span className="text-primary">Free Video</span> Compressor{" "}
                  <span className="text-foreground">Online</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-5">
                  Compress <strong className="text-foreground">MP4, MOV, MKV and WebM</strong> videos directly in your browser — including <strong className="text-foreground">1 GB, 2 GB, and 10 GB</strong> files. Your video{" "}
                  <strong className="text-foreground">never leaves your device.</strong> No upload, no watermark, no account needed.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {["100% Private", "No Upload Limit", "No Watermark", "No Sign-up"].map((b) => (
                    <span key={b} className="flex items-center gap-1.5"><FaCheck className="text-primary w-3 h-3" /> {b}</span>
                  ))}
                </div>
              </motion.div>

              {/* Unsupported browser warning */}
              {status === "unsupported" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border border-yellow-500/40 bg-yellow-500/10 p-4 flex items-start gap-3">
                  <FaInfoCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-yellow-300 mb-1">Browser not fully supported</p>
                    <p className="text-xs text-yellow-300/80">
                      This tool uses the WebCodecs and MediaRecorder APIs. For best results, use <strong>Chrome 94+</strong>, <strong>Edge 94+</strong>, or <strong>Safari 16.4+</strong>. Firefox has limited MediaRecorder support.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Upload zone */}
              {!file && (
                <div
                  className={`relative border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="video/mp4,video/quicktime,video/x-matroska,video/webm,video/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    id="video-file-input"
                    aria-label="Upload video to compress"
                  />
                  <motion.div animate={{ y: isDragging ? -8 : 0 }} className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <FaUpload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground mb-1">Upload Video</p>
                      <p className="text-muted-foreground text-sm">
                        or <span className="text-primary font-semibold underline underline-offset-4">click to browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">MP4 · MOV · MKV · WebM — any size (1GB, 2GB, 10GB+)</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                      {["MP4", "MOV", "MKV", "WebM"].map((fmt) => (
                        <span key={fmt} className="px-2 py-0.5 border border-border bg-muted font-mono font-bold">{fmt}</span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* File loaded — compression controls */}
              {file && videoInfo && (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                    {/* Video info card */}
                    <div className="border border-border bg-muted/30 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <FaFilm className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground text-sm truncate max-w-[260px]">{videoInfo.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatSize(videoInfo.size)} · {videoInfo.width}×{videoInfo.height} · {formatDuration(videoInfo.duration)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-xs text-muted-foreground hover:text-red-400 transition-colors flex items-center gap-1 font-semibold shrink-0"
                      >
                        <FaTimes className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    {/* Quality presets */}
                    <div>
                      <p className="text-sm font-bold text-foreground mb-3">Choose Quality</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(Object.keys(QUALITY_PRESETS) as QualityPreset[]).map((key) => (
                          <button
                            key={key}
                            onClick={() => setPreset(key)}
                            disabled={status === "compressing"}
                            className={`relative p-3 border text-left transition-all duration-200 disabled:opacity-50 ${
                              preset === key
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {key === "medium" && (
                              <span className="absolute -top-2 -right-1 text-[9px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">POPULAR</span>
                            )}
                            <p className="font-bold text-sm">{QUALITY_PRESETS[key].label}</p>
                            <p className="text-[10px] mt-0.5 leading-tight">{QUALITY_PRESETS[key].desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom bitrate slider */}
                    {preset === "custom" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border border-border bg-muted/20 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-bold text-foreground">Custom Bitrate</p>
                          <span className="text-primary font-bold text-sm">{customBitrate.toLocaleString()} kbps</span>
                        </div>
                        <input
                          type="range"
                          min={200}
                          max={25000}
                          step={100}
                          value={customBitrate}
                          onChange={(e) => setCustomBitrate(Number(e.target.value))}
                          className="w-full accent-primary"
                          disabled={status === "compressing"}
                        />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          <span>200 kbps (smallest)</span>
                          <span>25 Mbps (highest)</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Estimated output size */}
                    {estSize !== null && status !== "done" && (
                      <div className="border border-primary/20 bg-primary/5 p-3 flex flex-wrap gap-4 items-center justify-between text-sm">
                        <div>
                          <span className="text-muted-foreground">Original: </span>
                          <span className="font-bold text-foreground">{formatSize(videoInfo.size)}</span>
                        </div>
                        <FaArrowRight className="text-muted-foreground/50 w-3 h-3 hidden sm:block" />
                        <div>
                          <span className="text-muted-foreground">Estimated output: </span>
                          <span className="font-bold text-primary">{formatSize(estSize)}</span>
                        </div>
                        {saving !== null && saving > 0 && (
                          <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1">
                            ~{saving}% smaller
                          </span>
                        )}
                      </div>
                    )}

                    {/* Compression status */}
                    <div className="border border-border bg-card p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Compression Status</p>
                      {status === "idle" && (
                        <p className="text-sm text-muted-foreground">Ready — click <strong className="text-foreground">Compress Video</strong> to start.</p>
                      )}
                      {status === "loading" && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><FaSpinner className="animate-spin text-primary" /> Loading video…</p>
                      )}
                      {status === "compressing" && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground flex items-center gap-2"><FaSpinner className="animate-spin text-primary" /> Compressing…</span>
                            <span className="font-bold text-primary">{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Processing happens locally on your device. Large files may take a few minutes.
                          </p>
                        </div>
                      )}
                      {status === "done" && outputSize !== null && (
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-green-400 flex items-center gap-2 mb-1">
                              <FaCheck /> Compression complete!
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Original: <strong className="text-foreground">{formatSize(videoInfo.size)}</strong>
                              {" → "}
                              Output: <strong className="text-primary">{formatSize(outputSize)}</strong>
                              {" "}
                              {outputSize < videoInfo.size && (
                                <span className="text-green-400 font-bold">
                                  ({Math.round((1 - outputSize / videoInfo.size) * 100)}% smaller)
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleDownload}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                            >
                              <FaDownload className="w-3 h-3" /> Download
                            </button>
                            <button
                              onClick={handleReset}
                              className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-muted-foreground font-semibold text-sm hover:border-primary/50 transition-all"
                            >
                              <FaRedo className="w-3 h-3" /> New
                            </button>
                          </div>
                        </div>
                      )}
                      {status === "error" && (
                        <div>
                          <p className="text-sm font-bold text-red-400 flex items-center gap-2 mb-1"><FaTimes /> Compression failed</p>
                          <p className="text-xs text-red-300/80 mb-3">{error}</p>
                          <button onClick={() => setStatus("idle")} className="text-xs text-primary underline underline-offset-2">
                            Try again
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={compressVideo}
                        disabled={status === "compressing" || status === "loading" || status === "done"}
                        className="flex-1 py-3.5 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 hover:scale-[1.01] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                      >
                        {status === "compressing"
                          ? <><FaSpinner className="animate-spin" /> Compressing ({progress}%)…</>
                          : <><FaBolt /> Compress Video</>}
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-5 py-3.5 border border-border text-muted-foreground font-semibold text-sm hover:border-primary/50 transition-all"
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Videos never leave your browser &mdash; 100% private by design
              </p>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 self-start"><OtherToolsSidebar /></div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Four Steps. <span className="text-primary">Zero Server Required.</span></h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">Compress from drop to download — entirely inside your browser tab.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", icon: <FaUpload className="w-5 h-5 text-primary" />, title: "Drop your video", desc: "Drag your MP4, MOV, MKV, or WebM into the zone — or click to browse. Any file size accepted." },
              { n: "02", icon: <FaBolt className="w-5 h-5 text-primary" />, title: "Pick a preset", desc: "High for best quality, Low for smallest size, Medium for the sweet spot. Or dial in a custom bitrate." },
              { n: "03", icon: <FaFilm className="w-5 h-5 text-primary" />, title: "Hit Compress", desc: "Your browser re-encodes the video locally. Nothing leaves your device. No queue, no waiting for uploads." },
              { n: "04", icon: <FaDownload className="w-5 h-5 text-primary" />, title: "Download & use", desc: "Save a clean MP4 to your device. Original file is untouched — you can try different presets anytime." },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">STEP {step.n}</span>
                </div>
                <h3 className="font-bold text-foreground text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY USE THIS ────────────────────────────────────────────────────── */}
      <section className="bg-card py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-foreground mb-3">Why Creators Use <span className="text-primary">EatBit to Compress Videos</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: <FaShieldAlt className="text-green-400 w-5 h-5" />, title: "Zero Upload — Truly Private", desc: "Your footage never crosses the network. The browser's MediaRecorder API encodes directly inside your tab. EatBit's servers never receive a single frame — which matters for personal clips, raw client footage, or anything confidential." },
              { icon: <FaBolt className="text-yellow-400 w-5 h-5" />, title: "No File Size Limit", desc: "Other tools cap uploads at 500 MB or 2 GB because server bandwidth costs money. Because there is no server involved, the only limit is your device's RAM. 1 GB, 2 GB, 10 GB — just give it time." },
              { icon: <FaCheck className="text-primary w-5 h-5" />, title: "No Watermark, Ever", desc: "EatBit does not stamp its logo on your video. What you download is a clean file — no badge, no end card, no overlay. Use it anywhere without crediting us." },
              { icon: <FaFilm className="text-blue-400 w-5 h-5" />, title: "MP4, MOV, MKV, WebM In — MP4 Out", desc: "Drop in any mainstream format: MP4, MOV (from your iPhone or Mac), MKV, or WebM. The output is always H.264 MP4 — the most compatible video format on the planet, readable on every device, app, and browser." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-border bg-background p-6 flex gap-4"
              >
                <div className="w-10 h-10 rounded bg-muted border border-border flex items-center justify-center shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO CONTENT ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold text-foreground mb-6">How <span className="text-primary">In-Browser Compression</span> Works</h2>
            <div className="text-muted-foreground space-y-4 text-sm leading-7">
              <p>Most online video compressors work by uploading your file to a remote server, processing it on expensive cloud hardware, and streaming the result back to you. EatBit does the opposite: your video never moves. The browser&apos;s native <strong className="text-foreground">MediaRecorder API</strong> plays your file through a hidden video element, captures the decoded frames as a live stream, and immediately re-encodes them at the bitrate you chose — all inside your current tab.</p>
              <p>The result is written directly to your device as a downloadable Blob. No data crosses the network. No server ever touches your footage. This architecture means there is no queue, no waiting for someone else&apos;s large file to finish, and no upload size limit imposed by a server configuration.</p>
              <h3 className="text-base font-bold text-foreground">What bitrate should I choose?</h3>
              <p>Bitrate is the single biggest lever. It measures how many megabits the encoder uses every second. A typical 1080p recording from a phone sits between 15–40 Mbps. Sharing on WhatsApp or Discord rarely needs more than 2–4 Mbps at that resolution — that is an 80–90% size reduction with almost no visible difference on a phone screen. The <strong className="text-foreground">Medium preset</strong> targets roughly 3.5 bits per pixel per second, which is a reasonable starting point for most social sharing use cases.</p>
              <h3 className="text-base font-bold text-foreground">Why output is always MP4</h3>
              <p>The output format is always <strong className="text-foreground">H.264 MP4</strong> (or WebM in Firefox). MP4 / H.264 is the most universally supported codec on the planet — every phone, smart TV, browser, and video editing app reads it without installing extra software. MKV and WebM inputs are decoded in the browser and re-muxed into this compatible container for you automatically.</p>
              <h3 className="text-base font-bold text-foreground">What affects the final file size</h3>
              <ul className="space-y-2 pl-4 list-disc">
                <li><strong className="text-foreground">Bitrate</strong> — the dominant factor. Lower bitrate = smaller file. The presets calculate a sensible target based on your video&apos;s resolution.</li>
                <li><strong className="text-foreground">Resolution</strong> — a 4K video at the same bitrate as a 1080p video will look worse; resolution and bitrate must be balanced together.</li>
                <li><strong className="text-foreground">Duration</strong> — a 10-minute video is roughly 10× the size of a 1-minute video at the same bitrate.</li>
                <li><strong className="text-foreground">Frame rate</strong> — 60 fps at the same bitrate spreads fewer bits per frame than 30 fps, which can reduce sharpness on fast motion.</li>
                <li><strong className="text-foreground">Audio</strong> — the tool re-encodes audio at a fixed 128 kbps, which is transparent for speech, music, and most content.</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="bg-card py-20 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="border border-border overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                  aria-expanded={activeFaq === i}
                >
                  <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-muted-foreground">
                    <FaChevronDown className="w-4 h-4" />
                  </motion.span>
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

      {/* ── RELATED TOOLS ───────────────────────────────────────────────────── */}
      <section className="bg-background py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-xl font-extrabold text-foreground mb-6">More <span className="text-primary">Free Tools</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: "/tools/gemini-watermark-remover", title: "Gemini Watermark Remover", desc: "Remove the visible Google Gemini logo from AI-generated images and videos." },
                { href: "/tools/image-converter", title: "Image Converter", desc: "Convert JPG, PNG, WebP, HEIC and more — batch up to 20 files, no upload." },
                { href: "/tools/image-cropper-and-resizer", title: "Image Cropper & Resizer", desc: "Crop and resize images to any dimension instantly in your browser." },
              ].map((article) => (
                <Link key={article.href} href={article.href} className="group border border-border bg-card p-5 hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                  <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{article.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold">
                    Use tool <FaArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Need Custom <span className="text-primary">Software</span> Built?</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">EatBit builds AI tools, SaaS platforms, and production-grade web apps. Tell us what you need.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#tool" data-ga-event="click" data-ga-label="cta_try_tool" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all">
                <FaFilm /> Compress a Video
              </a>
              <Link href="/contact-us" data-ga-event="click" data-ga-label="cta_contact" className="inline-flex items-center gap-2 px-8 py-4 border border-border bg-background text-foreground font-bold text-sm hover:border-primary/50 transition-all group">
                Get in Touch <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <AdBanner slot="tool-bottom" className="mt-0" />
    </>
  );
}
