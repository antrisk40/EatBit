"use client";

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
function FeedbackModal({ onProceed, onClose }: { onProceed: () => void; onClose: () => void }) {
  const [improvements, setImprovements] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [needsCustom, setNeedsCustom] = useState<"yes" | "no" | "">("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "Image Converter Tool", email, improvements, usagePurpose, needsCustomSoftware: needsCustom, submitted_at: new Date().toISOString() }),
      });
    } catch { /* no-cors always throws */ } finally {
      setSubmitting(false); setSubmitted(true);
      setTimeout(onProceed, 1200);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 22 }}
        className="bg-background border border-border w-full max-w-lg shadow-2xl rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <svg className="text-green-400 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="font-bold text-foreground text-sm">Your image is ready to download!</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <svg className="text-green-400 w-10 h-10 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <p className="font-bold text-foreground">Thanks for your feedback!</p>
              <p className="text-sm text-muted-foreground mt-1">Starting your download…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-muted-foreground">Before you download, we'd love 30 seconds of feedback to make this tool better.</p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">What improvements would you like to see?</label>
                <textarea value={improvements} onChange={e => setImprovements(e.target.value)} rows={3}
                  placeholder="e.g. batch ZIP download, resize before convert, AVIF support…"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 resize-none outline-none focus:border-primary/60 rounded-lg placeholder:text-muted-foreground/50" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Are you using this for fun or business?</label>
                <select required value={usagePurpose} onChange={e => setUsagePurpose(e.target.value)}
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 rounded-lg">
                  <option value="" disabled>Select an option</option>
                  <option value="fun">Just for Fun</option>
                  <option value="business">Business / Professional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">Do you need custom software built for your business?</label>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map(val => (
                    <button key={val} type="button" onClick={() => setNeedsCustom(val)}
                      className={`flex-1 py-2.5 border text-sm font-bold transition-all rounded-lg ${needsCustom === val ? (val === "yes" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-foreground/30") : "border-border text-muted-foreground hover:border-primary/40"}`}>
                      {val === "yes" ? "✓ Yes, I do!" : "No, thanks"}
                    </button>
                  ))}
                </div>
                {needsCustom === "yes" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3 bg-primary/10 border border-primary/20 text-xs text-primary rounded-lg">
                    🚀 EatBit builds custom AI tools, SaaS platforms & web apps. We&apos;ll reach out after you submit.
                  </motion.div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 rounded-lg placeholder:text-muted-foreground/50" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all rounded-xl disabled:opacity-60">
                {submitting ? <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                {submitting ? "Sending…" : "Submit & Download"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

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

  const addFiles = useCallback((rawFiles: FileList | File[]) => {
    const arr = Array.from(rawFiles).slice(0, 20);
    const newEntries: ConvertedFile[] = arr.map(f => ({
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
      setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "converting" } : f));
      convertFile(file, toFmt, quality).then(blob => {
        const url = URL.createObjectURL(blob);
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "done", convertedBlob: blob, convertedUrl: url, convertedSize: blob.size } : f));
      }).catch(err => {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: "error", error: err.message } : f));
      });
    });
  }, [toFmt, quality]);

  const reconvertAll = useCallback(() => {
    // Re-convert all existing files with new settings
    setFiles(prev => prev.map(f => ({ ...f, status: "converting", convertedBlob: null, convertedUrl: null, convertedSize: null })));
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const triggerDownload = (fn: () => void) => { pendingAction.current = fn; setShowFeedback(true); };
  const executePending = () => { setShowFeedback(false); pendingAction.current?.(); pendingAction.current = null; };

  const downloadFile = (file: ConvertedFile) => {
    if (!file.convertedBlob) return;
    triggerDownload(() => {
      const url = file.convertedUrl || URL.createObjectURL(file.convertedBlob!);
      const base = file.originalName.replace(/\.[^.]+$/, "");
      const a = document.createElement("a"); a.href = url; a.download = `${base}.${toFmt === "jpg" ? "jpg" : toFmt}`;
      document.body.appendChild(a); a.click(); a.remove();
    });
  };

  const downloadAll = async () => {
    const done = files.filter(f => f.status === "done" && f.convertedBlob);
    if (!done.length) return;
    triggerDownload(async () => {
      if (done.length === 1) { downloadFile(done[0]); return; }
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      done.forEach(f => { const base = f.originalName.replace(/\.[^.]+$/, ""); zip.file(`${base}.${toFmt}`, f.convertedBlob!); });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `converted-images.zip`;
      document.body.appendChild(a); a.click(); a.remove();
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
        {showFeedback && <FeedbackModal onProceed={executePending} onClose={() => { setShowFeedback(false); pendingAction.current = null; }} />}
      </AnimatePresence>

      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[90rem] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">

              {/* Hero */}
              <div className="mb-12 text-center md:text-left">
                <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-6">
                  {["No sign-up", "Runs in your browser", "Images never uploaded", "Batch up to 20 files"].map(t => (
                    <span key={t} className="px-3 py-1 text-xs font-medium border border-border rounded-full bg-secondary/50 text-secondary-foreground">{t}</span>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
                  {heroTitle ?? "Free Image Converter — JPG, PNG, WebP, HEIC & more"}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {heroDesc ?? <>Convert images between <strong className="text-foreground">JPG, PNG, WebP, BMP, GIF, HEIC and SVG</strong> formats instantly. Supports <strong className="text-foreground">batch conversion</strong> of up to 20 files at once. All processing happens in your browser — your images are never uploaded to any server.</>}
                </p>
              </div>

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

            <div className="w-full lg:w-80 shrink-0">
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
    { q: "Is this image converter free?", a: "Yes — completely free, no sign-up, no watermark, no file limit per session. Convert as many images as you need." },
    { q: "Are my images uploaded to a server?", a: "No. All conversion happens inside your browser using the Canvas API. Your images never leave your device." },
    { q: "What formats can I convert to?", a: "You can convert to JPG, PNG, WebP, and BMP. Input supports JPG, PNG, WebP, BMP, GIF, HEIC (iPhone) and SVG." },
    { q: "How do I convert multiple images at once?", a: "Drag and drop up to 20 images onto the drop zone, or click to open a file picker and select multiple files. All files are converted simultaneously and can be downloaded individually or as a ZIP." },
    { q: "Does HEIC conversion work offline?", a: "The HEIC decoder (heic2any) downloads once on first use, then works entirely in your browser. After the first conversion you can use it offline." },
    { q: "What quality setting should I use for JPG or WebP?", a: "90% is a good default — visually indistinguishable from 100% but significantly smaller file size. For web thumbnails, 75–80% is sufficient. For print, use 95–100%." },
  ];
  return (
    <div className="mt-24 space-y-16 border-t border-border pt-16 pb-24">
      <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden shadow-2xl border border-border">
        <NextImage src="/images/image_converter.webp" alt="Image Converter Tool" width={1200} height={675} className="w-full h-auto object-cover" />
      </div>
      <section>
        <h2 className="text-3xl font-bold mb-10 text-center">Supported conversions</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50"><th className="text-left px-5 py-3 font-semibold">From</th><th className="text-left px-5 py-3 font-semibold">To</th><th className="text-left px-5 py-3 font-semibold">Best use</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[
                { from: "HEIC (iPhone)", to: "JPG / PNG", use: "Share iPhone photos on Windows or Android" },
                { from: "WebP", to: "JPG / PNG", use: "Open Chrome screenshots anywhere" },
                { from: "PNG", to: "JPG", use: "Reduce file size, remove transparency" },
                { from: "JPG", to: "PNG", use: "Add transparency, better for logos" },
                { from: "JPG / PNG", to: "WebP", use: "Optimise images for websites" },
                { from: "SVG", to: "PNG / JPG", use: "Rasterise vector graphics for social media" },
              ].map(r => (
                <tr key={r.from + r.to}><td className="px-5 py-3 font-medium text-foreground">{r.from}</td><td className="px-5 py-3 text-primary font-semibold">{r.to}</td><td className="px-5 py-3 text-muted-foreground">{r.use}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
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
