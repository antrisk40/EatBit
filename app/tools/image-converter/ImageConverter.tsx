"use client";
import { downloadWithGate } from "@/lib/downloadWithGate";
import FeedbackModal from "@/components/FeedbackModal";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLnyGXKrgLTdkMgXnwL38DafnGxE-vhb-SzHG0gCKCl7aWrduKWGAomaiSUve4jrAY/exec";

export type Format = "jpg" | "png" | "webp" | "bmp" | "gif" | "heic" | "svg";

const FORMAT_LABELS: Record<Format, string> = {
  jpg: "JPG / JPEG",
  png: "PNG",
  webp: "WebP",
  bmp: "BMP",
  gif: "GIF",
  heic: "HEIC (iPhone)",
  svg: "SVG",
};

const FORMAT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  bmp: "image/bmp",
  gif: "image/gif",
};

const LOSSY_FORMATS = new Set(["jpg", "webp"]);

const FROM_FORMATS: Format[] = ["jpg", "png", "webp", "bmp", "gif", "heic", "svg"];
const TO_FORMATS: Format[] = ["jpg", "png", "webp", "bmp"];

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  originalUrl: string;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  convertedSize: number | null;
  status: "pending" | "converting" | "done" | "error";
  error?: string;
}

// ─── FEEDBACK MODAL ──────────────────────────────────────────────────────────


// ─── CONVERTER LOGIC ──────────────────────────────────────────────────────────
async function convertFile(file: File, toFormat: Format, quality: number): Promise<Blob> {
  // HEIC conversion
  if (file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif")) {
    const heic2any = (await import("heic2any")).default;
    const result = await heic2any({ blob: file, toType: FORMAT_MIME[toFormat] || "image/jpeg", quality: quality / 100 });
    return Array.isArray(result) ? result[0] : result;
  }

  // SVG → raster
  if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext("2d")!;
        if (toFormat !== "jpg") { ctx.clearRect(0, 0, canvas.width, canvas.height); }
        else { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => { URL.revokeObjectURL(url); blob ? resolve(blob) : reject(new Error("Conversion failed")); }, FORMAT_MIME[toFormat] || "image/png", quality / 100);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load SVG")); };
      img.src = url;
    });
  }

  // Raster → raster via Canvas
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      if (toFormat === "jpg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => { URL.revokeObjectURL(url); blob ? resolve(blob) : reject(new Error("Conversion failed")); }, FORMAT_MIME[toFormat] || "image/png", quality / 100);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
interface ImageConverterProps {
  defaultFrom?: Format;
  defaultTo?: Format;
  heroTitle?: string;
  heroDesc?: string;
  seoContent?: React.ReactNode;
}

export default function ImageConverter({ defaultFrom = "jpg", defaultTo = "png", heroTitle, heroDesc, seoContent }: ImageConverterProps) {
  const [fromFmt, setFromFmt] = useState<Format>(defaultFrom);
  const [toFmt, setToFmt] = useState<Format>(defaultTo);
  const [quality, setQuality] = useState(90);
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => { files.forEach(f => { if (f.originalUrl) URL.revokeObjectURL(f.originalUrl); if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl); }); };
  }, [files]);

  const addFiles = useCallback(async (rawFiles: FileList | File[]) => {
    const { checkLimits } = await import("@/lib/api");
    const limits = await checkLimits();
    const arr = Array.from(rawFiles);
    
    if (!limits.downloads.unlimited) {
      if (limits.downloads.remaining <= 0) {
        if (limits.tier === "anonymous") {
          window.dispatchEvent(new CustomEvent("eatbit:open-login", { detail: { title: "Please Login", subtitle: "to continue for free" } }));
        } else {
          window.dispatchEvent(new CustomEvent("eatbit:open-upgrade", { detail: { title: "Upgrade Required", subtitle: "A Premium plan is needed to process more files." } }));
        }
        return;
      }
      
      const totalRequested = files.length + arr.length;
      if (totalRequested > limits.downloads.remaining) {
        if (limits.tier === "anonymous") {
          window.dispatchEvent(new CustomEvent("eatbit:open-login", { detail: { title: "Limit reached!", subtitle: `You can only process ${limits.downloads.remaining} file(s) for free. Please login to continue.` } }));
        } else {
          window.dispatchEvent(new CustomEvent("eatbit:open-upgrade", { detail: { title: "Upgrade Required", subtitle: "A Premium plan is needed to process multiple files simultaneously." } }));
        }
        return;
      }
    }

    const { recordDownload } = await import("@/lib/api");
    const rec = await recordDownload();
    if (!rec.allowed) {
       if (rec.code === "signup_required") {
          window.dispatchEvent(new CustomEvent("eatbit:open-login", { detail: { title: "Limit reached!", subtitle: "You can only process 1 file for free. Please login to continue." } }));
       } else {
          window.dispatchEvent(new CustomEvent("eatbit:open-upgrade"));
       }
       return;
    }

    const arrSliced = arr.slice(0, 20);
    const newEntries: ConvertedFile[] = arrSliced.map(f => ({
      id: Math.random().toString(36).slice(2),
      originalName: f.name,
      originalSize: f.size,
      originalUrl: URL.createObjectURL(f),
      convertedBlob: null,
      convertedUrl: null,
      convertedSize: null,
      status: "pending" as const,
    }));
    setFiles(prev => [...prev, ...newEntries]);
    // Start converting
    newEntries.forEach((entry, i) => {
      const file = arr[i];
      const start = Date.now();
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "converting" } : f));
      convertFile(file, toFmt, quality).then(blob => {
        const url = URL.createObjectURL(blob);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "done", convertedBlob: blob, convertedUrl: url, convertedSize: blob.size } : f));
        import("@/lib/api").then(({ trackUsage }) => trackUsage({
           tool: window.location.pathname.split('/').pop() || "image-converter", file_name: file.name, file_type: "image", file_size_bytes: file.size, processing_ms: Date.now() - start, output_format: toFmt
        })).catch(() => {});
      }).catch(err => {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "error", error: err.message } : f));
      });
    });
  }, [toFmt, quality, files]);

  const reconvertAll = useCallback(() => {
    // Re-convert all existing files with new settings
    setFiles(prev => prev.map(f => ({ ...f, status: "converting", convertedBlob: null, convertedUrl: null, convertedSize: null })));
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const executePending = async (fn: () => Promise<boolean|void>) => { const res = await fn(); if (res !== false) setShowFeedback(true); };

  const downloadFile = async (file: ConvertedFile) => {
    if (!file.convertedBlob) return;
    executePending(async () => {
      const url = file.convertedUrl || URL.createObjectURL(file.convertedBlob!);
      const base = file.originalName.replace(/\.[^.]+$/, "");
      await downloadWithGate(url, `${base}.${toFmt === "jpg" ? "jpg" : toFmt}`, true);
    });
  };

  const downloadAll = async () => {
    const done = files.filter(f => f.status === "done" && f.convertedBlob);
    if (!done.length) return;
    executePending(async () => {
      if (done.length === 1) { downloadFile(done[0]); return; }
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      done.forEach(f => { const base = f.originalName.replace(/\.[^.]+$/, ""); zip.file(`${base}.${toFmt}`, f.convertedBlob!); });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      await downloadWithGate(url, "converted-images.zip", true);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    });
  };

  const clearAll = () => { files.forEach(f => { if (f.originalUrl) URL.revokeObjectURL(f.originalUrl); if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl); }); setFiles([]); };
  const removeFile = (id: string) => { const f = files.find(x => x.id === id); if (f?.originalUrl) URL.revokeObjectURL(f.originalUrl); if (f?.convertedUrl) URL.revokeObjectURL(f.convertedUrl); setFiles(prev => prev.filter(x => x.id !== id)); };

  const doneCount = files.filter(f => f.status === "done").length;
  const selectCls = "bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <>
      <AnimatePresence>
        {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
      </AnimatePresence>

      <div className="relative min-h-screen bg-background text-foreground">
        {/* Background dot pattern across full page */}
        <div className="absolute inset-0 z-0 opacity-[0.05] bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[600px] h-[350px] bg-primary/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">

              {/* Hero */}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-muted border border-border font-bold text-[10px] mb-5 uppercase tracking-wider text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  No sign-up &nbsp;&middot;&nbsp; Runs in your browser &nbsp;&middot;&nbsp; Images never uploaded &nbsp;&middot;&nbsp; Batch up to 20 files
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                  <span className="text-primary">{heroTitle ? heroTitle.split(' ')[0] : 'Free'}</span> {heroTitle ? heroTitle.split(' ').slice(1).join(' ') : 'Image Converter — JPG, PNG, WebP, HEIC & more'}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {heroDesc ?? <>Convert images between <strong className="text-foreground">JPG, PNG, WebP, BMP, GIF, HEIC and SVG</strong> formats instantly. Supports <strong className="text-foreground">batch conversion</strong> of up to 20 files at once. All processing happens in your browser — your images are never uploaded to any server.</>}
                </p>
              </motion.div>

              {/* Controls */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Convert from</label>
                    <select value={fromFmt} onChange={e => setFromFmt(e.target.value as Format)} className={selectCls + " w-full"}>
                      {FROM_FORMATS.map(f => <option key={f} value={f}>{FORMAT_LABELS[f]}</option>)}
                    </select>
                  </div>
                  <div className="text-2xl text-muted-foreground pb-2">→</div>
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Convert to</label>
                    <select value={toFmt} onChange={e => setToFmt(e.target.value as Format)} className={selectCls + " w-full"}>
                      {TO_FORMATS.filter(f => f !== fromFmt).map(f => <option key={f} value={f}>{FORMAT_LABELS[f]}</option>)}
                    </select>
                  </div>
                  {LOSSY_FORMATS.has(toFmt) && (
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Quality: {quality}%</label>
                      <input type="range" min={10} max={100} step={5} value={quality} onChange={e => setQuality(Number(e.target.value))}
                        className="w-full accent-primary" />
                    </div>
                  )}
                  {files.length > 0 && (
                    <button onClick={reconvertAll} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors">
                      Apply to all
                    </button>
                  )}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 mb-6 ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"}`}
              >
                <input ref={fileInputRef} type="file" multiple accept="image/*,.heic,.heif" className="hidden"
                  onChange={e => e.target.files && addFiles(e.target.files)} />
                <div className="text-5xl mb-4">🖼️</div>
                <p className="font-semibold text-foreground mb-1">Drop images here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG, WebP, BMP, GIF, HEIC, SVG · Up to 20 files</p>
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">{files.length} file{files.length !== 1 ? "s" : ""} · {doneCount} converted</h2>
                    <div className="flex gap-2">
                      {doneCount > 0 && (
                        <button onClick={downloadAll}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          {doneCount > 1 ? `Download all (${doneCount})` : "Download"}
                        </button>
                      )}
                      <button onClick={clearAll} className="px-3 py-2 text-sm border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground">Clear all</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {files.map(file => {
                      const savings = file.convertedSize != null ? Math.round((1 - file.convertedSize / file.originalSize) * 100) : null;
                      return (
                        <motion.div key={file.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                            {file.originalUrl ? <img src={file.originalUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xl">🖼️</span>}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{file.originalName}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-muted-foreground">{fmtSize(file.originalSize)}</span>
                              {file.convertedSize != null && (<>
                                <span className="text-xs text-muted-foreground">→</span>
                                <span className="text-xs text-foreground font-medium">{fmtSize(file.convertedSize)}</span>
                                {savings !== null && (
                                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${savings > 0 ? "bg-green-500/10 text-green-500" : savings < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                                    {savings > 0 ? `−${savings}%` : savings < 0 ? `+${Math.abs(savings)}%` : "same size"}
                                  </span>
                                )}
                              </>)}
                            </div>
                          </div>
                          {/* Status / action */}
                          <div className="flex items-center gap-2 shrink-0">
                            {file.status === "converting" && (
                              <svg className="animate-spin w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            )}
                            {file.status === "error" && <span className="text-xs text-destructive">{file.error}</span>}
                            {file.status === "done" && (
                              <button onClick={() => downloadFile(file)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                              </button>
                            )}
                            <button onClick={() => removeFile(file.id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SEO content */}
              {seoContent ? seoContent : (
                <DefaultSEOContent />
              )}
            </div>

            <div className="w-full lg:w-80 shrink-0 self-start">
              <OtherToolsSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DefaultSEOContent() {
  const faqs = [
    { q: "Is this image converter free?", a: "Yes. There is no account, watermark, or per-session file cap beyond the 20-file batch. Convert as many batches as you need." },
    { q: "Are my images uploaded to a server?", a: "No. Conversion uses the Canvas API in this tab. HEIC uses heic2any in the same tab. EatBit does not receive the pixels." },
    { q: "What formats can I convert?", a: "Input: JPG, PNG, WebP, BMP, GIF, HEIC/HEIF, SVG. Output: JPG, PNG, WebP, BMP. Pick both formats in the dropdowns above — there are not separate converter sites." },
    { q: "Does converting JPG to PNG restore quality?", a: "No. JPEG artefacts are already in the pixels. PNG stores those pixels losslessly so further saves will not add more loss, but it cannot invent missing detail." },
    { q: "What happens to transparency when converting PNG to JPG?", a: "JPEG has no alpha channel. Transparent pixels are filled with white. If you need another fill colour, composite it before converting." },
    { q: "What quality should I use for JPG or WebP?", a: "90% is the default: usually indistinguishable from 100% and much smaller. Thumbnails can sit at 75–80%. Print-bound files should stay at 95–100%." },
    { q: "Does HEIC conversion work offline?", a: "The HEIC decoder downloads once on first use, then runs locally. After that first load you can convert iPhone photos without a network." },
  ];
  return (
    <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
      <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
        <NextImage src="/images/image_converter.webp" alt="EatBit image converter running in a browser" width={1200} height={675} className="w-full h-auto object-cover" />
      </div>
      <section className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
        <h2 className="text-3xl font-bold text-center text-foreground">One converter, not a folder of clones</h2>
        <p>
          Older search pages on this site each wrapped the same widget with a different title (JPG to PNG, HEIC to JPG, and so on).
          Those URLs now redirect here. Choose the source and target formats in the controls above. That is the whole product.
        </p>
        <p>
          Processing is local because photographs, receipts, and ID scans should not need a third-party disk. The trade-off is
          that very large batches are limited by this device&apos;s memory, not by a server queue.
        </p>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center">When to pick each format</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50"><th className="text-left px-5 py-3 font-semibold">From</th><th className="text-left px-5 py-3 font-semibold">To</th><th className="text-left px-5 py-3 font-semibold">Use it when</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[
                { from: "HEIC (iPhone)", to: "JPG / PNG", use: "A Windows PC, Android phone, or printer cannot open the original." },
                { from: "WebP", to: "JPG / PNG", use: "A client, CMS, or older app rejects Chrome/Edge screenshots." },
                { from: "PNG", to: "JPG", use: "A photo is too large for email or a CMS, and you can drop transparency." },
                { from: "JPG", to: "PNG", use: "You need a lossless container for further edits (it will not add a real alpha channel unless you erase the background separately)." },
                { from: "JPG / PNG", to: "WebP", use: "You are shipping images on a website and want smaller files with modern browser support." },
                { from: "SVG", to: "PNG / JPG", use: "A social network or slide deck cannot take a vector file." },
              ].map(r => (
                <tr key={r.from + r.to}><td className="px-5 py-3 font-medium text-foreground">{r.from}</td><td className="px-5 py-3 text-primary font-semibold">{r.to}</td><td className="px-5 py-3 text-muted-foreground">{r.use}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
        <h2 className="text-3xl font-bold text-center text-foreground">Practical notes from using this tool</h2>
        <p>
          PNG files of photographs are often 5–10× larger than a JPEG at 90% quality. Convert those for sharing, not for logos
          with sharp type. JPEG of a logo re-introduces ringing around edges; keep logos in PNG or SVG.
        </p>
        <p>
          WebP is usually 25–35% smaller than JPEG at a matched visual quality and can keep transparency, unlike JPEG.
          If a stakeholder must open the file in an older Office build, export JPEG or PNG instead.
        </p>
        <p>
          Animated GIFs: this converter takes the first frame. It is not a video encoder. For iPhone Live Photos, export a still
          in Photos first, then convert the HEIC here.
        </p>
      </section>
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group border border-border rounded-xl bg-card" open={i === 0}>
              <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-sm marker:content-none">
                {f.q}<svg className="ml-4 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
