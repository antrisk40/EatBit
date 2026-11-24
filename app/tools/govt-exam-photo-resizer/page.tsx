"use client";

import React, { useState, useRef, useEffect, useCallback, ChangeEvent, DragEvent } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  RefreshCcw,
  Download,
  UploadCloud,
  CheckCircle2,
  Sliders,
  Sparkles,
  Calendar,
  ShieldCheck,
  Zap,
  ChevronDown,
  ArrowRight,
  FileImage,
} from "lucide-react";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";
import AdBanner from "@/components/AdBanner";
import { trackEvent, trackDownload } from "@/lib/analytics";

// ── Types & Exam Presets ──────────────────────────────────────────────────────

type ExamGroup = "SSC" | "UPSC" | "Banking" | "Medical/Engg" | "Railway/ID" | "Custom";

interface ExamPreset {
  id: string;
  group: ExamGroup;
  name: string;
  kind: "Photo" | "Signature" | "Document";
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  note: string;
}

const EXAM_PRESETS: ExamPreset[] = [
  {
    id: "ssc-photo",
    group: "SSC",
    name: "SSC Photo",
    kind: "Photo",
    width: 165,
    height: 215,
    minKB: 20,
    maxKB: 50,
    note: "SSC CGL, CHSL, MTS, GD (3.5×4.5 cm, 20–50 KB)",
  },
  {
    id: "ssc-sign",
    group: "SSC",
    name: "SSC Signature",
    kind: "Signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    note: "SSC CGL, CHSL, MTS, GD (4×2 cm, 10–20 KB)",
  },
  {
    id: "upsc-photo",
    group: "UPSC",
    name: "UPSC Photo",
    kind: "Photo",
    width: 400,
    height: 400,
    minKB: 20,
    maxKB: 300,
    note: "UPSC CSE, NDA, CDS (min 350×350 px, 20–300 KB)",
  },
  {
    id: "upsc-sign",
    group: "UPSC",
    name: "UPSC Signature",
    kind: "Signature",
    width: 400,
    height: 200,
    minKB: 20,
    maxKB: 300,
    note: "UPSC CSE, NDA, CDS (min 350×350 px / 2:1, 20–300 KB)",
  },
  {
    id: "ibps-photo",
    group: "Banking",
    name: "IBPS / SBI Photo",
    kind: "Photo",
    width: 200,
    height: 230,
    minKB: 20,
    maxKB: 50,
    note: "IBPS PO, Clerk, SBI PO, RBI (200×230 px, 20–50 KB)",
  },
  {
    id: "ibps-sign",
    group: "Banking",
    name: "IBPS / SBI Signature",
    kind: "Signature",
    width: 140,
    height: 60,
    minKB: 10,
    maxKB: 20,
    note: "IBPS PO, Clerk, SBI PO (140×60 px, 10–20 KB)",
  },
  {
    id: "ibps-thumb",
    group: "Banking",
    name: "IBPS Thumb Impression",
    kind: "Document",
    width: 240,
    height: 240,
    minKB: 20,
    maxKB: 50,
    note: "Left Thumb Impression (240×240 px, 20–50 KB)",
  },
  {
    id: "ibps-decl",
    group: "Banking",
    name: "IBPS Declaration",
    kind: "Document",
    width: 800,
    height: 400,
    minKB: 50,
    maxKB: 100,
    note: "Handwritten Declaration (800×400 px, 50–100 KB)",
  },
  {
    id: "neet-passport",
    group: "Medical/Engg",
    name: "NEET / JEE Passport",
    kind: "Photo",
    width: 200,
    height: 230,
    minKB: 10,
    maxKB: 200,
    note: "NTA NEET UG & JEE Main Passport Photo (10–200 KB)",
  },
  {
    id: "neet-postcard",
    group: "Medical/Engg",
    name: "NEET 4×6\" Postcard",
    kind: "Photo",
    width: 400,
    height: 600,
    minKB: 10,
    maxKB: 200,
    note: "NTA NEET UG 4×6 inch Postcard Size (10–200 KB)",
  },
  {
    id: "neet-sign",
    group: "Medical/Engg",
    name: "NEET / JEE Signature",
    kind: "Signature",
    width: 200,
    height: 100,
    minKB: 4,
    maxKB: 30,
    note: "NTA NEET UG & JEE Main Signature (4–30 KB)",
  },
  {
    id: "rrb-photo",
    group: "Railway/ID",
    name: "RRB / Railway Photo",
    kind: "Photo",
    width: 240,
    height: 320,
    minKB: 20,
    maxKB: 50,
    note: "RRB NTPC, Group D, ALP (35×45 mm, 20–50 KB)",
  },
  {
    id: "pan-photo",
    group: "Railway/ID",
    name: "PAN Card Photo",
    kind: "Photo",
    width: 213,
    height: 213,
    minKB: 10,
    maxKB: 50,
    note: "NSDL / UTIITSL PAN Card (2.5×3.5 cm / 213×213 px, <50 KB)",
  },
  {
    id: "pan-sign",
    group: "Railway/ID",
    name: "PAN Card Signature",
    kind: "Signature",
    width: 400,
    height: 200,
    minKB: 10,
    maxKB: 50,
    note: "NSDL / UTIITSL PAN Signature (2×4.5 cm, <50 KB)",
  },
  {
    id: "custom",
    group: "Custom",
    name: "Custom Size",
    kind: "Photo",
    width: 300,
    height: 350,
    minKB: 20,
    maxKB: 100,
    note: "Enter your own exact width, height & KB range",
  },
];

const EXAM_GROUPS: ExamGroup[] = ["SSC", "UPSC", "Banking", "Medical/Engg", "Railway/ID", "Custom"];

const FAQS = [
  {
    q: "How do I resize a photo and signature for SSC, UPSC, or IBPS forms?",
    a: "Pick your exam preset (for example SSC Photo 165×215 px or IBPS Signature 140×60 px), upload your photo or signature, align it inside the frame, and download. EatBit automatically adjusts JPEG compression so your file lands squarely inside the required KB limit.",
  },
  {
    q: "How does this tool hit the exact KB limit (like 20 KB to 50 KB)?",
    a: "The tool runs a binary search over JPEG quality settings inside your browser until the generated image fits safely inside your exam's minimum and maximum KB bounds. If a crisp white-background signature is naturally smaller than the minimum KB, it safely appends a compliant JPEG metadata comment so portals won't reject it for being too small.",
  },
  {
    q: "Can I add my Name and Date of Photo (DOP) for SSC or state exams?",
    a: "Yes. Turn on the 'Add Name & Date on Photo' toggle in the controls panel, type your name and photo date, and EatBit automatically renders a clean white strip with bold black text at the bottom of your passport photo.",
  },
  {
    q: "Is my photo or signature uploaded to any server?",
    a: "No. Everything runs 100% inside your browser using the HTML5 Canvas API. Your photo, signature, thumb impression, and personal details never leave your phone or computer.",
  },
  {
    q: "My phone photo of my signature looks grey/shadowy. Can EatBit clean it?",
    a: "Yes. Enable the 'Clean White Paper Background' toggle when editing a signature or handwritten declaration. It boosts contrast and brightens off-white shadows so the paper looks crisp white and the ink stands out clearly.",
  },
  {
    q: "What image formats can I upload, and what format do I get?",
    a: "You can upload JPG, JPEG, PNG, or WebP images from your phone gallery or computer. The exported file is always standard baseline JPEG (.jpg), which is mandatory across nearly all Indian government exam portals.",
  },
  {
    q: "Will resizing reduce my face clarity or make the photo blurry?",
    a: "No. EatBit picks the highest possible JPEG quality allowed within your exam's maximum KB limit (for example aiming near 42–46 KB for a 50 KB limit) so your face remains as sharp as possible.",
  },
  {
    q: "Can I use custom width, height, and KB limits for other state PSC or college exams?",
    a: "Yes. Choose the 'Custom Size' tab to enter any pixel width, pixel height, minimum KB, and maximum KB required by your state PSC, university portal, or scholarship form.",
  },
];

// ── Canvas & KB Targeting Helpers ─────────────────────────────────────────────

function formatTodayDDMMYYYY(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/jpeg",
      quality
    );
  });
}

/**
 * Safely lifts a valid JPEG blob's size to at least `minBytes` by inserting a standard
 * JPEG Comment (0xFF 0xFE) segment immediately after the initial APP0/SOI header,
 * keeping the JFIF magic header completely untouched.
 */
async function padJpegToMinBytes(blob: Blob, minBytes: number): Promise<Blob> {
  if (blob.size >= minBytes) return blob;
  const buf = new Uint8Array(await blob.arrayBuffer());
  // Ensure valid JPEG SOI + segment marker
  if (buf.length < 6 || buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) {
    return blob;
  }

  // Insert right after the first marker segment (usually APP0/JFIF at offset 2)
  const firstSegLen = (buf[4] << 8) | buf[5];
  const insertAt = 4 + firstSegLen;
  if (insertAt >= buf.length) return blob;

  let remainingNeeded = minBytes - buf.length;
  const extraChunks: Uint8Array[] = [];

  while (remainingNeeded > 0) {
    // Each COM segment adds (4 + payloadLen) bytes total
    const chunkTotal = Math.min(remainingNeeded, 65530);
    const payloadLen = Math.max(0, chunkTotal - 4);
    const segLen = payloadLen + 2;
    const seg = new Uint8Array(4 + payloadLen);
    seg[0] = 0xff;
    seg[1] = 0xfe;
    seg[2] = (segLen >> 8) & 0xff;
    seg[3] = segLen & 0xff;
    seg.fill(0x20, 4);
    extraChunks.push(seg);
    remainingNeeded -= seg.length;
  }

  const head = buf.slice(0, insertAt);
  const tail = buf.slice(insertAt);
  const parts: BlobPart[] = [head, ...extraChunks.map((c) => c as BlobPart), tail];
  return new Blob(parts, { type: "image/jpeg" });
}

/**
 * Encodes canvas to JPEG targeting `[minKB, maxKB]` via binary search on quality.
 */
async function compressCanvasToTargetKB(
  canvas: HTMLCanvasElement,
  minKB: number,
  maxKB: number
): Promise<Blob> {
  const minBytes = Math.max(0, minKB * 1024);
  const maxBytes = Math.max(minBytes + 1024, maxKB * 1024);
  // Target ~88% of maxBytes for high quality with safety headroom below portal limit
  const idealBytes = Math.min(maxBytes - 512, Math.round(maxBytes * 0.88));

  // First check max quality
  const highBlob = await canvasToBlob(canvas, 0.98);
  if (highBlob.size <= maxBytes) {
    if (highBlob.size < minBytes) {
      return padJpegToMinBytes(highBlob, minBytes);
    }
    return highBlob;
  }

  // Binary search quality between 0.05 and 0.97
  let lo = 0.05;
  let hi = 0.97;
  let bestBlob: Blob = await canvasToBlob(canvas, lo);

  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const candidate = await canvasToBlob(canvas, mid);
    if (candidate.size <= maxBytes) {
      bestBlob = candidate;
      if (candidate.size >= idealBytes) break;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  if (bestBlob.size < minBytes) {
    return padJpegToMinBytes(bestBlob, minBytes);
  }
  return bestBlob;
}

/**
 * Enhances a cropped signature/declaration canvas (cleans shadowy paper to pure white)
 * and optionally stamps Name & Date strip for passport photos.
 */
function buildProcessedCanvas(
  sourceCanvas: HTMLCanvasElement,
  targetW: number,
  targetH: number,
  options: {
    cleanSignature: boolean;
    addNameDate: boolean;
    applicantName: string;
    photoDate: string;
  }
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d");
  if (!ctx) return sourceCanvas;

  // White base prevents black transparent corners on JPEG conversion
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);

  const stripH = options.addNameDate ? Math.max(28, Math.round(targetH * 0.18)) : 0;
  const drawH = targetH - stripH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, targetW, drawH);

  // Clean shadowy paper on signatures/documents
  if (options.cleanSignature) {
    const imgData = ctx.getImageData(0, 0, targetW, drawH);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      if (lum > 165) {
        d[i] = 255;
        d[i + 1] = 255;
        d[i + 2] = 255;
      } else {
        // Darken ink strokes
        d[i] = Math.max(0, Math.round(d[i] * 0.7));
        d[i + 1] = Math.max(0, Math.round(d[i + 1] * 0.7));
        d[i + 2] = Math.max(0, Math.round(d[i + 2] * 0.7));
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // Draw crisp Name & Date strip at bottom
  if (options.addNameDate) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, drawH, targetW, stripH);

    // Subtle divider line
    ctx.strokeStyle = "#d4d4d8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, drawH);
    ctx.lineTo(targetW, drawH);
    ctx.stroke();

    const nameText = (options.applicantName || "YOUR NAME").trim().toUpperCase();
    const dateText = `DOP: ${(options.photoDate || formatTodayDDMMYYYY()).trim()}`;

    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let fontSize = Math.max(9, Math.round(stripH * 0.36));
    ctx.font = `700 ${fontSize}px Arial, sans-serif`;
    while (ctx.measureText(nameText).width > targetW - 10 && fontSize > 7) {
      fontSize -= 1;
      ctx.font = `700 ${fontSize}px Arial, sans-serif`;
    }

    const line1Y = drawH + Math.round(stripH * 0.34);
    const line2Y = drawH + Math.round(stripH * 0.72);
    ctx.fillText(nameText, targetW / 2, line1Y);

    const dateFont = Math.max(7, fontSize - 1);
    ctx.font = `600 ${dateFont}px Arial, sans-serif`;
    ctx.fillText(dateText, targetW / 2, line2Y);
  }

  return out;
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function GovtExamPhotoResizerPage() {
  const [activeGroup, setActiveGroup] = useState<ExamGroup>("SSC");
  const [selectedPreset, setSelectedPreset] = useState<ExamPreset>(EXAM_PRESETS[0]);

  // Custom dimensions
  const [customW, setCustomW] = useState(300);
  const [customH, setCustomH] = useState(350);
  const [customMinKB, setCustomMinKB] = useState(20);
  const [customMaxKB, setCustomMaxKB] = useState(100);

  // Image & cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Exam enhancements
  const [addNameDate, setAddNameDate] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [photoDate, setPhotoDate] = useState(formatTodayDDMMYYYY);
  const [cleanSignature, setCleanSignature] = useState(false);

  // Live preview output
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputKB, setOutputKB] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetW = selectedPreset.id === "custom" ? Math.max(50, customW) : selectedPreset.width;
  const targetH = selectedPreset.id === "custom" ? Math.max(50, customH) : selectedPreset.height;
  const minKB = selectedPreset.id === "custom" ? Math.max(1, customMinKB) : selectedPreset.minKB;
  const maxKB = selectedPreset.id === "custom" ? Math.max(minKB + 1, customMaxKB) : selectedPreset.maxKB;
  const aspectRatio = targetW / targetH;

  // Generate compressed preview from current crop state
  const updatePreview = useCallback(() => {
    if (!cropperRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!cropperRef.current) return;
      setGenerating(true);
      try {
        const raw = cropperRef.current.getCroppedCanvas({
          width: targetW,
          height: targetH,
          fillColor: "#ffffff",
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });
        if (!raw) return;

        const processed = buildProcessedCanvas(raw, targetW, targetH, {
          cleanSignature,
          addNameDate: selectedPreset.kind === "Photo" && addNameDate,
          applicantName,
          photoDate,
        });

        const blob = await compressCanvasToTargetKB(processed, minKB, maxKB);
        const nextUrl = URL.createObjectURL(blob);

        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
        setOutputBlob(blob);
        setOutputKB(Number((blob.size / 1024).toFixed(1)));
      } catch (e) {
        console.error(e);
      } finally {
        setGenerating(false);
      }
    }, 180);
  }, [targetW, targetH, minKB, maxKB, cleanSignature, addNameDate, applicantName, photoDate, selectedPreset.kind]);

  // Mount CropperJS when image loads
  useEffect(() => {
    if (imageSrc && imageRef.current) {
      if (cropperRef.current) cropperRef.current.destroy();
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio,
        viewMode: 1,
        autoCropArea: 0.9,
        background: false,
        responsive: true,
        ready: () => updatePreview(),
        cropend: () => updatePreview(),
        zoom: () => updatePreview(),
      });
    }
    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  // Sync aspect ratio & re-render preview when preset/options change
  useEffect(() => {
    if (cropperRef.current) {
      cropperRef.current.setAspectRatio(aspectRatio);
      updatePreview();
    }
  }, [aspectRatio, updatePreview]);

  // Revoke preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Apply ?preset= deep link on mount (e.g. ?preset=ssc-photo or ?preset=upsc-photo)
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("preset");
    if (!param) return;
    const matched = EXAM_PRESETS.find((p) => p.id === param);
    if (matched) {
      setActiveGroup(matched.group);
      setSelectedPreset(matched);
      setCleanSignature(matched.kind === "Signature" || matched.kind === "Document");
      if (matched.kind !== "Photo") setAddNameDate(false);
    }
  }, []);

  const handleSelectPreset = (preset: ExamPreset) => {
    setSelectedPreset(preset);
    setCleanSignature(preset.kind === "Signature" || preset.kind === "Document");
    if (preset.kind !== "Photo") setAddNameDate(false);
    trackEvent("click", { event_label: "exam_preset", preset_id: preset.id });
  };

  const loadFile = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    trackEvent("tool_upload", { file_count: 1, file_kinds: "image", preset: selectedPreset.id });
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setImageSrc(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadFile(e.target.files[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) loadFile(e.dataTransfer.files[0]);
  };

  const handleDownload = () => {
    if (!outputBlob) return;
    const filename = `${selectedPreset.id}-${targetW}x${targetH}.jpg`;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    trackDownload(filename, { download_type: "single", file_kind: "image" });
    trackEvent("tool_process_complete", { file_kind: "image", preset: selectedPreset.id });
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const groupPresets = EXAM_PRESETS.filter((p) => p.group === activeGroup);
  const meetsRange = outputKB !== null && outputKB >= minKB && outputKB <= maxKB;

  const JSON_LD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EatBit Government Exam Photo & Signature Resizer",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Resize and compress passport photos, signatures, and thumb impressions for SSC, UPSC, IBPS, SBI, NEET, JEE, RRB, and PAN Card forms directly in your browser. Zero server uploads.",
    url: "https://eatbit.in/tools/govt-exam-photo-resizer",
  };

  const FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      {/* ── HERO + WORKSPACE ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border" id="tool">
        <div className="absolute inset-0 z-0 opacity-[0.06] bg-[radial-gradient(#EA8C32_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 min-w-0 space-y-6">

              {/* Hero Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted border border-border font-bold text-[10px] mb-5 uppercase tracking-wider text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  100% Free · No Upload · Exact KB Size · SSC, UPSC, IBPS, NEET
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                  <span className="text-primary">Govt Exam</span> Photo &amp; Signature{" "}
                  <span className="text-foreground">Resizer</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-4">
                  Crop and compress photos, signatures, and declarations to exact pixel dimensions and KB limits for{" "}
                  <strong className="text-foreground">SSC, UPSC, IBPS, SBI, NEET, JEE, RRB &amp; PAN</strong> forms. Files never leave your device.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {["Auto Exact KB Limit", "Name & Date Strip (SSC)", "Clean Signature Ink", "Zero Server Upload"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Step 1: Exam Preset Selector */}
              <div className="border border-border bg-background p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary" /> 1. Select Exam &amp; Document Type
                  </h2>
                  <span className="text-xs font-mono text-primary font-semibold">
                    {targetW}×{targetH} px · {minKB}–{maxKB} KB (.jpg)
                  </span>
                </div>

                {/* Exam Group Tabs */}
                <div className="flex flex-wrap gap-2">
                  {EXAM_GROUPS.map((grp) => (
                    <button
                      key={grp}
                      onClick={() => {
                        setActiveGroup(grp);
                        const first = EXAM_PRESETS.find((p) => p.group === grp);
                        if (first) handleSelectPreset(first);
                      }}
                      className={`px-3 py-1.5 text-xs font-bold border transition-all ${
                        activeGroup === grp
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {grp}
                    </button>
                  ))}
                </div>

                {/* Presets inside Selected Group */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {groupPresets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-3 border text-left transition-all ${
                        selectedPreset.id === p.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-sm text-foreground">{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-muted border border-border text-muted-foreground font-mono">
                          {p.kind}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.id === "custom" ? "Custom dimensions & KB" : `${p.width}×${p.height} px · ${p.minKB}–${p.maxKB} KB`}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Custom Inputs */}
                {selectedPreset.id === "custom" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">Width (px)</label>
                      <input
                        type="number"
                        min={50}
                        max={2000}
                        value={customW}
                        onChange={(e) => setCustomW(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">Height (px)</label>
                      <input
                        type="number"
                        min={50}
                        max={2000}
                        value={customH}
                        onChange={(e) => setCustomH(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">Min Size (KB)</label>
                      <input
                        type="number"
                        min={1}
                        max={1000}
                        value={customMinKB}
                        onChange={(e) => setCustomMinKB(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground mb-1">Max Size (KB)</label>
                      <input
                        type="number"
                        min={2}
                        max={2000}
                        value={customMaxKB}
                        onChange={(e) => setCustomMaxKB(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border text-sm text-foreground"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{selectedPreset.note}</span>
                </p>
              </div>

              {/* Step 2: Upload Zone or Interactive Crop Workspace */}
              {!imageSrc ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <UploadCloud className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground mb-1">
                        Upload {selectedPreset.kind} ({selectedPreset.name})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Drag &amp; drop or <span className="text-primary font-semibold underline underline-offset-4">browse file</span> (JPG, PNG, WebP)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Crop Canvas */}
                  <div className="xl:col-span-7 border border-border bg-background p-4 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        2. Align &amp; Crop ({targetW}×{targetH} ratio locked)
                      </h3>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Change Photo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="relative h-[360px] w-full bg-muted/40 overflow-hidden border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={imageRef} src={imageSrc} alt="Crop workspace" className="max-w-full block" />
                    </div>

                    {/* Crop toolbar */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => cropperRef.current?.zoom(0.1)}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5" /> Zoom In
                      </button>
                      <button
                        onClick={() => cropperRef.current?.zoom(-0.1)}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
                      </button>
                      <button
                        onClick={() => { cropperRef.current?.rotate(-90); updatePreview(); }}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Rotate left"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> -90°
                      </button>
                      <button
                        onClick={() => { cropperRef.current?.rotate(90); updatePreview(); }}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Rotate right"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> +90°
                      </button>
                      <button
                        onClick={() => {
                          if (!cropperRef.current) return;
                          const data = cropperRef.current.getData();
                          cropperRef.current.scaleX((data.scaleX || 1) * -1);
                          updatePreview();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Flip horizontally"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" /> Flip
                      </button>
                      <button
                        onClick={() => { cropperRef.current?.reset(); updatePreview(); }}
                        className="px-3 py-1.5 text-xs font-semibold border border-border bg-card hover:border-primary/40 flex items-center gap-1"
                        title="Reset crop"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                  </div>

                  {/* Enhancements + Live Output Preview */}
                  <div className="xl:col-span-5 border border-border bg-background p-5 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        3. Exam Formatting &amp; Export
                      </h3>

                      {/* Name & Date toggle (for Photos) */}
                      {selectedPreset.kind === "Photo" && (
                        <div className="border border-border bg-card p-3.5 space-y-3">
                          <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-xs font-bold text-foreground flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-primary" /> Add Name &amp; Date Strip (SSC Format)
                            </span>
                            <input
                              type="checkbox"
                              checked={addNameDate}
                              onChange={(e) => setAddNameDate(e.target.checked)}
                              className="accent-primary w-4 h-4"
                            />
                          </label>
                          {addNameDate && (
                            <div className="grid grid-cols-1 gap-2 pt-1">
                              <input
                                type="text"
                                placeholder="Full Name (e.g. RAHUL SHARMA)"
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-background border border-border text-foreground uppercase"
                              />
                              <input
                                type="text"
                                placeholder="Date of Photo (DD-MM-YYYY)"
                                value={photoDate}
                                onChange={(e) => setPhotoDate(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs bg-background border border-border text-foreground"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Clean Signature toggle */}
                      <div className="border border-border bg-card p-3.5">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <span className="text-xs font-bold text-foreground flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-primary" /> Clean White Paper Background
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Recommended for phone photos of signatures &amp; declarations
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={cleanSignature}
                            onChange={(e) => setCleanSignature(e.target.checked)}
                            className="accent-primary w-4 h-4 shrink-0"
                          />
                        </label>
                      </div>

                      {/* Output Preview Box */}
                      <div className="border border-primary/25 bg-primary/5 p-4 text-center space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Final Export Preview</span>
                          {outputKB !== null && (
                            <span
                              className={`px-2 py-0.5 font-bold text-[11px] border ${
                                meetsRange
                                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                                  : "bg-primary/15 text-primary border-primary/30"
                              }`}
                            >
                              {outputKB} KB {meetsRange ? "✓ Ready" : ""}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-center items-center min-h-[140px] bg-card border border-border p-3">
                          {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previewUrl}
                              alt="Final compressed exam preview"
                              className="max-h-[170px] max-w-full object-contain border border-border shadow-sm"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">Generating preview…</span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground font-mono">
                          <div className="bg-card border border-border py-1.5">
                            {targetW}×{targetH} px
                          </div>
                          <div className="bg-card border border-border py-1.5">
                            Target: {minKB}–{maxKB} KB
                          </div>
                          <div className="bg-card border border-border py-1.5">
                            Format: JPG
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDownload}
                      disabled={!outputBlob || generating}
                      className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      {generating ? "Optimizing KB Size…" : `Download ${selectedPreset.kind} (.jpg)`}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                100% browser-based processing &mdash; your personal photos and documents stay strictly on your device.
              </p>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 shrink-0 self-start">
              <OtherToolsSidebar />
            </div>
          </div>
        </div>
      </section>

      {/* ── EXAM SPECIFICATIONS REFERENCE TABLE ────────────────────────────── */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              Official Indian Govt Exam <span className="text-primary">Photo &amp; Signature Specs</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Quick reference guide for the most common government recruitment and entrance examinations. Select any preset above to match these rules automatically.
            </p>
          </motion.div>

          <div className="overflow-x-auto border border-border bg-card">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border bg-muted/60 text-foreground">
                  <th className="px-5 py-3.5 font-bold">Exam / Portal</th>
                  <th className="px-5 py-3.5 font-bold">Document</th>
                  <th className="px-5 py-3.5 font-bold">Dimensions</th>
                  <th className="px-5 py-3.5 font-bold">File Size (KB)</th>
                  <th className="px-5 py-3.5 font-bold text-right">Quick Launch</th>
                </tr>
              </thead>
              <tbody>
                {EXAM_PRESETS.filter((p) => p.id !== "custom").map((p, idx) => (
                  <tr key={p.id} className={`border-b border-border/60 ${idx % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
                    <td className="px-5 py-3 font-semibold text-foreground">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.kind}</td>
                    <td className="px-5 py-3 font-mono text-xs text-foreground">{p.width} × {p.height} px</td>
                    <td className="px-5 py-3 font-mono text-xs text-primary font-bold">{p.minKB} KB – {p.maxKB} KB</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => {
                          setActiveGroup(p.group);
                          handleSelectPreset(p);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-primary hover:underline underline-offset-2 cursor-pointer"
                      >
                        Use Preset →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exam-specific SEO guides */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-border bg-card p-6 space-y-3">
              <h3 className="text-base font-extrabold text-foreground">SSC Exam Image Cropper Rules</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For <strong className="text-foreground">SSC CGL, CHSL, MTS, and GD</strong>, passport photos must be <strong className="text-foreground">3.5 × 4.5 cm (165 × 215 px)</strong> and strictly between <strong className="text-foreground">20 KB and 50 KB</strong> in JPEG format. Signatures must be <strong className="text-foreground">4.0 × 2.0 cm (140 × 60 px)</strong> at <strong className="text-foreground">10 KB – 20 KB</strong>. Use our Name &amp; Date toggle if your state exam requires DOP printed on the photo.
              </p>
              <Link href="/blogs/ssc-photo-and-signature-size-guide" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
                Read full SSC rejection checklist <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="border border-border bg-card p-6 space-y-3">
              <h3 className="text-base font-extrabold text-foreground">UPSC Photo &amp; Signature Cropper</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">UPSC CSE, CDS, NDA &amp; OTR</strong> require a square photo between <strong className="text-foreground">350 × 350 px</strong> and 1000 × 1000 px, sized strictly from <strong className="text-foreground">20 KB to 300 KB</strong>. EatBit&apos;s <strong className="text-foreground">400 × 400 px</strong> UPSC preset locks your 1:1 crop frame automatically so your face occupies ~75% of the photo cleanly.
              </p>
              <button
                onClick={() => {
                  const p = EXAM_PRESETS.find((x) => x.id === "upsc-photo");
                  if (p) { setActiveGroup(p.group); handleSelectPreset(p); window.scrollTo({ top: 0, behavior: "smooth" }); }
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Load UPSC Preset <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="border border-border bg-card p-6 space-y-3">
              <h3 className="text-base font-extrabold text-foreground">IBPS, NEET &amp; JEE Photo Resizer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Banking forms (<strong className="text-foreground">IBPS PO, Clerk, SBI</strong>) require <strong className="text-foreground">200 × 230 px (20–50 KB)</strong> photos, <strong className="text-foreground">140 × 60 px (10–20 KB)</strong> signatures, plus left thumb impression and handwritten declaration presets. <strong className="text-foreground">NTA NEET &amp; JEE</strong> support both passport and <strong className="text-foreground">4×6 inch postcard</strong> photos (10–200 KB).
              </p>
              <button
                onClick={() => {
                  const p = EXAM_PRESETS.find((x) => x.id === "ibps-photo");
                  if (p) { setActiveGroup(p.group); handleSelectPreset(p); window.scrollTo({ top: 0, behavior: "smooth" }); }
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Load IBPS Preset <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY EATBIT FOR EXAM FORMS ──────────────────────────────────────── */}
      <section className="bg-card py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-5 h-5 text-green-400" />,
                title: "Safe for Sensitive IDs & Photos",
                desc: "Many websites upload your passport photo, Aadhaar, and signature to unknown remote servers. EatBit processes everything offline inside your browser memory.",
              },
              {
                icon: <Zap className="w-5 h-5 text-yellow-400" />,
                title: "Precision KB Binary Search",
                desc: "Stop guessing percentages in Paint. We automatically search for the highest sharpness quality that lands strictly inside your exam portal's min and max KB limit.",
              },
              {
                icon: <Calendar className="w-5 h-5 text-primary" />,
                title: "1-Click Name & Date (DOP) Strip",
                desc: "Need your name and photo date printed on the white bottom margin for SSC or state PSC forms? Toggle it on without needing Photoshop.",
              },
              {
                icon: <FileImage className="w-5 h-5 text-blue-400" />,
                title: "Shadow-Free Signature Cleaning",
                desc: "Snap a photo of your signature on white paper with your phone, turn on Clean White Paper Background, and get crisp black ink on pure white.",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-background p-6 flex gap-4">
                <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="bg-background py-20 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground mb-3">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-muted/50 transition-colors"
                  aria-expanded={activeFaq === i}
                >
                  <span className="font-semibold text-foreground text-sm pr-4">{faq.q}</span>
                  <motion.span animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-muted-foreground">
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MORE TOOLS ──────────────────────────────────────────────────────── */}
      <section className="bg-card py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-foreground mb-6">
            More Free <span className="text-primary">Exam &amp; Document Tools</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/tools/merge-and-split-pdf", title: "Merge & Split PDF", desc: "Combine marksheets or split certificates into individual PDF pages locally." },
              { href: "/tools/image-converter", title: "Image Converter", desc: "Convert HEIC, PNG, or WebP documents to standard JPEG instantly." },
              { href: "/tools/free-pdf-editor-no-signup", title: "Free PDF Editor", desc: "Sign, annotate, and fill out government PDF forms directly in your browser." },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="group border border-border bg-background p-5 hover:border-primary/40 transition-all">
                <h3 className="font-bold text-foreground text-sm mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary font-semibold">
                  Open tool <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AdBanner slot="tool-bottom" className="mt-0" />
    </>
  );
}
