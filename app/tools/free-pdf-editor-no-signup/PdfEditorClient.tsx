"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer,
  Type,
  RefreshCcw,
  ImageIcon,
  Eraser,
  RotateCw,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  Bold,
  Italic,
  Link,
  Link2Off,
  Replace,
} from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxiwD53rJ9aF0c2E2v0K6wX5w8x9z7A2y_5/exec";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type ToolType = "select" | "text" | "image" | "whiteout";
type FontFamily = string; // open string so any registered font key works

interface WhiteoutEdit {
  id: number;
  kind: "whiteout";
  left: number;
  top: number;
  width: number;
  height: number;
  fillColor?: string; // defaults to white; auto-filled from sampled canvas bg
}

interface TextEdit {
  id: number;
  kind: "text";
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  font: FontFamily;
  bold: boolean;
  italic: boolean;
  link?: string; // optional hyperlink
  text: string;
  baselinePx?: number;
  letterSpacing?: number;
}

interface ImageEdit {
  id: number;
  kind: "image";
  left: number;
  top: number;
  width: number;
  height: number;
  dataUrl: string;
  mime: string;
}

// Link annotation from the PDF (read-only, preserved in export)
interface LinkAnnotation {
  url: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

type EditItem = WhiteoutEdit | TextEdit | ImageEdit;

interface PageMeta {
  rotation: number;
  deleted: boolean;
  thumb: string | null;
}

// ─── FONT REGISTRY ────────────────────────────────────────────────────────────
// Each entry defines: key (used in state), label (shown in UI), css (browser preview),
// and the 4 pdf-lib StandardFont names for regular/bold/italic/boldItalic.
interface FontEntry {
  key: string;
  label: string;
  group: string;
  css: string;
  pdflib: string;
  pdflibBold: string;
  pdflibItalic: string;
  pdflibBoldItalic: string;
  googleFont?: string; // Google Fonts family name for the <link> tag
}

const FONT_REGISTRY: FontEntry[] = [
  // ── Sans-serif ─────────────────────────────────────────────────────────────
  { key:"Arial",            label:"Arial (Liberation Sans)",  group:"Sans-Serif",  css:"Arial, 'Liberation Sans', sans-serif",             pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Arimo",            label:"Arimo",                    group:"Sans-Serif",  css:"'Arimo', sans-serif",                              pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"DejaVuSans",       label:"DejaVu Sans (Verdana)",    group:"Sans-Serif",  css:"'DejaVu Sans Local', Verdana, sans-serif",         pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"FiraSans",         label:"Fira Sans (Trebuchet MS)", group:"Sans-Serif",  css:"'Fira Sans', 'Trebuchet MS', sans-serif",          pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Helvetica",        label:"Helvetica",                group:"Sans-Serif",  css:"Helvetica, Arial, sans-serif",                     pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Inter",            label:"Inter",                    group:"Sans-Serif",  css:"'Inter', sans-serif",                              pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Lato",             label:"Lato",                     group:"Sans-Serif",  css:"'Lato', sans-serif",                               pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"LiberationSans",   label:"Liberation Sans",          group:"Sans-Serif",  css:"'Liberation Sans', Arial, sans-serif",             pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"NotoSans",         label:"Noto Sans",                group:"Sans-Serif",  css:"'Noto Sans', sans-serif",                          pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"NotoSansChakma",   label:"Noto Sans Chakma",         group:"Sans-Serif",  css:"'Noto Sans Chakma', sans-serif",                   pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"OpenSans",         label:"Open Sans",                group:"Sans-Serif",  css:"'Open Sans', sans-serif",                          pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"OpenSansCond",     label:"Open Sans Condensed",      group:"Sans-Serif",  css:"'Open Sans Condensed', sans-serif",                 pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Poppins",          label:"Poppins",                  group:"Sans-Serif",  css:"'Poppins', sans-serif",                            pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"PTSans",           label:"PT Sans",                  group:"Sans-Serif",  css:"'PT Sans', sans-serif",                            pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"PTSansCaption",    label:"PT Sans Caption",          group:"Sans-Serif",  css:"'PT Sans Caption', sans-serif",                    pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"PTSansNarrow",     label:"PT Sans Narrow",           group:"Sans-Serif",  css:"'PT Sans Narrow', sans-serif",                     pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Roboto",           label:"Roboto",                   group:"Sans-Serif",  css:"'Roboto', sans-serif",                             pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  // ── Serif ──────────────────────────────────────────────────────────────────
  { key:"Amiri",            label:"Amiri (Arabic)",           group:"Serif",       css:"'Amiri', serif",                                   pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"Caladea",          label:"Caladea (Cambria)",        group:"Serif",       css:"'Caladea', serif",                                 pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"Carlito",          label:"Carlito (Calibri)",        group:"Serif",       css:"'Carlito', sans-serif",                            pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"DejaVuSerif",      label:"DejaVu Serif (Georgia)",   group:"Serif",       css:"'DejaVu Serif Local', Georgia, serif",             pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"DroidSerif",       label:"Droid Serif",              group:"Serif",       css:"'Noto Serif', 'PT Serif', serif",                  pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"EBGaramond",       label:"EB Garamond",              group:"Serif",       css:"'EB Garamond', serif",                             pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"LiberationSerif",  label:"Liberation Serif",         group:"Serif",       css:"'Liberation Serif Local', serif",                  pdflib:"LiberationSerif",       pdflibBold:"LiberationSerifBold",       pdflibItalic:"LiberationSerifItalic",        pdflibBoldItalic:"LiberationSerifBoldItalic" },
  { key:"NotoSerif",        label:"Noto Serif",               group:"Serif",       css:"'Noto Serif', serif",                              pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"NotoSerifTamil",   label:"Noto Serif Tamil",         group:"Serif",       css:"'Noto Serif Tamil', serif",                        pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"Oranienbaum",      label:"Oranienbaum",              group:"Serif",       css:"'Oranienbaum', serif",                             pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"PTSerif",          label:"PT Serif",                 group:"Serif",       css:"'PT Serif', serif",                                pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"PTSerifCaption",   label:"PT Serif Caption",         group:"Serif",       css:"'PT Serif Caption', serif",                        pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"ScheherazadeNew",  label:"Scheherazade New (Arabic)",group:"Serif",       css:"'Scheherazade New', serif",                        pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  { key:"Selawik",          label:"Selawik (Segoe UI)",       group:"Serif",       css:"'Open Sans', 'Segoe UI', sans-serif",              pdflib:"Helvetica",             pdflibBold:"HelveticaBold",             pdflibItalic:"HelveticaOblique",             pdflibBoldItalic:"HelveticaBoldOblique" },
  { key:"Times",            label:"Times New Roman",          group:"Serif",       css:"'Times New Roman', Times, serif",                  pdflib:"TimesRoman",            pdflibBold:"TimesRomanBold",            pdflibItalic:"TimesRomanItalic",             pdflibBoldItalic:"TimesRomanBoldItalic" },
  // ── Monospace ──────────────────────────────────────────────────────────────
  { key:"Courier",          label:"Courier New",              group:"Monospace",   css:"'Courier New', Courier, monospace",                pdflib:"Courier",               pdflibBold:"CourierBold",               pdflibItalic:"CourierOblique",               pdflibBoldItalic:"CourierBoldOblique" },
  { key:"LiberationMono",   label:"Liberation Mono",          group:"Monospace",   css:"'Liberation Mono Local', 'Courier New', monospace", pdflib:"Courier",          pdflibBold:"CourierBold",               pdflibItalic:"CourierOblique",               pdflibBoldItalic:"CourierBoldOblique" },
];

// Build a key → entry map for O(1) lookup
const FONT_MAP: Record<string, FontEntry> = Object.fromEntries(FONT_REGISTRY.map((f) => [f.key, f]));


// Helper: CSS font-family string for a given key
function getFontCss(key: string): string {
  return FONT_MAP[key]?.css ?? "Helvetica, sans-serif";
}

// Detect bold/font from pdfjs fontFamily CSS string + commonObjs font metadata
function detectFontTraits(
  fontFamily: string = "",
  rawFontName: string = "",
  fontObj?: any
): { bold: boolean; italic: boolean; font: FontFamily } {
  const cleaned = fontFamily.replace(/["']/g, "").split(",")[0].trim();
  const stripped = cleaned.replace(/^[A-Za-z]{6}\+/, "");
  const rawStripped = rawFontName.replace(/^[A-Za-z]{6}\+/, "");

  // Use fontObj metadata if available (highly accurate)
  const objName = fontObj?.name ? fontObj.name.replace(/^[A-Za-z]{6}\+/, "") : "";
  const objFallback = fontObj?.fallbackName || "";
  const probe = `${stripped} ${rawStripped} ${objName} ${objFallback}`.toLowerCase();

  const bold = fontObj?.black || fontObj?.bold || /bold|heavy|black|semibold|demi/i.test(probe);
  const italic = fontObj?.italic || /italic|oblique|slant|it$/i.test(probe);

  const candidates: Array<[RegExp, string]> = [
    // Monospace
    [/cousine/i,                      "Cousine"],
    [/liberation.?mono/i,             "LiberationMono"],
    [/courier|cour$/i,                "Courier"],
    [/consolas|inconsolata|monaco|lucida.?console/i, "Courier"],
    // Specific sans
    [/noto.?sans.?chakma/i,           "NotoSansChakma"],
    [/noto.?sans/i,                   "NotoSans"],
    [/open.?sans.?cond/i,             "OpenSansCond"],
    [/open.?sans/i,                   "OpenSans"],
    [/fira.?sans/i,                   "FiraSans"],
    [/pt.?sans.?caption/i,            "PTSansCaption"],
    [/pt.?sans.?narrow/i,             "PTSansNarrow"],
    [/pt.?sans/i,                     "PTSans"],
    [/liberation.?sans/i,             "LiberationSans"],
    [/arimo/i,                        "Arimo"],
    [/poppins/i,                      "Poppins"],
    [/roboto/i,                       "Roboto"],
    [/inter(?!national)/i,            "Inter"],
    [/\blato\b/i,                     "Lato"],
    [/verdana/i,                      "Verdana"],
    [/trebuchet/i,                    "FiraSans"],
    [/impact/i,                       "Impact"],
    [/segoe/i,                        "Selawik"],
    [/arial|arialmt|arialnb/i,        "Arial"],
    [/helvetica|helv$/i,              "Helvetica"],
    // Specific serif
    [/charter/i,                      "PTSerif"],
    [/gelasio/i,                      "Gelasio"],
    [/tinos/i,                        "Tinos"],
    [/liberation.?serif/i,            "LiberationSerif"],
    [/noto.?serif.?tamil/i,           "NotoSerifTamil"],
    [/noto.?serif/i,                  "NotoSerif"],
    [/pt.?serif.?caption/i,           "PTSerifCaption"],
    [/pt.?serif/i,                    "PTSerif"],
    [/eb.?garamond|garamond/i,        "EBGaramond"],
    [/oranienbaum/i,                  "Oranienbaum"],
    [/scheherazade/i,                 "ScheherazadeNew"],
    [/amiri/i,                        "Amiri"],
    [/caladea|cambria/i,              "Caladea"],
    [/carlito|calibri/i,              "Carlito"],
    [/droid.?serif/i,                 "DroidSerif"],
    [/dejavu.?serif/i,                "DejaVuSerif"],
    [/dejavu.?sans/i,                 "DejaVuSans"],
    [/georgia/i,                      "Georgia"],
    [/palatino/i,                     "Times"],
    [/times(?!.?new)|timesnewroman|times.?new.?roman/i, "Times"],
  ];

  for (const [re, key] of candidates) {
    if (re.test(probe)) return { bold, italic, font: key };
  }

  if (fontObj?.isMonospace) return { bold, italic, font: "Courier" };
  if (fontObj?.isSerifFont) return { bold, italic, font: "Times" };
  if (/serif/i.test(probe) && !/sans/i.test(probe)) return { bold, italic, font: "Times" };
  return { bold, italic, font: "Helvetica" };
}

// ─── CANVAS COLOR SAMPLING HELPERS ────────────────────────────────────────────────────
function avgColor(data: Uint8ClampedArray): { r: number; g: number; b: number } {
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += 4) { r += data[i]; g += data[i + 1]; b += data[i + 2]; n++; }
  if (!n) return { r: 255, g: 255, b: 255 };
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
/** Sample a strip of pixels from the canvas safely */
function sampleStrip(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number, y: number, w: number, h: number,
): Uint8ClampedArray {
  const cx = Math.max(0, Math.round(x));
  const cy = Math.max(0, Math.round(y));
  const cw = Math.min(Math.max(1, Math.round(w)), canvas.width - cx);
  const ch = Math.min(Math.max(1, Math.round(h)), canvas.height - cy);
  if (cw <= 0 || ch <= 0) return new Uint8ClampedArray(4);
  return ctx.getImageData(cx, cy, cw, ch).data;
}

/** Returns { bgColor, textColor } by sampling canvas pixels around a text hit */
function sampleHitColors(
  canvas: HTMLCanvasElement,
  hit: { left: number; top: number; width: number; fontH: number },
): { bgColor: string; textColor: string } {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { bgColor: "#ffffff", textColor: "#1a1a1a" };

  const { left, top, width, fontH } = hit;

  // ① Sample background: 3-pixel strip ABOVE the text row (no text pixels)
  let bgRgb = { r: 255, g: 255, b: 255 };
  const stripH = 3;
  if (top >= stripH) {
    bgRgb = avgColor(sampleStrip(ctx, canvas, left, top - stripH, width, stripH));
  } else {
    // Try BELOW if no room above
    const belowY = top + fontH + 1;
    bgRgb = avgColor(sampleStrip(ctx, canvas, left, belowY, width, stripH));
  }
  const bgColor = rgbToHex(bgRgb);

  // ② Sample text color: find the pixel that is furthest from the background color
  const textData = sampleStrip(ctx, canvas, left, top, width, Math.max(1, fontH));
  let maxDist = 0;
  let bestR = 26, bestG = 26, bestB = 26; // Default to #1a1a1a
  for (let i = 0; i < textData.length; i += 4) {
    const r = textData[i], g = textData[i + 1], b = textData[i + 2];
    const dist = Math.abs(r - bgRgb.r) + Math.abs(g - bgRgb.g) + Math.abs(b - bgRgb.b);
    if (dist > maxDist) {
      maxDist = dist;
      bestR = r; bestG = g; bestB = b;
    }
  }
  const textColor = maxDist > 30 ? rgbToHex({ r: bestR, g: bestG, b: bestB }) : "#1a1a1a";

  return { bgColor, textColor };
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────
function FeedbackModal({
  onProceed,
  onClose,
}: {
  onProceed: () => void;
  onClose: () => void;
}) {
  const [improvements, setImprovements] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [needsCustom, setNeedsCustom] = useState<"yes" | "no" | "">("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("eatbit_feedback_prefs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.usagePurpose) setUsagePurpose(parsed.usagePurpose);
        if (parsed.needsCustom) setNeedsCustom(parsed.needsCustom);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      localStorage.setItem("eatbit_feedback_prefs", JSON.stringify({ email, usagePurpose, needsCustom }));
    } catch (e) {}

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "Free PDF Editor No Signup",
          email,
          improvements,
          usagePurpose,
          needsCustomSoftware: needsCustom,
          submitted_at: new Date().toISOString(),
        }),
      });
    } catch {
      // no-cors always throws
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(onProceed, 1200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 22 }}
        className="bg-background border border-border w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-foreground text-sm">Your Edited PDF is Ready!</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-bold text-foreground text-lg">Thanks for your feedback!</p>
              <p className="text-sm text-muted-foreground mt-1">Starting your download now…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Before downloading, please take 20 seconds to share your thoughts so we can keep this editor 100% free.
              </p>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  What features would you like next?
                </label>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={2}
                  placeholder="e.g. signature drawing, OCR, form filler…"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 resize-none outline-none focus:border-primary rounded-lg placeholder:text-muted-foreground/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Personal or business?
                </label>
                <select
                  required
                  value={usagePurpose}
                  onChange={(e) => setUsagePurpose(e.target.value)}
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary rounded-lg"
                >
                  <option value="" disabled>Select…</option>
                  <option value="fun">Personal / Fun</option>
                  <option value="school">Student / Academic</option>
                  <option value="business">Work / Business</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Need custom software built?
                </label>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((val) => (
                    <label
                      key={val}
                      className={`flex-1 flex items-center justify-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-all ${
                        needsCustom === val
                          ? "bg-primary/15 border-primary text-primary font-bold"
                          : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="custom_software"
                        value={val}
                        checked={needsCustom === val}
                        onChange={() => setNeedsCustom(val)}
                        className="hidden"
                      />
                      <span className="text-sm capitalize">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                  Your work email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary rounded-lg placeholder:text-muted-foreground/50"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Edited PDF
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── LINK DIALOG ──────────────────────────────────────────────────────────────
function LinkDialog({
  currentUrl,
  onConfirm,
  onRemove,
  onClose,
}: {
  currentUrl?: string;
  onConfirm: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(currentUrl || "https://");
  return (
    <div
      className="absolute left-0 top-[calc(100%+10px)] z-[60] bg-neutral-900/98 border border-neutral-600 rounded-xl shadow-2xl p-3 w-72 text-xs"
      onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-white">Add Link</span>
        <button onClick={onClose} className="text-neutral-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <input
        autoFocus
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary mb-2"
        placeholder="https://example.com"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(url)}
          className="flex-1 bg-primary text-primary-foreground font-bold py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Apply
        </button>
        {currentUrl && (
          <button
            onClick={onRemove}
            className="px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-red-400 hover:border-red-500 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

// ─── IMAGE TOOLBAR ───────────────────────────────────────────────────────────
function ImageToolbar({
  item,
  onReplace,
  onDelete,
}: {
  item: ImageEdit;
  onReplace: () => void;
  onDelete: () => void;
}) {
  const stopDown = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); };
  const isAboveEdge = item.top < 48;
  return (
    <div
      onMouseDown={stopDown}
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        isAboveEdge ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
      } left-0 z-[55] flex items-center gap-1.5 bg-neutral-900/97 border border-neutral-700 rounded-xl shadow-2xl px-2 py-1.5 whitespace-nowrap select-none backdrop-blur-md text-xs`}
    >
      {/* Replace image */}
      <button
        type="button"
        onMouseDown={stopDown}
        onClick={onReplace}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:border-primary hover:bg-neutral-700 transition-all text-xs font-semibold"
        title="Replace image"
      >
        <Replace className="w-3.5 h-3.5" />
        Replace
      </button>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Size display */}
      <span className="text-neutral-500 font-mono text-[10px]">
        {Math.round(item.width)} × {Math.round(item.height)}
      </span>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Delete */}
      <button
        type="button"
        onMouseDown={stopDown}
        onClick={onDelete}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all"
        title="Delete image"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── FLOATING TEXT TOOLBAR ────────────────────────────────────────────────────
function TextToolbar({
  item,
  onUpdate,
  onDelete,
}: {
  item: TextEdit;
  onUpdate: (patch: Partial<TextEdit>) => void;
  onDelete: () => void;
}) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const stopDown = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); };

  const isAboveEdge = item.top < 55;

  return (
    <div
      onMouseDown={stopDown}
      onClick={(e) => e.stopPropagation()}
      className={`absolute ${
        isAboveEdge ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
      } left-0 z-[55] flex flex-wrap items-center gap-1 bg-neutral-900/97 border border-neutral-700 rounded-xl shadow-2xl px-2 py-1.5 whitespace-nowrap select-none backdrop-blur-md text-xs`}
      style={{ minWidth: 340 }}
    >
      {/* Font family — grouped from FONT_REGISTRY */}
      <select
        value={item.font}
        // Only stopPropagation here — NOT preventDefault.
        // preventDefault on mousedown blocks the native browser dropdown from opening.
        onMouseDown={(e) => e.stopPropagation()}
        onChange={(e) => { e.stopPropagation(); onUpdate({ font: e.target.value }); }}
        className="bg-neutral-800 text-white border border-neutral-700 rounded-lg px-2 py-1 text-xs outline-none font-medium cursor-pointer hover:bg-neutral-700 max-w-[160px]"
        style={{ fontFamily: getFontCss(item.font) }}
      >
        {["Sans-Serif", "Serif", "Monospace"].map((group) => (
          <optgroup key={group} label={group}>
            {FONT_REGISTRY.filter((f) => f.group === group).map((f) => (
              <option key={f.key} value={f.key} style={{ fontFamily: f.css }}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {/* Font size */}
      <div className="flex items-center gap-0.5 bg-neutral-800 border border-neutral-700 rounded-lg px-1 py-0.5">
        <button
          type="button"
          onMouseDown={stopDown}
          onClick={() => onUpdate({ fontSize: Math.max(6, item.fontSize - 1) })}
          className="hover:text-amber-400 font-bold px-1 text-neutral-300 text-xs"
        >
          A-
        </button>
        <span className="font-mono text-white text-[11px] font-semibold min-w-[24px] text-center">
          {Math.round(item.fontSize)}
        </span>
        <button
          type="button"
          onMouseDown={stopDown}
          onClick={() => onUpdate({ fontSize: item.fontSize + 1 })}
          className="hover:text-amber-400 font-bold px-1 text-neutral-300 text-xs"
        >
          A+
        </button>
      </div>

      {/* Bold / Italic toggles */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onMouseDown={stopDown}
          onClick={() => onUpdate({ bold: !item.bold })}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
            item.bold
              ? "bg-amber-500 border-amber-400 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white"
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onMouseDown={stopDown}
          onClick={() => onUpdate({ italic: !item.italic })}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
            item.italic
              ? "bg-amber-500 border-amber-400 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white"
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1">
        {["#1a1a1a", "#ef4444", "#2563eb", "#16a34a", "#d97706", "#9333ea", "#ffffff"].map((c) => (
          <button
            key={c}
            type="button"
            onMouseDown={stopDown}
            onClick={() => onUpdate({ color: c })}
            className={`w-4 h-4 rounded-full border transition-transform ${
              item.color === c
                ? "ring-2 ring-amber-400 scale-110 border-white"
                : "border-neutral-500 hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Link button */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={stopDown}
          onClick={() => setShowLinkDialog((v) => !v)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
            item.link
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white"
          }`}
          title={item.link ? `Link: ${item.link}` : "Add hyperlink"}
        >
          {item.link ? <Link className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
        </button>
        {showLinkDialog && (
          <LinkDialog
            currentUrl={item.link}
            onConfirm={(url) => { onUpdate({ link: url }); setShowLinkDialog(false); }}
            onRemove={() => { onUpdate({ link: undefined }); setShowLinkDialog(false); }}
            onClose={() => setShowLinkDialog(false)}
          />
        )}
      </div>

      <div className="w-px h-4 bg-neutral-700" />

      {/* Delete */}
      <button
        type="button"
        onMouseDown={stopDown}
        onClick={onDelete}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-all"
        title="Delete text"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── MAIN PDF EDITOR CLIENT ────────────────────────────────────────────────────
export default function PdfEditorClient() {
  const [isPdfjsLoaded, setIsPdfjsLoaded] = useState(false);
  const [isPdflibLoaded, setIsPdflibLoaded] = useState(false);

  const [originalBytes, setOriginalBytes] = useState<ArrayBuffer | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [baseFileName, setBaseFileName] = useState("document-edited");
  const [numPages, setNumPages] = useState(0);
  const [pageMeta, setPageMeta] = useState<PageMeta[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [renderScale, setRenderScale] = useState(1.4);
  const [pageViewportCache, setPageViewportCache] = useState<{
    [pageNum: number]: { widthPt: number; heightPt: number };
  }>({});

  const [edits, setEdits] = useState<{ [pageNum: number]: EditItem[] }>({});
  // Link annotations loaded from the PDF per page
  const [linkAnnotations, setLinkAnnotations] = useState<{ [pageNum: number]: LinkAnnotation[] }>({});

  const [currentTool, setCurrentTool] = useState<ToolType>("select");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingTextId, setEditingTextId] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingImageOnCanvas, setIsDraggingImageOnCanvas] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [pendingImage, setPendingImage] = useState<{
    dataUrl: string; mime: string; w: number; h: number;
  } | null>(null);

  const [whiteoutDrag, setWhiteoutDrag] = useState<{
    startX: number; startY: number; currentX: number; currentY: number;
  } | null>(null);

  const [textHitItems, setTextHitItems] = useState<Array<{
    str: string; left: number; top: number; width: number; height: number;
    fontH: number; baselinePx: number; bold: boolean; italic: boolean; font: FontFamily; color?: string;
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const elIdSeq = useRef(1);

  const getCurrentPageEdits = useCallback(() => edits[currentPage] || [], [edits, currentPage]);

  const updateEditItem = useCallback((id: number, patch: Partial<EditItem>) => {
    setEdits((prev) => {
      const items = prev[currentPage] || [];
      return { ...prev, [currentPage]: items.map((x) => x.id === id ? ({ ...x, ...patch } as EditItem) : x) };
    });
  }, [currentPage]);

  const deleteEditItem = useCallback((id: number) => {
    setEdits((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter((x) => x.id !== id),
    }));
    if (selectedId === id) setSelectedId(null);
    if (editingTextId === id) setEditingTextId(null);
  }, [currentPage, selectedId, editingTextId]);

  // ─── LOAD FILE ─────────────────────────────────────────────────────────────
  const loadFile = async (file: File) => {
    if (!file || !isPdfjsLoaded || !isPdflibLoaded) return;
    setIsWorking(true);
    // @ts-ignore
    const pdfjsLib = window.pdfjsLib;
    const fName = file.name;
    setBaseFileName(fName.replace(/\.[^/.]+$/, "") + "-edited");
    try {
      const buf = await file.arrayBuffer();
      setOriginalBytes(buf.slice(0));
      const doc = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setPageMeta(Array.from({ length: doc.numPages }, () => ({ rotation: 0, deleted: false, thumb: null })));
      setEdits({});
      setLinkAnnotations({});
      setCurrentPage(1);
      setSelectedId(null);
      setEditingTextId(null);
    } catch (err) {
      console.error("Error loading PDF:", err);
      alert("Could not load the PDF file.");
    } finally {
      setIsWorking(false);
    }
  };

  // Process dropped/selected image file into dataUrl
  const processImageFile = (file: File, cb: (di: { dataUrl: string; mime: string; w: number; h: number }) => void) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        const maxW = 260;
        const scale = Math.min(1, maxW / img.width);
        cb({ dataUrl, mime: file.type || "image/png", w: img.width * scale, h: img.height * scale });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  

  // Thumbnails
  useEffect(() => {
    if (!pdfDoc || !isPdfjsLoaded || numPages === 0) return;
    let mounted = true;
    (async () => {
      for (let p = 1; p <= numPages; p++) {
        try {
          const page = await pdfDoc.getPage(p);
          const vp = page.getViewport({ scale: 0.16 });
          const c = document.createElement("canvas");
          c.width = vp.width; c.height = vp.height;
          const ctx = c.getContext("2d");
          if (ctx) {
            await page.render({ canvasContext: ctx, viewport: vp }).promise;
            const thumb = c.toDataURL("image/png");
            if (mounted) setPageMeta((prev) => {
              const next = [...prev];
              if (next[p - 1]) next[p - 1] = { ...next[p - 1], thumb };
              return next;
            });
          }
        } catch (e) { /* skip */ }
      }
    })();
    return () => { mounted = false; };
  }, [pdfDoc, numPages, isPdfjsLoaded]);

  // Render page + extract text hits + link annotations
  useEffect(() => {
    if (!pdfDoc || !isPdfjsLoaded || !canvasRef.current || currentPage > numPages) return;
    let cancelled = false;
    (async () => {
      try {
        setIsWorking(true);
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: renderScale });
        setPageViewportCache((prev) => ({
          ...prev,
          [currentPage]: { widthPt: viewport.width / renderScale, heightPt: viewport.height / renderScale },
        }));
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;

        // @ts-ignore
        const pdfjsLib = window.pdfjsLib;
        const textContent = await page.getTextContent({ includeMarkedContent: false } as any);
        const styles: Record<string, any> = (textContent as any).styles || {};
        const hits: typeof textHitItems = [];
        textContent.items.forEach((item: any) => {
          if (!item.str || !item.str.trim()) return;
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const fontH = Math.hypot(tx[2], tx[3]);
          const width = item.width * renderScale;
          const left = tx[4];
          const top = tx[5] - fontH * 0.82; // Adjust for typical HTML font ascent to prevent vertical shift
          // Use the real CSS font-family from pdfjs styles map.
          // Also pass the raw fontName (e.g. "ABCDEF+ArialMT") as secondary source.
          // pdf.js often gives generic keywords like "sans-serif" or "serif" for
          // embedded fonts — the raw fontName may contain the actual name.
          // Attempt to extract exact font object from page.commonObjs (requires render complete)
          let fontObj: any = undefined;
          try { fontObj = page.commonObjs.get(item.fontName); } catch (e) {}

          const styleEntry = styles[item.fontName] || {};
          const fontFamilyFromStyles: string = styleEntry.fontFamily || "";
          const { bold, italic, font } = detectFontTraits(fontFamilyFromStyles, item.fontName, fontObj);
          
          let exactColor: string | undefined = undefined;
          if (item.color && item.color.length >= 3) {
            exactColor = rgbToHex({ r: item.color[0], g: item.color[1], b: item.color[2] });
          }

          hits.push({ str: item.str, left, top, width: Math.max(width, 4), height: fontH * 1.15, fontH, baselinePx: tx[5], bold, italic, font, color: exactColor });
        });
        if (!cancelled) setTextHitItems(hits);

        // Link annotations
        try {
          const annotations = await page.getAnnotations();
          const links: LinkAnnotation[] = [];
          annotations.forEach((ann: any) => {
            if (ann.subtype === "Link" && ann.url) {
              const [x1, y1, x2, y2] = ann.rect;
              const tl = pdfjsLib.Util.transform(viewport.transform, [1, 0, 0, 1, x1, y1]);
              const tr = pdfjsLib.Util.transform(viewport.transform, [1, 0, 0, 1, x2, y2]);
              links.push({
                url: ann.url,
                left: Math.min(tl[4], tr[4]),
                top: Math.min(tl[5], tr[5]),
                width: Math.abs(tr[4] - tl[4]),
                height: Math.abs(tr[5] - tl[5]),
              });
            }
          });
          if (!cancelled) setLinkAnnotations((prev) => ({ ...prev, [currentPage]: links }));
        } catch (e) { /* no annotations */ }
      } catch (err) { console.error("Page render failed:", err); }
      finally { setIsWorking(false); }
    })();
    return () => { cancelled = true; };
  }, [pdfDoc, currentPage, renderScale, numPages, isPdfjsLoaded]);

  // ─── EDITING ACTIONS ────────────────────────────────────────────────────────
  const placeImage = useCallback((di: { dataUrl: string; mime: string; w: number; h: number }, x: number, y: number) => {
    const newId = elIdSeq.current++;
    const newImg: ImageEdit = {
      id: newId, kind: "image",
      left: Math.max(0, x - di.w / 2), top: Math.max(0, y - di.h / 2),
      width: di.w, height: di.h, dataUrl: di.dataUrl, mime: di.mime,
    };
    setEdits((prev) => ({ ...prev, [currentPage]: [...(prev[currentPage] || []), newImg] }));
    setSelectedId(newId);
  }, [currentPage]);

  const handleTextHitClick = (hit: typeof textHitItems[0]) => {
    if (currentTool !== "select") return;

    // Sample the actual background & text colors from the rendered canvas
    // so the whiteout uses the exact background color (preserving buttons, etc.)
    let bgColor = "#ffffff";
    let textColor = hit.color || "#1a1a1a";
    if (canvasRef.current) {
      const sampled = sampleHitColors(canvasRef.current, hit);
      bgColor = sampled.bgColor;
      if (!hit.color) textColor = sampled.textColor; // fallback to sampled if pdf.js metadata lacks color
    }

    // Whiteout with sampled bg color (not hardcoded white)
    const whiteoutId = elIdSeq.current++;
    const whiteoutObj: WhiteoutEdit = {
      id: whiteoutId, kind: "whiteout",
      left: hit.left - 1, top: hit.top - 1,
      width: hit.width + 2, height: hit.fontH * 1.15 + 2,
      fillColor: bgColor,
    };

    const textId = elIdSeq.current++;
    // Measure actual HTML rendered width to compute exact letter spacing
    let ls = 0;
    if (canvasRef.current && hit.str.length > 1) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.font = `${hit.bold ? "bold " : ""}${hit.italic ? "italic " : ""}${hit.fontH}px ${getFontCss(hit.font)}`;
        const mw = ctx.measureText(hit.str).width;
        if (mw > 0) ls = (hit.width - mw) / hit.str.length;
      }
    }

    const textObj: TextEdit = {
      id: textId, kind: "text",
      left: hit.left, top: hit.top,
      width: Math.max(hit.width, 60), height: hit.fontH * 1.2,
      fontSize: hit.fontH, color: textColor,
      font: hit.font, bold: hit.bold, italic: hit.italic,
      text: hit.str, baselinePx: hit.baselinePx, letterSpacing: ls,
    };
    setEdits((prev) => ({ ...prev, [currentPage]: [...(prev[currentPage] || []), whiteoutObj, textObj] }));
    setSelectedId(textId);
    setEditingTextId(textId);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target !== overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (currentTool === "text") {
      const newId = elIdSeq.current++;
      const newText: TextEdit = {
        id: newId, kind: "text", left: x, top: y, width: 160, height: 32,
        fontSize: 16, color: "#1a1a1a", font: "Helvetica", bold: false, italic: false, text: "New Text",
      };
      setEdits((prev) => ({ ...prev, [currentPage]: [...(prev[currentPage] || []), newText] }));
      setSelectedId(newId);
      setEditingTextId(newId);
      setCurrentTool("select");
    } else if (currentTool === "image" && pendingImage) {
      placeImage(pendingImage, x, y);
      setPendingImage(null);
      setCurrentTool("select");
    } else if (currentTool === "select") {
      setSelectedId(null);
      setEditingTextId(null);
    }
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file, (di) => {
      setPendingImage(di);
      setCurrentTool("image");
    });
    e.target.value = "";
  };

  // Canvas drag-and-drop for images
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const hasImage = Array.from(e.dataTransfer.items).some(
      (i) => i.kind === "file" && i.type.startsWith("image/")
    );
    if (hasImage) { e.dataTransfer.dropEffect = "copy"; setIsDraggingImageOnCanvas(true); }
  };
  const handleCanvasDragLeave = () => setIsDraggingImageOnCanvas(false);
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImageOnCanvas(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
    if (!file || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    processImageFile(file, (di) => placeImage(di, x, y));
  };

  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    if (currentTool !== "whiteout" || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
    setWhiteoutDrag({ startX: sx, startY: sy, currentX: sx, currentY: sy });
  };
  const handleOverlayMouseMove = (e: React.MouseEvent) => {
    if (!whiteoutDrag || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    setWhiteoutDrag({ ...whiteoutDrag, currentX: e.clientX - rect.left, currentY: e.clientY - rect.top });
  };
  const handleOverlayMouseUp = () => {
    if (!whiteoutDrag) return;
    const { startX, startY, currentX, currentY } = whiteoutDrag;
    const left = Math.min(startX, currentX), top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX), height = Math.abs(currentY - startY);
    setWhiteoutDrag(null);
    if (width > 5 && height > 5) {
      const newId = elIdSeq.current++;
      setEdits((prev) => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), { id: newId, kind: "whiteout", left, top, width, height }],
      }));
      setSelectedId(newId);
      setCurrentTool("select");
    }
  };

  const startDragElement = (e: React.MouseEvent, item: EditItem) => {
    if (currentTool !== "select" || editingTextId === item.id) return;
    e.stopPropagation(); e.preventDefault();
    setSelectedId(item.id);
    const sx = e.clientX, sy = e.clientY, ol = item.left, ot = item.top;
    const onMove = (ev: MouseEvent) => updateEditItem(item.id, { left: ol + ev.clientX - sx, top: ot + ev.clientY - sy });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const startResizeImage = (e: React.MouseEvent, item: ImageEdit) => {
    e.stopPropagation(); e.preventDefault();
    setSelectedId(item.id);
    const sx = e.clientX, sy = e.clientY, ow = item.width, oh = item.height;
    const onMove = (ev: MouseEvent) => updateEditItem(item.id, { width: Math.max(24, ow + ev.clientX - sx), height: Math.max(24, oh + ev.clientY - sy) });
    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId && editingTextId === null) {
        deleteEditItem(selectedId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, editingTextId, deleteEditItem]);

  const rotateCurrentPage = () => setPageMeta((prev) => {
    const next = [...prev];
    if (next[currentPage - 1]) next[currentPage - 1] = { ...next[currentPage - 1], rotation: (next[currentPage - 1].rotation + 90) % 360 };
    return next;
  });

  const toggleDeleteCurrentPage = () => setPageMeta((prev) => {
    const next = [...prev];
    if (next[currentPage - 1]) next[currentPage - 1] = { ...next[currentPage - 1], deleted: !next[currentPage - 1].deleted };
    return next;
  });

  // ─── EXPORT ────────────────────────────────────────────────────────────────
  const executeExport = async () => {
    if (!originalBytes) return;
    setIsExporting(true);
    try {
      // @ts-ignore
      const PDFLib = window.PDFLib;
      const outDoc = await PDFLib.PDFDocument.load(originalBytes.slice(0), { ignoreEncryption: true });
      // @ts-ignore
      if (window.fontkit) outDoc.registerFontkit(window.fontkit);

      // Unified Font Downloader & Embedder Cache
      const fontCache: Record<string, any> = {};

      const getFont = async (item: TextEdit) => {
        let style = "regular";
        if (item.bold && item.italic) style = "700italic";
        else if (item.bold) style = "700";
        else if (item.italic) style = "italic";
        
        const cacheKey = `${item.font}-${style}`;
        if (fontCache[cacheKey]) return fontCache[cacheKey];

        const fetchTtf = async (url: string) => {
           try {
             const res = await fetch(url);
             if (res.ok) {
               const bytes = await res.arrayBuffer();
               return await outDoc.embedFont(bytes);
             }
           } catch(e) {}
           return null;
        };

        let loaded = null;
        
        if (item.font === "LiberationSerif") {
           loaded = await fetchTtf(`/fonts/liberation/LiberationSerif-${style === 'regular' ? 'Regular' : style === '700' ? 'Bold' : style === 'italic' ? 'Italic' : 'BoldItalic'}.ttf`);
        } else if (item.font === "LiberationMono") {
           loaded = await fetchTtf(`/fonts/liberation-mono/LiberationMono-${style === 'regular' ? 'Regular' : style === '700' ? 'Bold' : style === 'italic' ? 'Italic' : 'BoldItalic'}.ttf`);
        } else if (item.font === "DejaVuSans" || item.font === "DejaVuSerif") {
           let p = `/fonts/dejavu/${item.font}`;
           if (style === '700') p += "-Bold.ttf";
           else if (style === 'italic') p += (item.font === "DejaVuSans" ? "-Oblique.ttf" : "-Italic.ttf");
           else if (style === '700italic') p += (item.font === "DejaVuSans" ? "-BoldOblique.ttf" : "-BoldItalic.ttf");
           else p += ".ttf";
           loaded = await fetchTtf(p);
        } else {
           // For standard Google fonts downloaded via script
           // Convert CamelCase to kebab-case (e.g. NotoSans -> noto-sans)
           let id = item.font.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
           if (id === 'ptsans') id = 'pt-sans';
           if (id === 'ptserif') id = 'pt-serif';
           if (id === 'ptsans-caption') id = 'pt-sans-caption';
           if (id === 'ptsans-narrow') id = 'pt-sans-narrow';
           if (id === 'ptserif-caption') id = 'pt-serif-caption';
           loaded = await fetchTtf(`/fonts/google/${id}-${style}.ttf`);
        }

        if (loaded) {
           fontCache[cacheKey] = loaded;
           return loaded;
        }

        // FALLBACK: Use Standard 14 Fonts if local TTF is missing
        const entry = FONT_MAP[item.font];
        let pdflibName = item.bold && item.italic ? entry?.pdflibBoldItalic || "HelveticaBoldOblique"
          : item.bold ? entry?.pdflibBold || "HelveticaBold"
          : item.italic ? entry?.pdflibItalic || "HelveticaOblique"
          : entry?.pdflib || "Helvetica";
        
        // @ts-ignore
        const PDFLibLocal = window.PDFLib;
        let stdFont = (PDFLibLocal.StandardFonts as any)[pdflibName];
        if (!stdFont) {
           pdflibName = "Helvetica";
           stdFont = PDFLibLocal.StandardFonts.Helvetica;
        }

        if (!fontCache[pdflibName]) {
          fontCache[pdflibName] = await outDoc.embedFont(stdFont);
        }
        return fontCache[pdflibName];
      };

      const imageCache = new Map<string, any>();
      const getEmbeddedImage = async (dataUrl: string, mime: string) => {
        if (imageCache.has(dataUrl)) return imageCache.get(dataUrl);
        const base64 = dataUrl.split(",")[1];
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const img = mime.includes("png") ? await outDoc.embedPng(bytes) : await outDoc.embedJpg(bytes);
        imageCache.set(dataUrl, img);
        return img;
      };

      const pagesToKeep: number[] = [];
      for (let i = 0; i < numPages; i++) if (!pageMeta[i]?.deleted) pagesToKeep.push(i);
      const allPages = outDoc.getPages();

      for (const idx of pagesToKeep) {
        const pNum = idx + 1;
        const page = allPages[idx];
        const { heightPt } = pageViewportCache[pNum] || { widthPt: page.getWidth(), heightPt: page.getHeight() };
        const scale = renderScale;
        if (pageMeta[idx]?.rotation) {
          const cur = page.getRotation().angle || 0;
          page.setRotation(PDFLib.degrees((cur + pageMeta[idx].rotation) % 360));
        }
        for (const ed of (edits[pNum] || [])) {
          if (ed.kind === "whiteout") {
            const fillHex = ed.fillColor || "#ffffff";
            let fr = 1, fg = 1, fb = 1;
            // Parse rgb(...) or #hex
            const rgbMatch = fillHex.match(/rgb\((\d+),(\d+),(\d+)\)/);
            const hexMatch = fillHex.match(/#([0-9a-f]{6})/i);
            if (rgbMatch) {
              fr = parseInt(rgbMatch[1]) / 255;
              fg = parseInt(rgbMatch[2]) / 255;
              fb = parseInt(rgbMatch[3]) / 255;
            } else if (hexMatch) {
              fr = parseInt(hexMatch[1].substring(0, 2), 16) / 255;
              fg = parseInt(hexMatch[1].substring(2, 4), 16) / 255;
              fb = parseInt(hexMatch[1].substring(4, 6), 16) / 255;
            }
            page.drawRectangle({ x: ed.left / scale, y: heightPt - (ed.top + ed.height) / scale, width: ed.width / scale, height: ed.height / scale, color: PDFLib.rgb(fr, fg, fb) });
          } else if (ed.kind === "text") {
            const font = await getFont(ed);
            const x = ed.left / scale;
            const baseY = ed.baselinePx != null ? heightPt - ed.baselinePx / scale : heightPt - (ed.top + ed.height * 0.85) / scale;
            const size = (ed.fontSize / scale);
            const colorHex = ed.color.replace("#", "");
            const r = parseInt(colorHex.substring(0, 2), 16) / 255 || 0;
            const g = parseInt(colorHex.substring(2, 4), 16) / 255 || 0;
            const b = parseInt(colorHex.substring(4, 6), 16) / 255 || 0;
            (ed.text || "").split("\n").forEach((line, li) => {
              const y = baseY - li * size * 1.2;
              if (ed.letterSpacing && ed.letterSpacing !== 0) {
                 let curX = x;
                 const lsPt = ed.letterSpacing / scale;
                 for (let i = 0; i < line.length; i++) {
                   const char = line[i];
                   page.drawText(char, { x: curX, y, size, font, color: PDFLib.rgb(r, g, b) });
                   curX += font.widthOfTextAtSize(char, size) + lsPt;
                 }
              } else {
                 page.drawText(line, { x, y, size, font, color: PDFLib.rgb(r, g, b) });
              }
            });
            // Draw link annotation if present
            if (ed.link) {
              try {
                const linkAnnotation = outDoc.context.obj({
                  Type: "Annot",
                  Subtype: "Link",
                  Rect: [ed.left / scale, heightPt - (ed.top + ed.height) / scale, (ed.left + ed.width) / scale, heightPt - ed.top / scale],
                  A: { Type: "Action", S: "URI", URI: PDFLib.PDFString.of(ed.link) },
                  Border: [0, 0, 0],
                });
                const annots = page.node.get(PDFLib.PDFName.of("Annots"));
                if (annots) annots.push(linkAnnotation);
              } catch (e) { /* skip if annotation API not available */ }
            }
          } else if (ed.kind === "image") {
            const img = await getEmbeddedImage(ed.dataUrl, ed.mime);
            page.drawImage(img, { x: ed.left / scale, y: heightPt - (ed.top + ed.height) / scale, width: ed.width / scale, height: ed.height / scale });
          }
        }
      }

      let finalDoc = outDoc;
      if (pagesToKeep.length !== numPages) {
        finalDoc = await PDFLib.PDFDocument.create();
        const copied = await finalDoc.copyPages(outDoc, pagesToKeep);
        copied.forEach((p: any) => finalDoc.addPage(p));
      }

      const bytes = await finalDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (baseFileName || "edited-document").replace(/\.pdf$/i, "") + ".pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Check the console for details.");
    } finally {
      setIsExporting(false);
      setShowFeedback(false);
    }
  };

  const selectedItem = getCurrentPageEdits().find((x) => x.id === selectedId);

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {/* Google Fonts — injected via useEffect so they reliably land in <head> */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
        onLoad={() => {
          setIsPdfjsLoaded(true);
          // @ts-ignore
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }}
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
        onLoad={() => setIsPdflibLoaded(true)}
      />
      <Script src="https://unpkg.com/@pdf-lib/fontkit@0.0.4/dist/fontkit.umd.min.js" />
      <input type="file" ref={fileInputRef} accept="application/pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      <input type="file" ref={imageInputRef} accept="image/png,image/jpeg,image/webp" className="hidden"
        onChange={handleImageSelected} />

      {isWorking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <div className="bg-card border border-border p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Processing Document...</h3>
            <p className="text-sm text-muted-foreground">Please wait while the PDF is loaded and rendered.</p>
          </div>
        </motion.div>
      )}

      {!originalBytes ? (
        /* ─── DROPZONE ─── */
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
              <ShieldCheck className="w-4 h-4" /> 100% Free & Private — No Server Uploads
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
              Free PDF Editor No Sign Up
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Edit existing PDF text directly in your browser, add custom text & images, redact with whiteout, rotate
              and delete pages. Completely free, no registration required.
            </p>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault(); setIsDraggingFile(false);
              const f = e.dataTransfer.files[0];
              if (f && (f.type === "application/pdf" || f.name.endsWith(".pdf"))) loadFile(f);
            }}
            className={`border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 ${
              isDraggingFile ? "border-primary bg-primary/10 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-card/50 bg-card/20 shadow-xl"
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-inner">
              <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Choose a PDF or drag it here</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Click any line of text to retype it, drop in logos or stamps, cover up sensitive numbers. Your documents
              never leave this tab.
            </p>
            <button type="button" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105">
              <Upload className="w-4 h-4" /> Select PDF Document
            </button>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              {["No signup required", "Click to edit original text", "Drag & drop images", "Bold/Italic preserved"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ─── EDITOR WORKSPACE ─── */
        <div className="flex flex-col border-t border-border bg-muted/20" style={{ height: "calc(100vh - 80px)", minHeight: 640 }}>
          {/* TOP TOOLBAR */}
          <div className="h-14 bg-background border-b border-border px-4 flex items-center justify-between gap-2 shrink-0 z-30 shadow-sm">
            {/* Tool buttons */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
              {([
                { id: "select", icon: <MousePointer className="w-3.5 h-3.5" />, label: "Select / Edit", title: "Click text to retype" },
                { id: "text", icon: <Type className="w-3.5 h-3.5" />, label: "Text", title: "Add new text box" },
                { id: "image", icon: <ImageIcon className="w-3.5 h-3.5" />, label: "Image", title: "Add image (or drag onto canvas)" },
                { id: "whiteout", icon: <Eraser className="w-3.5 h-3.5" />, label: "Whiteout", title: "Drag to redact" },
              ] as const).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.title}
                  onClick={() => {
                    if (t.id === "image") { imageInputRef.current?.click(); return; }
                    setCurrentTool(t.id);
                    setSelectedId(null);
                    setEditingTextId(null);
                    setPendingImage(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentTool === t.id && t.id !== "image"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  {t.icon}
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Page nav + zoom */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-xl border border-border text-xs">
                <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 hover:bg-background rounded disabled:opacity-30 text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-1 font-semibold text-foreground">{currentPage} / {numPages}</span>
                <button disabled={currentPage >= numPages} onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  className="p-1 hover:bg-background rounded disabled:opacity-30 text-muted-foreground hover:text-foreground">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden md:flex items-center gap-1 bg-muted/60 px-2 py-1 rounded-xl border border-border text-xs">
                <button onClick={() => setRenderScale((s) => Math.max(0.6, s / 1.15))}
                  className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"><ZoomOut className="w-3.5 h-3.5" /></button>
                <span className="px-1 font-mono text-muted-foreground">{Math.round((renderScale / 1.4) * 100)}%</span>
                <button onClick={() => setRenderScale((s) => Math.min(3.0, s * 1.15))}
                  className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"><ZoomIn className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Export */}
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground">
                <Upload className="w-3.5 h-3.5" /> Open New
              </button>
              <button onClick={() => setShowFeedback(true)} disabled={isExporting}
                className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-60">
                {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* WORKSPACE */}
          <div className="flex-1 flex overflow-hidden">
            {/* PAGE RAIL */}
            <div className="w-24 sm:w-28 bg-background border-r border-border flex flex-col p-2 gap-3 overflow-y-auto shrink-0 select-none">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center pt-1">Pages ({numPages})</div>
              {pageMeta.map((meta, idx) => {
                const p = idx + 1;
                const isActive = p === currentPage;
                return (
                  <div key={p}
                    onClick={() => { setCurrentPage(p); setSelectedId(null); setEditingTextId(null); }}
                    className={`group relative rounded-xl border-2 p-1 cursor-pointer transition-all bg-card ${isActive ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border hover:border-primary/40"} ${meta.deleted ? "opacity-30" : ""}`}
                  >
                    <div className="aspect-[3/4] bg-muted/40 rounded-lg overflow-hidden flex items-center justify-center relative">
                      {meta.thumb ? (
                        <img src={meta.thumb} alt={`Page ${p}`} className="w-full h-full object-contain" style={{ transform: `rotate(${meta.rotation}deg)` }} />
                      ) : (
                        <span className="text-xs text-muted-foreground">P.{p}</span>
                      )}
                      <span className="absolute bottom-1 left-1 text-[9px] font-mono px-1 rounded bg-black/70 text-white font-bold">{p}</span>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPageMeta((prev) => { const n = [...prev]; n[idx] = { ...n[idx], rotation: (n[idx].rotation + 90) % 360 }; return n; }); }}
                        className="w-5 h-5 rounded bg-black/80 text-white flex items-center justify-center hover:bg-primary"><RotateCw className="w-3 h-3" /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPageMeta((prev) => { const n = [...prev]; n[idx] = { ...n[idx], deleted: !n[idx].deleted }; return n; }); }}
                        className={`w-5 h-5 rounded flex items-center justify-center ${meta.deleted ? "bg-emerald-600" : "bg-destructive"} text-white`}>
                        {meta.deleted ? <Undo2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CANVAS AREA */}
            <div className="flex-1 overflow-auto bg-muted/30 p-4 sm:p-8 flex flex-col items-center justify-start relative">
              {/* Page actions bar */}
              <div className="flex items-center gap-3 mb-4 bg-background/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border shadow-sm text-xs text-muted-foreground z-10">
                <span>Page <strong className="text-foreground">{currentPage}</strong> of {numPages}</span>
                <span className="text-border">|</span>
                <button onClick={rotateCurrentPage} className="flex items-center gap-1 hover:text-foreground">
                  <RotateCw className="w-3.5 h-3.5" /> Rotate
                </button>
                <span className="text-border">|</span>
                <button onClick={toggleDeleteCurrentPage} className={`transition-colors ${pageMeta[currentPage - 1]?.deleted ? "text-emerald-500 font-bold" : "hover:text-destructive"}`}>
                  {pageMeta[currentPage - 1]?.deleted ? "Restore Page" : "Delete Page"}
                </button>
              </div>

              {/* Image drag hint */}
              {isDraggingImageOnCanvas && (
                <div className="absolute inset-8 z-50 rounded-3xl border-4 border-dashed border-primary bg-primary/10 flex items-center justify-center pointer-events-none">
                  <p className="text-primary font-bold text-lg">Drop image here</p>
                </div>
              )}

              {/* Pending image placement hint */}
              {currentTool === "image" && pendingImage && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-bounce">
                  Click anywhere on the page to place the image
                </div>
              )}

              {/* PDF artboard */}
              <div
                className={`relative bg-white shadow-2xl rounded-sm ${pageMeta[currentPage - 1]?.deleted ? "opacity-40 grayscale" : ""}`}
                style={{ transform: `rotate(${pageMeta[currentPage - 1]?.rotation || 0}deg)` }}
                onDragOver={handleCanvasDragOver}
                onDragLeave={handleCanvasDragLeave}
                onDrop={handleCanvasDrop}
              >
                <canvas ref={canvasRef} className="block select-none" />

                {/* Interactive overlay */}
                <div
                  ref={overlayRef}
                  onClick={handleCanvasClick}
                  onMouseDown={handleOverlayMouseDown}
                  onMouseMove={handleOverlayMouseMove}
                  onMouseUp={handleOverlayMouseUp}
                  className={`absolute inset-0 z-10 ${
                    currentTool === "text" ? "cursor-text"
                    : currentTool === "whiteout" ? "cursor-crosshair"
                    : currentTool === "image" ? "cursor-copy"
                    : "cursor-default"
                  }`}
                >
                  {/* Link annotations from the original PDF (read-only, preserved) */}
                  {(linkAnnotations[currentPage] || []).map((ann, i) => (
                    <a
                      key={i}
                      href={ann.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ left: ann.left, top: ann.top, width: ann.width, height: ann.height }}
                      className="absolute z-5 hover:bg-blue-500/10 hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-500 rounded-sm cursor-pointer"
                      title={`Link: ${ann.url}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ))}

                  {/* Text-hit zones (click to retype) */}
                  {currentTool === "select" && textHitItems.map((hit, i) => (
                    <div
                      key={i}
                      onClick={(e) => { e.stopPropagation(); handleTextHitClick(hit); }}
                      style={{ left: `${hit.left}px`, top: `${hit.top}px`, width: `${hit.width}px`, height: `${hit.height}px` }}
                      className="absolute cursor-text hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary hover:bg-primary/10 rounded-sm"
                      title="Click to retype"
                    />
                  ))}

                  {/* Whiteout drag preview */}
                  {whiteoutDrag && (
                    <div
                      style={{
                        left: Math.min(whiteoutDrag.startX, whiteoutDrag.currentX),
                        top: Math.min(whiteoutDrag.startY, whiteoutDrag.currentY),
                        width: Math.abs(whiteoutDrag.currentX - whiteoutDrag.startX),
                        height: Math.abs(whiteoutDrag.currentY - whiteoutDrag.startY),
                      }}
                      className="absolute bg-primary/20 border border-dashed border-primary z-30 pointer-events-none"
                    />
                  )}

                  {/* Rendered edits */}
                  {getCurrentPageEdits().map((item) => {
                    const isSelected = item.id === selectedId;

                    if (item.kind === "whiteout") {
                      return (
                        <div
                          key={item.id}
                          onClick={(e) => { if (currentTool === "select") { e.stopPropagation(); setSelectedId(item.id); } }}
                          onMouseDown={(e) => startDragElement(e, item)}
                          style={{ left: `${item.left}px`, top: `${item.top}px`, width: `${item.width}px`, height: `${item.height}px`, backgroundColor: item.fillColor || "#ffffff" }}
                          className={`absolute z-20 ${isSelected ? "ring-2 ring-primary cursor-move" : "cursor-pointer"}`}
                        >
                          {isSelected && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); deleteEditItem(item.id); }}
                              className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow hover:scale-110 z-30">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    }

                    if (item.kind === "text") {
                      const isEditing = editingTextId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={(e) => { if (currentTool === "select") { e.stopPropagation(); setSelectedId(item.id); } }}
                          onDoubleClick={(e) => { e.stopPropagation(); setSelectedId(item.id); setEditingTextId(item.id); }}
                          onMouseDown={(e) => { if (!isEditing) startDragElement(e, item); }}
                          style={{
                            left: `${item.left}px`,
                            top: `${item.top}px`,
                            minWidth: `${item.width}px`,
                            fontSize: `${item.fontSize}px`,
                            color: item.color,
                            fontFamily: getFontCss(item.font),
                            fontWeight: item.bold ? "bold" : "normal",
                            fontStyle: item.italic ? "italic" : "normal",
                            letterSpacing: item.letterSpacing ? `${item.letterSpacing}px` : "normal",
                          }}
                          className={`absolute z-30 whitespace-pre leading-none select-text ${
                            isSelected
                              ? "outline outline-1 outline-dashed outline-primary"
                              : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/40"
                          } ${isEditing ? "cursor-text" : "cursor-move"}`}
                        >
                          {isEditing ? (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              autoFocus
                              onBlur={(e) => { updateEditItem(item.id, { text: e.currentTarget.innerText }); setEditingTextId(null); }}
                              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                              className="outline-none"
                            >
                              {item.text}
                            </div>
                          ) : item.link ? (
                            <span className="underline decoration-dotted cursor-pointer" style={{ color: item.color }} title={item.link}>{item.text}</span>
                          ) : item.text}

                          {/* Floating settings toolbar */}
                          {isSelected && (
                            <TextToolbar
                              item={item}
                              onUpdate={(patch) => updateEditItem(item.id, patch)}
                              onDelete={() => deleteEditItem(item.id)}
                            />
                          )}
                        </div>
                      );
                    }

                    if (item.kind === "image") {
                      return (
                        <div
                          key={item.id}
                          onClick={(e) => { if (currentTool === "select") { e.stopPropagation(); setSelectedId(item.id); } }}
                          onMouseDown={(e) => startDragElement(e, item)}
                          // Drop a new image file ON this image to replace it
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = "copy"; }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith("image/"));
                            if (!file) return;
                            processImageFile(file, (di) => {
                              updateEditItem(item.id, { dataUrl: di.dataUrl, mime: di.mime });
                            });
                          }}
                          style={{ left: `${item.left}px`, top: `${item.top}px`, width: `${item.width}px`, height: `${item.height}px`, position: "absolute" }}
                          className={`z-30 cursor-move select-none transition-all ${isSelected ? "ring-2 ring-primary shadow-lg shadow-primary/30" : "hover:ring-2 hover:ring-primary/50"}`}
                        >
                          <img src={item.dataUrl} alt="embedded" className="w-full h-full object-fill pointer-events-none select-none" draggable={false} />

                          {/* Corner handles when selected */}
                          {isSelected && (
                            <>
                              {/* Resize handle – bottom-right */}
                              <div
                                onMouseDown={(e) => startResizeImage(e, item)}
                                className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-white shadow-lg hover:scale-125 z-40"
                              />
                              {/* Resize handle – bottom-left */}
                              <div
                                onMouseDown={(e) => {
                                  e.stopPropagation(); e.preventDefault();
                                  const sx = e.clientX, sy = e.clientY, ow = item.width, oh = item.height, ol = item.left;
                                  const onMove = (ev: MouseEvent) => {
                                    const dw = sx - ev.clientX;
                                    const dh = ev.clientY - sy;
                                    const nw = Math.max(24, ow + dw);
                                    const nh = Math.max(24, oh + dh);
                                    updateEditItem(item.id, { width: nw, height: nh, left: ol - (nw - ow) });
                                  };
                                  const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
                                  window.addEventListener("mousemove", onMove);
                                  window.addEventListener("mouseup", onUp);
                                }}
                                className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize border-2 border-white shadow-lg hover:scale-125 z-40"
                              />

                              {/* Floating image toolbar */}
                              <ImageToolbar
                                item={item}
                                onReplace={() => {
                                  // Trigger a hidden file picker bound to this image id
                                  const inp = document.createElement("input");
                                  inp.type = "file";
                                  inp.accept = "image/png,image/jpeg,image/webp";
                                  inp.onchange = () => {
                                    const file = inp.files?.[0];
                                    if (!file) return;
                                    processImageFile(file, (di) => {
                                      updateEditItem(item.id, { dataUrl: di.dataUrl, mime: di.mime });
                                    });
                                  };
                                  inp.click();
                                }}
                                onDelete={() => deleteEditItem(item.id)}
                              />
                            </>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Filename bar */}
              <div className="mt-8 mb-4 max-w-xl w-full flex items-center gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-muted-foreground whitespace-nowrap pl-1">Export Filename:</span>
                <input
                  type="text"
                  value={baseFileName}
                  onChange={(e) => setBaseFileName(e.target.value)}
                  placeholder="document-edited"
                  className="flex-1 bg-muted border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary font-medium"
                />
                <span className="text-xs text-muted-foreground font-mono">.pdf</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showFeedback && <FeedbackModal onProceed={executeExport} onClose={() => setShowFeedback(false)} />}
      </AnimatePresence>
    </div>
  );
}
