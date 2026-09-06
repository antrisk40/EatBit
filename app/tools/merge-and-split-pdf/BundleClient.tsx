"use client";

import React, { useState, useRef, useEffect } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { FileUp, Scissors, RefreshCw, Download, X } from "lucide-react";

// @ts-ignore
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxiwD53rJ9aF0c2E2v0K6wX5w8x9z7A2y_5/exec"; // Dummy URL for now, keeping consistent with others

interface PdfFileEntry {
  id: string;
  name: string;
  srcDoc: any; // PDFLib doc
}

interface PageEntry {
  id: string;
  fileId: string;
  fileName: string;
  pageIndex: number;
  thumb: string | null;
  splitAfter: boolean;
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
        body: JSON.stringify({ source: "PDF Bundle Tool", email, improvements, usagePurpose, needsCustomSoftware: needsCustom, submitted_at: new Date().toISOString() }),
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
            <span className="font-bold text-foreground text-sm">Your PDF is ready to download!</span>
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
                  placeholder="e.g. compress PDF, add watermarks, password protect…"
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
                    <label key={val} className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${needsCustom === val ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'}`}>
                      <input type="radio" name="custom_software" value={val} checked={needsCustom === val} onChange={() => setNeedsCustom(val)} className="hidden" />
                      <span className="text-sm font-semibold capitalize">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {needsCustom === "yes" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Leave your email and we'll reach out</label>
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@company.com"
                        className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 rounded-lg placeholder:text-muted-foreground/50" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="pt-2">
                <button type="submit" disabled={submitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                  {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Download className="w-5 h-5" /> Download PDF</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function BundleClient() {
  const [isPdfjsLoaded, setIsPdfjsLoaded] = useState(false);
  const [isPdflibLoaded, setIsPdflibLoaded] = useState(false);
  const [files, setFiles] = useState<Map<string, PdfFileEntry>>(new Map());
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [baseFileName, setBaseFileName] = useState("bundle");
  
  // Feedback Modal State
  const [showFeedback, setShowFeedback] = useState(false);
  const pendingExport = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || !isPdfjsLoaded || !isPdflibLoaded) return;
    
    // @ts-ignore
    const pdfjsLib = window.pdfjsLib;
    // @ts-ignore
    const PDFLib = window.PDFLib;
    
    const pdfFiles = Array.from(fileList).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) return;

    // Use state updater to append files correctly
    for (const file of pdfFiles) {
      const fileId = uid();
      let arrayBuffer;
      try {
        arrayBuffer = await file.arrayBuffer();
      } catch (err) { continue; }

      const bufForLib = arrayBuffer.slice(0);
      const bufForJs = arrayBuffer.slice(0);

      let srcDoc, jsDoc;
      try {
        srcDoc = await PDFLib.PDFDocument.load(bufForLib, { ignoreEncryption: true });
      } catch (err) {
        console.warn('Could not load', file.name, err);
        continue;
      }
      
      setFiles(prev => {
        const newMap = new Map(prev);
        newMap.set(fileId, { id: fileId, name: file.name, srcDoc });
        return newMap;
      });

      const numPages = srcDoc.getPageCount();
      const newPages: PageEntry[] = [];
      for (let i = 0; i < numPages; i++) {
        newPages.push({ id: uid(), fileId, fileName: file.name, pageIndex: i, thumb: null, splitAfter: false });
      }

      setPages(prev => [...prev, ...newPages]);

      // Generate thumbnails
      try {
        jsDoc = await pdfjsLib.getDocument({ data: bufForJs }).promise;
        for (let i = 0; i < numPages; i++) {
          const page = await jsDoc.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1 });
          const scale = 160 / viewport.width;
          const scaledViewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport: scaledViewport }).promise;
          const dataUrl = canvas.toDataURL('image/png');
          
          setPages(prev => {
            const next = [...prev];
            // Find the exact page entry to update its thumb
            const pageIndexToUpdate = next.findIndex(p => p.fileId === fileId && p.pageIndex === i);
            if (pageIndexToUpdate !== -1) {
              next[pageIndexToUpdate].thumb = dataUrl;
            }
            return next;
          });
        }
      } catch (err) {
        console.warn('Thumbnail render failed for', file.name, err);
      }
    }
  };

  const resetAll = () => {
    setFiles(new Map());
    setPages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExportClick = () => {
    if (pages.length === 0) return;
    setShowFeedback(true);
  };

  const executeExport = async () => {
    setShowFeedback(false);
    if (pages.length === 0) return;

    // @ts-ignore
    const PDFLib = window.PDFLib;
    
    try {
      const segments: PageEntry[][] = [];
      let current: PageEntry[] = [];
      for (const p of pages) {
        current.push(p);
        if (p.splitAfter) {
          segments.push(current);
          current = [];
        }
      }
      if (current.length) segments.push(current);

      for (let s = 0; s < segments.length; s++) {
        const outDoc = await PDFLib.PDFDocument.create();
        for (const item of segments[s]) {
          const entry = files.get(item.fileId);
          if (!entry) continue;
          const [copied] = await outDoc.copyPages(entry.srcDoc, [item.pageIndex]);
          outDoc.addPage(copied);
        }
        const bytes = await outDoc.save();
        const safeName = (baseFileName.trim() || "bundle").replace(/\.pdf$/i, "");
        const name = segments.length > 1 ? `${safeName}-part-${s + 1}.pdf` : `${safeName}.pdf`;
        
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        
        if (segments.length > 1) await new Promise(r => setTimeout(r, 250));
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while building the PDF. Check the console for details.');
    }
  };

  const removePage = (index: number) => {
    setPages(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const toggleSplit = (index: number) => {
    setPages(prev => {
      const next = [...prev];
      next[index].splitAfter = !next[index].splitAfter;
      return next;
    });
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    // Needed for Firefox
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const onDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    setPages(prev => {
      const next = [...prev];
      const [moved] = next.splice(draggedIdx, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDraggedIdx(index);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" 
        onLoad={() => {
          setIsPdfjsLoaded(true);
          // @ts-ignore
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }} 
      />
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js" 
        onLoad={() => setIsPdflibLoaded(true)} 
      />

      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-foreground">PDF Merger Free No Sign Up</h1>
        <p className="text-lg text-muted-foreground">Merge & split PDFs online. Drop in PDFs, drag pages into the order you want, mark a split, and export. Every page stays in this browser tab — nothing is ever uploaded anywhere.</p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleFiles(e.target.files)} 
        accept="application/pdf" 
        multiple 
        className="hidden" 
      />

      {pages.length === 0 ? (
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-colors duration-200 
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-muted/30'}
          `}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Drop PDFs here</h2>
          <p className="text-muted-foreground">or <span className="text-primary hover:underline">browse files</span> from your device</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl">
            <div className="text-sm text-muted-foreground">
              <strong className="text-foreground">{pages.length}</strong> pages from <strong className="text-foreground">{files.size}</strong> files
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                Add more files
              </button>
              <button onClick={resetAll} className="px-4 py-2 text-sm font-semibold rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                Reset
              </button>
              <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden shadow-sm">
                <input 
                  type="text" 
                  value={baseFileName} 
                  onChange={(e) => setBaseFileName(e.target.value)} 
                  placeholder="bundle" 
                  className="w-32 px-3 py-2 text-sm font-medium outline-none bg-transparent placeholder:text-muted-foreground/50"
                />
                <span className="px-3 py-2 text-sm text-muted-foreground border-l border-border bg-muted/30">.pdf</span>
              </div>
              <button onClick={handleExportClick} className="px-6 py-2 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg">
                Export PDF
              </button>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl">
            <div className="flex flex-wrap gap-y-4">
              {pages.map((p, idx) => (
                <React.Fragment key={p.id}>
                  <div 
                    draggable 
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragEnter={(e) => onDragEnter(e, idx)}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    className="group relative w-[130px] flex flex-col cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform"
                  >
                    <div className="relative aspect-[1/1.3] bg-muted border-2 border-border rounded-lg overflow-hidden flex items-center justify-center">
                      {p.thumb ? (
                        <img src={p.thumb} alt={`Page ${p.pageIndex + 1}`} className="w-full h-full object-contain bg-white" />
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                          <RefreshCw className="w-3 h-3 animate-spin" /> rendering...
                        </span>
                      )}
                      
                      <button 
                        onClick={() => removePage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                        title="Remove page"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground px-1">
                      <span className="truncate max-w-[80px]" title={p.fileName}>{p.fileName.replace(/\.pdf$/i, '')}</span>
                      <span className="font-mono bg-muted px-1 rounded">p.{p.pageIndex + 1}</span>
                    </div>
                  </div>

                  {/* The gap/split marker between pages */}
                  {idx < pages.length - 1 && (
                    <div className="w-8 flex items-center justify-center relative shrink-0">
                      {p.splitAfter && (
                        <div className="absolute inset-y-0 w-px border-l-2 border-dashed border-destructive/50" />
                      )}
                      <button 
                        onClick={() => toggleSplit(idx)}
                        className={`z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          p.splitAfter 
                            ? 'bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/90 scale-110' 
                            : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-primary opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 hover:scale-110'
                        }`}
                        title={p.splitAfter ? "Remove split" : "Split PDF here"}
                      >
                        {p.splitAfter ? <X className="w-3 h-3" /> : <Scissors className="w-3 h-3" />}
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground/70 bg-muted/50 p-4 rounded-xl border border-border">
            <strong className="text-foreground">Privacy Note:</strong> Reordering and splitting happen entirely with JavaScript running in your browser. If you mark one or more splits, exporting produces multiple files and your browser may ask permission to allow several downloads at once. Your PDFs never leave your device.
          </div>
        </div>
      )}

      {/* Render Feedback Modal on export */}
      <AnimatePresence>
        {showFeedback && (
          <FeedbackModal onProceed={executeExport} onClose={() => setShowFeedback(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
