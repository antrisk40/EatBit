"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import qrcode from "qrcode-generator";
import { motion, AnimatePresence } from "framer-motion";
import OtherToolsSidebar from "@/components/OtherToolsSidebar";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLnyGXKrgLTdkMgXnwL38DafnGxE-vhb-SzHG0gCKCl7aWrduKWGAomaiSUve4jrAY/exec";

// ─── FEEDBACK MODAL ──────────────────────────────────────────────────────────
function QRFeedbackModal({ onProceed, onClose }: { onProceed: () => void; onClose: () => void }) {
  const [improvements, setImprovements] = useState("");
  const [usagePurpose, setUsagePurpose] = useState("");
  const [needsCustom, setNeedsCustom] = useState<"yes" | "no" | "">("" );
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        source: "QR Code Generator Tool",
        email,
        improvements,
        usagePurpose,
        needsCustomSoftware: needsCustom,
        submitted_at: new Date().toISOString(),
      };
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // no-cors always throws; script still receives it
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 22 }}
        className="bg-background border border-border w-full max-w-lg shadow-2xl shadow-black/50 rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <svg className="text-green-400 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="font-bold text-foreground text-sm">Your QR code is ready to download!</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close dialog">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {submitted ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <svg className="text-green-400 w-10 h-10 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <p className="font-bold text-foreground">Thanks for your feedback!</p>
              <p className="text-sm text-muted-foreground mt-1">Starting your download…</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before you download, we&apos;d love 30 seconds of your feedback to make this tool better.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  What improvements or new tools would you like to see?
                </label>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={3}
                  placeholder="e.g. batch QR generation, dynamic QR codes, analytics…"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 resize-none outline-none focus:border-primary/60 transition-colors rounded-lg placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                  Are you using this for fun or business?
                </label>
                <select
                  required
                  value={usagePurpose}
                  onChange={(e) => setUsagePurpose(e.target.value)}
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="fun">Just for Fun</option>
                  <option value="business">Business / Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Do you need custom software built for your business?
                </label>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setNeedsCustom(val)}
                      className={`flex-1 py-2.5 border text-sm font-bold transition-all duration-200 rounded-lg ${
                        needsCustom === val
                          ? val === "yes"
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : "bg-muted text-foreground border-foreground/30"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {val === "yes" ? "✓ Yes, I do!" : "No, thanks"}
                    </button>
                  ))}
                </div>
                {needsCustom === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-3 bg-primary/10 border border-primary/20 text-xs text-primary rounded-lg"
                  >
                    🚀 Great! EatBit builds custom AI tools, SaaS platforms & web apps. We&apos;ll reach out after you submit.
                  </motion.div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-muted border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary/60 transition-colors rounded-lg placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 rounded-xl"
                >
                  {submitting ? (
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  )}
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

type TabState = "url" | "text" | "wifi" | "social" | "vcard" | "email" | "phone" | "sms" | "whatsapp" | "pdf";
type FrameState = "none" | "card" | "label" | "badge";
type DotStyle = "square" | "rounded" | "dots" | "star" | "diamond";
type EyeStyle = "square" | "rounded" | "circle" | "leaf";
type GradDir = "diagonal" | "horizontal" | "vertical" | "radial";

const PLATFORM_STYLES: Record<string, any> = {
  "instagram.com/": { gradient: ["#405DE6", "#5B51D9", "#833AB4", "#C13584", "#E1306C", "#FD1D1D", "#F56040", "#FFDC80"], fg: "#833AB4", dotStyle: "dots", frame: "card", label: "Instagram" },
  "tiktok.com/@": { gradient: ["#010101", "#25F4EE", "#FE2C55"], fg: "#010101", dotStyle: "rounded", frame: "card", label: "TikTok" },
  "x.com/": { gradient: null, fg: "#000000", dotStyle: "square", frame: "card", label: "X (Twitter)" },
  "facebook.com/": { gradient: ["#0064E0", "#0A58CA"], fg: "#0064E0", dotStyle: "rounded", frame: "card", label: "Facebook" },
  "youtube.com/@": { gradient: ["#FF0000", "#CC0000"], fg: "#FF0000", dotStyle: "rounded", frame: "label", label: "YouTube" },
  "linkedin.com/in/": { gradient: ["#0A66C2", "#004182"], fg: "#0A66C2", dotStyle: "square", frame: "card", label: "LinkedIn" },
};

const COLOR_PRESETS = [
  { label: "Classic", fg: "#14171A", bg: "#FFFFFF", grad: null },
  { label: "Indigo", fg: "#5B5BF5", bg: "#FFFFFF", grad: null },
  { label: "Mint", fg: "#14C38E", bg: "#FFFFFF", grad: null },
  { label: "Rose", fg: "#F43F5E", bg: "#FFF1F2", grad: null },
  { label: "Navy", fg: "#1A2A57", bg: "#EAF0FF", grad: null },
  { label: "Gold", fg: "#D97706", bg: "#FFFBEB", grad: null },
  { label: "Sunset", fg: "#EF4444", bg: "#FFFFFF", grad: ["#F97316", "#EF4444", "#EC4899"] },
  { label: "Ocean", fg: "#0EA5E9", bg: "#FFFFFF", grad: ["#38BDF8", "#0EA5E9", "#6366F1"] },
  { label: "Forest", fg: "#10B981", bg: "#FFFFFF", grad: ["#34D399", "#10B981", "#059669"] },
  { label: "Candy", fg: "#A855F7", bg: "#FFFFFF", grad: ["#EC4899", "#A855F7", "#6366F1"] },
];

function esc(str: string) {
  return String(str || "").replace(/([\\;,":])/g, "\\$1");
}

function Segmented<T extends string>({
  options, value, onChange, className
}: { options: { val: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`flex rounded-lg border border-border overflow-hidden ${className || ""}`}>
      {options.map(o => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={`flex-1 px-2 py-1.5 text-xs font-semibold border-r border-border last:border-0 transition-colors ${value === o.val ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted text-muted-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{title}</h4>
      {children}
    </div>
  );
}

interface QRCoderProps {
  defaultTab?: TabState;
  heroTitle?: string;
  heroDesc?: string;
  seoContent?: React.ReactNode;
}

export default function QRCoder({ defaultTab = "url", heroTitle, heroDesc, seoContent }: QRCoderProps) {
  const [tab, setTab] = useState<TabState>(defaultTab);

  // Color state
  const [fg, setFg] = useState("#14171A");
  const [bg, setBg] = useState("#FFFFFF");
  const [gradientStops, setGradientStops] = useState<string[] | null>(null);
  const [gradDir, setGradDir] = useState<GradDir>("diagonal");
  const [eyeColor, setEyeColor] = useState("#14171A");
  const [eyeInnerColor, setEyeInnerColor] = useState("#14171A");
  const [useCustomEyeColors, setUseCustomEyeColors] = useState(false);

  // Shape state
  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("square");

  // Frame state
  const [frame, setFrame] = useState<FrameState>("none");
  const [labelText, setLabelText] = useState("SCAN ME");

  // Logo
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoName, setLogoName] = useState<string>("");

  // Error correction
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");

  // QR size (cell px)
  const [qrSize, setQrSize] = useState<"sm" | "md" | "lg">("md");

  // Field states
  const [url, setUrl] = useState("https://example.com");
  const [textVal, setTextVal] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState("instagram.com/");
  const [socialHandle, setSocialHandle] = useState("");
  const [matchBrand, setMatchBrand] = useState(true);
  const [vcFirst, setVcFirst] = useState("");
  const [vcLast, setVcLast] = useState("");
  const [vcPhone, setVcPhone] = useState("");
  const [vcEmail, setVcEmail] = useState("");
  const [vcOrg, setVcOrg] = useState("");
  const [vcUrl, setVcUrl] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubj, setEmailSubj] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [smsNum, setSmsNum] = useState("");
  const [smsMsg, setSmsMsg] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [payloadText, setPayloadText] = useState("");
  const [matrixData, setMatrixData] = useState<{ matrix: boolean[][]; count: number } | null>(null);
  const [activePreset, setActivePreset] = useState(0);

  const cellSize = qrSize === "sm" ? 8 : qrSize === "lg" ? 13 : 10;

  const buildPayload = useCallback(() => {
    switch (tab) {
      case "url": {
        let v = url.trim();
        if (v && !/^https?:\/\//i.test(v)) v = "https://" + v;
        return v || "https://example.com";
      }
      case "text":
        return textVal || "Your text here";
      case "wifi": {
        const ssid = esc(wifiSsid || "MyWiFi");
        const pass = esc(wifiPass || "");
        const hidden = wifiHidden ? "true" : "false";
        if (wifiSec === "nopass") return `WIFI:T:nopass;S:${ssid};H:${hidden};;`;
        return `WIFI:T:${wifiSec};S:${ssid};P:${pass};H:${hidden};;`;
      }
      case "social": {
        const handle = socialHandle.trim().replace(/^@/, "");
        return "https://" + socialPlatform + (handle || "yourname");
      }
      case "vcard": {
        const fn = `${vcFirst} ${vcLast}`.trim();
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcLast};${vcFirst}\nFN:${fn}\nORG:${vcOrg}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nURL:${vcUrl}\nEND:VCARD`;
      }
      case "email": {
        const subj = encodeURIComponent(emailSubj);
        const body = encodeURIComponent(emailBody);
        return `mailto:${emailTo}?subject=${subj}&body=${body}`;
      }
      case "phone":
        return `tel:${phoneVal}`;
      case "sms": {
        const msg = encodeURIComponent(smsMsg);
        return `SMSTO:${smsNum}:${msg}`;
      }
      case "whatsapp": {
        const phone = waPhone.trim().replace(/\D/g, "");
        const text = encodeURIComponent(waMsg);
        return `https://wa.me/${phone}${text ? `?text=${text}` : ""}`;
      }
      case "pdf": {
        let v = pdfUrl.trim();
        if (v && !/^https?:\/\//i.test(v)) v = "https://" + v;
        return v || "https://example.com/your-file.pdf";
      }
      default:
        return "https://example.com";
    }
  }, [tab, url, textVal, wifiSsid, wifiPass, wifiSec, wifiHidden, socialPlatform, socialHandle, vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcUrl, emailTo, emailSubj, emailBody, phoneVal, smsNum, smsMsg, waPhone, waMsg, pdfUrl]);

  const applyPlatformStyle = useCallback((val: string) => {
    const s = PLATFORM_STYLES[val];
    if (!s || !matchBrand) return;
    setGradientStops(s.gradient);
    setFg(s.fg);
    setBg("#FFFFFF");
    setDotStyle(s.dotStyle);
    setFrame(s.frame);
    setUseCustomEyeColors(false);
    setActivePreset(-1);
  }, [matchBrand]);

  useEffect(() => {
    if (tab === "social") applyPlatformStyle(socialPlatform);
  }, [tab, socialPlatform, matchBrand, applyPlatformStyle]);

  // Main canvas draw
  useEffect(() => {
    const payload = buildPayload();
    setPayloadText(payload || " ");
    const ec = logoImg ? "H" : ecLevel;

    let result;
    try {
      const qr = qrcode(0, ec);
      qr.addData(payload && payload.length ? payload : " ");
      qr.make();
      const count = qr.getModuleCount();
      const matrix: boolean[][] = [];
      for (let r = 0; r < count; r++) {
        const row: boolean[] = [];
        for (let c = 0; c < count; c++) row.push(qr.isDark(r, c));
        matrix.push(row);
      }
      result = { matrix, count };
    } catch {
      try {
        const qr = qrcode(0, "L");
        qr.addData(payload);
        qr.make();
        const count = qr.getModuleCount();
        const matrix: boolean[][] = [];
        for (let r = 0; r < count; r++) {
          const row: boolean[] = [];
          for (let c = 0; c < count; c++) row.push(qr.isDark(r, c));
          matrix.push(row);
        }
        result = { matrix, count };
      } catch {
        return;
      }
    }

    setMatrixData(result);
    const { matrix, count } = result;
    const cell = cellSize;
    const quiet = cell * 4;
    const baseSize = count * cell + quiet * 2;

    const baseC = document.createElement("canvas");
    baseC.width = baseSize;
    baseC.height = baseSize;
    const cx = baseC.getContext("2d")!;

    function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    cx.fillStyle = bg;
    cx.fillRect(0, 0, baseSize, baseSize);
    cx.save();
    cx.translate(quiet, quiet);

    const sz = count * cell;
    let fill: string | CanvasGradient = fg;
    if (gradientStops && gradientStops.length) {
      let g: CanvasGradient;
      if (gradDir === "radial") {
        g = cx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
      } else if (gradDir === "horizontal") {
        g = cx.createLinearGradient(0, 0, sz, 0);
      } else if (gradDir === "vertical") {
        g = cx.createLinearGradient(0, 0, 0, sz);
      } else {
        g = cx.createLinearGradient(0, 0, sz, sz);
      }
      const n = gradientStops.length;
      gradientStops.forEach((color, i) => g.addColorStop(n === 1 ? 0 : i / (n - 1), color));
      fill = g;
    }

    const eyeFill = useCustomEyeColors ? eyeColor : fill;
    const eyeInnerFill = useCustomEyeColors ? eyeInnerColor : fill;

    function inFinderZone(r: number, c: number, cnt: number) {
      return (r < 7 && c < 7) || (r < 7 && c >= cnt - 7) || (r >= cnt - 7 && c < 7);
    }

    function eyeOuterPath(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, style: EyeStyle) {
      const r = style === "circle" || style === "rounded" ? s / 2 : (style === "leaf" ? s * 0.3 : 0);
      roundRectPath(ctx, x, y, s, s, r);
    }

    function eyeInnerPath(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, style: EyeStyle) {
      if (style === "circle") {
        ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
      } else {
        const r = style === "rounded" ? s * 0.35 : (style === "leaf" ? s * 0.4 : 0);
        roundRectPath(ctx, x, y, s, s, r);
      }
    }

    function drawEye(col: number, row: number, cellSz: number) {
      const x = col * cellSz, y = row * cellSz;
      cx.fillStyle = eyeFill as any;
      eyeOuterPath(cx, x, y, cellSz * 7, eyeStyle); cx.fill();
      cx.fillStyle = bg;
      eyeOuterPath(cx, x + cellSz, y + cellSz, cellSz * 5, eyeStyle); cx.fill();
      cx.fillStyle = eyeInnerFill as any;
      eyeInnerPath(cx, x + cellSz * 2, y + cellSz * 2, cellSz * 3, eyeStyle); cx.fill();
    }

    function drawModule(col: number, row: number, cellSz: number, fillStyle: any) {
      const x = col * cellSz, y = row * cellSz;
      cx.fillStyle = fillStyle;
      if (dotStyle === "dots") {
        cx.beginPath(); cx.arc(x + cellSz / 2, y + cellSz / 2, cellSz * 0.42, 0, Math.PI * 2); cx.fill();
      } else if (dotStyle === "rounded") {
        roundRectPath(cx, x + cellSz * 0.06, y + cellSz * 0.06, cellSz * 0.88, cellSz * 0.88, cellSz * 0.28); cx.fill();
      } else if (dotStyle === "diamond") {
        const cx0 = x + cellSz / 2, cy0 = y + cellSz / 2, r = cellSz * 0.44;
        cx.beginPath(); cx.moveTo(cx0, cy0 - r); cx.lineTo(cx0 + r, cy0); cx.lineTo(cx0, cy0 + r); cx.lineTo(cx0 - r, cy0); cx.closePath(); cx.fill();
      } else if (dotStyle === "star") {
        const cx0 = x + cellSz / 2, cy0 = y + cellSz / 2, ro = cellSz * 0.44, ri = cellSz * 0.2, pts = 5;
        cx.beginPath();
        for (let i = 0; i < pts * 2; i++) {
          const angle = (i * Math.PI) / pts - Math.PI / 2;
          const r = i % 2 === 0 ? ro : ri;
          if (i === 0) cx.moveTo(cx0 + r * Math.cos(angle), cy0 + r * Math.sin(angle));
          else cx.lineTo(cx0 + r * Math.cos(angle), cy0 + r * Math.sin(angle));
        }
        cx.closePath(); cx.fill();
      } else {
        cx.fillRect(x, y, cellSz, cellSz);
      }
    }

    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (inFinderZone(r, c, count)) continue;
        if (matrix[r][c]) drawModule(c, r, cell, fill);
      }
    }
    drawEye(0, 0, cell);
    drawEye(count - 7, 0, cell);
    drawEye(0, count - 7, cell);
    cx.restore();

    if (logoImg) {
      const logoBox = baseSize * 0.24;
      const cxCenter = baseSize / 2, cyCenter = baseSize / 2;
      cx.fillStyle = "#FFFFFF";
      roundRectPath(cx, cxCenter - logoBox / 2 - 6, cyCenter - logoBox / 2 - 6, logoBox + 12, logoBox + 12, 14);
      cx.fill();
      cx.save();
      roundRectPath(cx, cxCenter - logoBox / 2, cyCenter - logoBox / 2, logoBox, logoBox, 10);
      cx.clip();
      cx.drawImage(logoImg, cxCenter - logoBox / 2, cyCenter - logoBox / 2, logoBox, logoBox);
      cx.restore();
    }

    // Apply frame
    const finalC = document.createElement("canvas");
    const fx = finalC.getContext("2d")!;
    const bw = baseC.width, bh = baseC.height;
    const fgSolid = typeof fill === "string" ? fill : fg;

    if (frame === "card") {
      const border = Math.round(bw * 0.09);
      const size = bw + border * 2;
      finalC.width = size; finalC.height = size;
      fx.fillStyle = fgSolid;
      roundRectPath(fx, 0, 0, size, size, 26); fx.fill();
      fx.fillStyle = bg;
      roundRectPath(fx, border * 0.4, border * 0.4, size - border * 0.8, size - border * 0.8, 20); fx.fill();
      fx.drawImage(baseC, border, border);
    } else if (frame === "label") {
      const bannerH = Math.round(bh * 0.18);
      const size = bw; const totalH = bh + bannerH;
      finalC.width = size; finalC.height = totalH;
      fx.fillStyle = bg;
      roundRectPath(fx, 0, 0, size, totalH, 22); fx.fill();
      fx.save(); roundRectPath(fx, 0, 0, size, totalH, 22); fx.clip();
      fx.drawImage(baseC, 0, 0);
      fx.fillStyle = fgSolid;
      fx.fillRect(0, bh, size, bannerH);
      fx.fillStyle = bg;
      fx.font = "700 " + Math.round(bannerH * 0.42) + "px Inter, sans-serif";
      fx.textAlign = "center"; fx.textBaseline = "middle";
      fx.fillText(labelText || "SCAN ME", size / 2, bh + bannerH / 2);
      fx.restore();
    } else if (frame === "badge") {
      const pad = Math.round(bh * 0.05);
      const badgeH = Math.round(bh * 0.11);
      const size = bw; const totalH = bh + badgeH + pad * 2;
      finalC.width = size; finalC.height = totalH;
      fx.fillStyle = bg; fx.fillRect(0, 0, size, totalH);
      fx.drawImage(baseC, 0, 0);
      const label = labelText || "SCAN ME";
      fx.font = "700 " + Math.round(badgeH * 0.5) + "px Inter, sans-serif";
      const textW = fx.measureText(label).width;
      const pillW = textW + badgeH * 1.1, pillH = badgeH;
      const px = size / 2 - pillW / 2, py = bh + pad;
      fx.fillStyle = fgSolid;
      roundRectPath(fx, px, py, pillW, pillH, pillH / 2); fx.fill();
      fx.fillStyle = bg;
      fx.textAlign = "center"; fx.textBaseline = "middle";
      fx.fillText(label, size / 2, py + pillH / 2);
    } else {
      finalC.width = bw; finalC.height = bh;
      fx.fillStyle = bg;
      roundRectPath(fx, 0, 0, bw, bh, 18); fx.fill();
      fx.save(); roundRectPath(fx, 0, 0, bw, bh, 18); fx.clip();
      fx.drawImage(baseC, 0, 0);
      fx.restore();
    }

    if (canvasRef.current) {
      canvasRef.current.width = finalC.width;
      canvasRef.current.height = finalC.height;
      const cctx = canvasRef.current.getContext("2d")!;
      cctx.clearRect(0, 0, finalC.width, finalC.height);
      cctx.drawImage(finalC, 0, 0);
    }
  }, [
    tab, url, textVal, wifiSsid, wifiPass, wifiSec, wifiHidden, socialPlatform, socialHandle,
    vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcUrl, emailTo, emailSubj, emailBody,
    phoneVal, smsNum, smsMsg, fg, bg, gradientStops, gradDir, dotStyle, eyeStyle, eyeColor,
    eyeInnerColor, useCustomEyeColors, frame, labelText, logoImg, ecLevel, cellSize, buildPayload
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setLogoImg(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [showFeedback, setShowFeedback] = useState(false);
  const pendingDownload = useRef<(() => void) | null>(null);

  const triggerDownload = (fn: () => void) => {
    pendingDownload.current = fn;
    setShowFeedback(true);
  };

  const executePendingDownload = () => {
    setShowFeedback(false);
    pendingDownload.current?.();
    pendingDownload.current = null;
  };

  const doDownloadCanvas = (mime: string, ext: string) => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(blob => {
      if (!blob) return;
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl; a.download = "qr-code." + ext;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
    }, mime, 0.95);
  };

  const downloadCanvas = (mime: string, ext: string) => {
    triggerDownload(() => doDownloadCanvas(mime, ext));
  };

  const doDownloadSVG = () => {
    if (!matrixData) return;
    const { matrix, count } = matrixData;
    const cell = cellSize, quiet = cell * 4, size = count * cell + quiet * 2;
    let shapes = "";
    const rTag = (x: number, y: number, w: number, h: number, r: number, fill: string) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
    const cTag = (cx0: number, cy0: number, rad: number, fill: string) => `<circle cx="${cx0}" cy="${cy0}" r="${rad}" fill="${fill}"/>`;

    let defs = "";
    let fillRef = fg;
    if (gradientStops && gradientStops.length) {
      const n = gradientStops.length;
      const stops = gradientStops.map((c, i) => `<stop offset="${n === 1 ? 0 : (i / (n - 1) * 100)}%" stop-color="${c}"/>`).join("");
      defs = `<defs><linearGradient id="qrGrad" gradientUnits="userSpaceOnUse" x1="${quiet}" y1="${quiet}" x2="${quiet + count * cell}" y2="${quiet + count * cell}">${stops}</linearGradient></defs>`;
      fillRef = "url(#qrGrad)";
    }

    const eyeFillRef = useCustomEyeColors ? eyeColor : fillRef;
    const eyeInnerFillRef = useCustomEyeColors ? eyeInnerColor : fillRef;

    function inFinderZone(r: number, c: number, cnt: number) {
      return (r < 7 && c < 7) || (r < 7 && c >= cnt - 7) || (r >= cnt - 7 && c < 7);
    }

    function eyeSVG(col: number, row: number) {
      const x = quiet + col * cell, y = quiet + row * cell;
      const eyeR = eyeStyle === "circle" || eyeStyle === "rounded" ? cell * 3.5 : (eyeStyle === "leaf" ? cell * 2 : 0);
      const innerR = eyeStyle === "circle" ? cell * 1.5 : (eyeStyle === "rounded" ? cell * 1 : (eyeStyle === "leaf" ? cell * 1.2 : 0));
      shapes += rTag(x, y, cell * 7, cell * 7, eyeR, eyeFillRef);
      shapes += rTag(x + cell, y + cell, cell * 5, cell * 5, eyeR * 0.7, bg);
      shapes += rTag(x + cell * 2, y + cell * 2, cell * 3, cell * 3, innerR, eyeInnerFillRef);
    }

    for (let r = 0; r < count; r++) {
      for (let c2 = 0; c2 < count; c2++) {
        if (inFinderZone(r, c2, count)) continue;
        if (!matrix[r][c2]) continue;
        const x = quiet + c2 * cell, y = quiet + r * cell;
        if (dotStyle === "dots") {
          shapes += cTag(x + cell / 2, y + cell / 2, cell * 0.42, fillRef);
        } else if (dotStyle === "rounded") {
          shapes += rTag(x + cell * 0.06, y + cell * 0.06, cell * 0.88, cell * 0.88, cell * 0.28, fillRef);
        } else {
          shapes += rTag(x, y, cell, cell, 0, fillRef);
        }
      }
    }
    eyeSVG(0, 0); eyeSVG(count - 7, 0); eyeSVG(0, count - 7);

    let logoSVG = "";
    if (logoImg) {
      const logoBox = size * 0.24, cx0 = size / 2, cy0 = size / 2;
      logoSVG += rTag(cx0 - logoBox / 2 - 6, cy0 - logoBox / 2 - 6, logoBox + 12, logoBox + 12, 14, "#FFFFFF");
      logoSVG += `<image href="${logoImg.src}" x="${cx0 - logoBox / 2}" y="${cy0 - logoBox / 2}" width="${logoBox}" height="${logoBox}" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 10)"/>`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${defs}${rTag(0, 0, size, size, 0, bg)}${shapes}${logoSVG}</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl; a.download = "qr-code.svg";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
  };

  const downloadSVG = () => {
    triggerDownload(doDownloadSVG);
  };

  const TABS: { id: TabState; label: string; icon: string }[] = [
    { id: "url", label: "Website", icon: "🔗" },
    { id: "text", label: "Text", icon: "✏️" },
    { id: "wifi", label: "WiFi", icon: "📶" },
    { id: "social", label: "Social", icon: "🌐" },
    { id: "vcard", label: "vCard", icon: "👤" },
    { id: "email", label: "Email", icon: "📧" },
    { id: "phone", label: "Phone", icon: "📞" },
    { id: "sms", label: "SMS", icon: "💬" },
    { id: "whatsapp", label: "WhatsApp", icon: "🟢" },
    { id: "pdf", label: "PDF", icon: "📄" },
  ];

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const labelCls = "text-xs font-medium text-muted-foreground block mb-1.5";

  return (
    <>
      <AnimatePresence>
        {showFeedback && (
          <QRFeedbackModal
            onProceed={executePendingDownload}
            onClose={() => { setShowFeedback(false); pendingDownload.current = null; }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 min-w-0">

            {/* Hero */}
            <div className="mb-12 text-center md:text-left">
              <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-6">
                {["No sign-up", "Runs in your browser", "PNG · JPG · SVG"].map(t => (
                  <span key={t} className="px-3 py-1 text-xs font-medium border border-border rounded-full bg-secondary/50 text-secondary-foreground">{t}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
                {heroTitle ?? "Create custom QR codes for links, WiFi, contacts and social profiles"}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {heroDesc ?? <>A free <strong className="text-foreground">online QR code generator</strong> that supports <strong className="text-foreground">website URLs</strong>, <strong className="text-foreground">WiFi passwords</strong>, <strong className="text-foreground">vCard contact cards</strong>, <strong className="text-foreground">Instagram and social profiles</strong>. Pick colors, eye styles, gradients, a logo and a border template, then download as PNG, JPG or SVG.</>}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-8 items-start">

              {/* ── INPUT PANEL ── */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">

                {/* Content Type */}
                <div className="p-5 space-y-4">
                  <Section title="Content Type">
                    <div className="flex flex-wrap gap-2">
                      {TABS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTab(t.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${tab === t.id ? "bg-primary border-primary text-primary-foreground shadow-sm" : "bg-background border-border hover:border-primary/50 text-muted-foreground"}`}
                        >
                          <span>{t.icon}</span>{t.label}
                        </button>
                      ))}
                    </div>
                  </Section>

                  <div className="space-y-3 pt-1">
                    {tab === "url" && <div><label className={labelCls}>Website URL</label><input type="url" className={inputCls} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" /></div>}
                    {tab === "text" && <div><label className={labelCls}>Plain text</label><textarea className={inputCls + " min-h-[80px]"} value={textVal} onChange={e => setTextVal(e.target.value)} placeholder="Type anything you want encoded..." /></div>}
                    {tab === "wifi" && (<>
                      <div><label className={labelCls}>Network name (SSID)</label><input type="text" className={inputCls} value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} placeholder="MyHomeWiFi" /></div>
                      <div><label className={labelCls}>Password</label><input type="text" className={inputCls} value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="••••••••" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>Security</label><select className={inputCls} value={wifiSec} onChange={e => setWifiSec(e.target.value)}><option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="nopass">None</option></select></div>
                        <div className="flex items-center gap-2 mt-5"><input type="checkbox" id="wifiH" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} className="w-4 h-4 accent-primary" /><label htmlFor="wifiH" className="text-xs text-muted-foreground">Hidden network</label></div>
                      </div>
                    </>)}
                    {tab === "social" && (<>
                      <div><label className={labelCls}>Platform</label><select className={inputCls} value={socialPlatform} onChange={e => setSocialPlatform(e.target.value)}><option value="instagram.com/">Instagram</option><option value="tiktok.com/@">TikTok</option><option value="x.com/">X (Twitter)</option><option value="facebook.com/">Facebook</option><option value="youtube.com/@">YouTube</option><option value="linkedin.com/in/">LinkedIn</option></select></div>
                      <div><label className={labelCls}>Username / handle</label><input type="text" className={inputCls} value={socialHandle} onChange={e => setSocialHandle(e.target.value)} placeholder="yourname" /></div>
                      <div className="flex items-center gap-2"><input type="checkbox" id="matchB" checked={matchBrand} onChange={e => setMatchBrand(e.target.checked)} className="w-4 h-4 accent-primary" /><label htmlFor="matchB" className="text-xs text-muted-foreground">Auto-match platform brand colors & style</label></div>
                    </>)}
                    {tab === "vcard" && (<>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>First name</label><input type="text" className={inputCls} value={vcFirst} onChange={e => setVcFirst(e.target.value)} placeholder="Jane" /></div>
                        <div><label className={labelCls}>Last name</label><input type="text" className={inputCls} value={vcLast} onChange={e => setVcLast(e.target.value)} placeholder="Doe" /></div>
                      </div>
                      <div><label className={labelCls}>Phone</label><input type="tel" className={inputCls} value={vcPhone} onChange={e => setVcPhone(e.target.value)} placeholder="+1 555 123 4567" /></div>
                      <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={vcEmail} onChange={e => setVcEmail(e.target.value)} placeholder="jane@company.com" /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>Company</label><input type="text" className={inputCls} value={vcOrg} onChange={e => setVcOrg(e.target.value)} placeholder="Company Inc." /></div>
                        <div><label className={labelCls}>Website</label><input type="text" className={inputCls} value={vcUrl} onChange={e => setVcUrl(e.target.value)} placeholder="company.com" /></div>
                      </div>
                    </>)}
                    {tab === "email" && (<>
                      <div><label className={labelCls}>Email address</label><input type="email" className={inputCls} value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="hello@example.com" /></div>
                      <div><label className={labelCls}>Subject (optional)</label><input type="text" className={inputCls} value={emailSubj} onChange={e => setEmailSubj(e.target.value)} placeholder="Subject line" /></div>
                      <div><label className={labelCls}>Message (optional)</label><textarea className={inputCls + " min-h-[80px]"} value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="Message body" /></div>
                    </>)}
                    {tab === "phone" && <div><label className={labelCls}>Phone number</label><input type="tel" className={inputCls} value={phoneVal} onChange={e => setPhoneVal(e.target.value)} placeholder="+1 555 123 4567" /></div>}
                    {tab === "sms" && (<>
                      <div><label className={labelCls}>Phone number</label><input type="tel" className={inputCls} value={smsNum} onChange={e => setSmsNum(e.target.value)} placeholder="+1 555 123 4567" /></div>
                      <div><label className={labelCls}>Message (optional)</label><textarea className={inputCls + " min-h-[80px]"} value={smsMsg} onChange={e => setSmsMsg(e.target.value)} placeholder="Pre-filled text message" /></div>
                    </>)}
                    {tab === "whatsapp" && (<>
                      <div><label className={labelCls}>WhatsApp number (with country code)</label><input type="tel" className={inputCls} value={waPhone} onChange={e => setWaPhone(e.target.value)} placeholder="+91 98765 43210" /></div>
                      <div><label className={labelCls}>Pre-filled message (optional)</label><textarea className={inputCls + " min-h-[80px]"} value={waMsg} onChange={e => setWaMsg(e.target.value)} placeholder="Hi! I'd like to place an order..." /></div>
                      <p className="text-xs text-muted-foreground">Generates a <code className="bg-muted px-1 rounded">wa.me</code> link. When scanned, WhatsApp opens directly to your number with the message pre-filled.</p>
                    </>)}
                    {tab === "pdf" && (<>
                      <div>
                        <label className={labelCls}>PDF link (Google Drive, Dropbox, or any public URL)</label>
                        <input type="url" className={inputCls} value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="https://drive.google.com/file/d/..." />
                      </div>
                      <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-2.5">
                        <p className="text-xs font-semibold text-foreground">How to get a shareable PDF link</p>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex gap-2 items-start">
                            <span className="shrink-0 font-bold text-foreground">Drive</span>
                            <span>Upload PDF → right-click → Share → "Anyone with the link" → copy link.</span>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="shrink-0 font-bold text-foreground">Dropbox</span>
                            <span>Upload PDF → Share → copy link, then change <code className="bg-muted px-1 rounded">dl=0</code> to <code className="bg-muted px-1 rounded">raw=1</code>.</span>
                          </div>
                          <div className="flex gap-2 items-start">
                            <span className="shrink-0 font-bold text-foreground">Tip</span>
                            <span>Replace the file at the same link anytime — your QR code keeps working without reprinting.</span>
                          </div>
                        </div>
                      </div>
                    </>)}
                  </div>
                </div>

                {/* Colors */}
                <div className="p-5 space-y-4">
                  <Section title="Colors & Gradients">
                    {/* Preset tiles */}
                    <div className="grid grid-cols-5 gap-2">
                      {COLOR_PRESETS.map((p, i) => (
                        <button
                          key={p.label}
                          title={p.label}
                          onClick={() => {
                            setFg(p.fg); setBg(p.bg);
                            setGradientStops(p.grad);
                            setActivePreset(i);
                          }}
                          className={`relative h-8 rounded-lg border-2 transition-all overflow-hidden ${activePreset === i ? "border-primary scale-110 shadow-md" : "border-transparent hover:border-muted-foreground/30"}`}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background: p.grad
                                ? `linear-gradient(135deg, ${p.grad.join(",")})`
                                : p.fg,
                            }}
                          />
                          {i > 4 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-[9px] font-bold leading-none shadow" style={{ textShadow: "0 1px 2px rgba(0,0,0,.5)" }}>{p.label}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Foreground</label>
                        <div className="flex items-center gap-2">
                          <input type="color" className="w-9 h-9 p-0.5 border border-border rounded-lg cursor-pointer bg-transparent" value={fg} onChange={e => { setFg(e.target.value); setGradientStops(null); setActivePreset(-1); }} />
                          <span className="font-mono text-xs text-muted-foreground">{fg}</span>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Background</label>
                        <div className="flex items-center gap-2">
                          <input type="color" className="w-9 h-9 p-0.5 border border-border rounded-lg cursor-pointer bg-transparent" value={bg} onChange={e => { setBg(e.target.value); setActivePreset(-1); }} />
                          <span className="font-mono text-xs text-muted-foreground">{bg}</span>
                        </div>
                      </div>
                    </div>

                    {gradientStops && (
                      <div>
                        <label className={labelCls}>Gradient direction</label>
                        <Segmented
                          options={[
                            { val: "diagonal" as GradDir, label: "↗ Diag" },
                            { val: "horizontal" as GradDir, label: "→ Horiz" },
                            { val: "vertical" as GradDir, label: "↓ Vert" },
                            { val: "radial" as GradDir, label: "◉ Radial" },
                          ]}
                          value={gradDir}
                          onChange={setGradDir}
                        />
                      </div>
                    )}
                  </Section>
                </div>

                {/* Shapes */}
                <div className="p-5 space-y-4">
                  <Section title="Module & Eye Shapes">
                    <div>
                      <label className={labelCls}>Module (data dots)</label>
                      <div className="grid grid-cols-5 gap-2">
                        {([
                          { val: "square", label: "■" },
                          { val: "rounded", label: "▪" },
                          { val: "dots", label: "●" },
                          { val: "diamond", label: "◆" },
                          { val: "star", label: "★" },
                        ] as const).map(o => (
                          <button
                            key={o.val}
                            onClick={() => setDotStyle(o.val as DotStyle)}
                            title={o.val}
                            className={`py-2 rounded-lg text-lg border-2 transition-all ${dotStyle === o.val ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 bg-background"}`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelCls}>Finder eye shape</label>
                      <div className="grid grid-cols-4 gap-2">
                        {([
                          { val: "square", label: "☐ Square" },
                          { val: "rounded", label: "⊡ Round" },
                          { val: "circle", label: "◎ Circle" },
                          { val: "leaf", label: "⧫ Leaf" },
                        ] as const).map(o => (
                          <button
                            key={o.val}
                            onClick={() => setEyeStyle(o.val as EyeStyle)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold border-2 transition-all ${eyeStyle === o.val ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40 bg-background text-muted-foreground"}`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input type="checkbox" id="custEye" checked={useCustomEyeColors} onChange={e => setUseCustomEyeColors(e.target.checked)} className="w-4 h-4 accent-primary" />
                      <label htmlFor="custEye" className="text-xs text-muted-foreground">Use custom eye colors</label>
                    </div>

                    {useCustomEyeColors && (
                      <div className="grid grid-cols-2 gap-3 pl-1 pt-1">
                        <div>
                          <label className={labelCls}>Eye outer color</label>
                          <div className="flex items-center gap-2">
                            <input type="color" className="w-9 h-9 p-0.5 border border-border rounded-lg cursor-pointer bg-transparent" value={eyeColor} onChange={e => setEyeColor(e.target.value)} />
                            <span className="font-mono text-xs text-muted-foreground">{eyeColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Eye inner color</label>
                          <div className="flex items-center gap-2">
                            <input type="color" className="w-9 h-9 p-0.5 border border-border rounded-lg cursor-pointer bg-transparent" value={eyeInnerColor} onChange={e => setEyeInnerColor(e.target.value)} />
                            <span className="font-mono text-xs text-muted-foreground">{eyeInnerColor}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Section>
                </div>

                {/* Frame & Logo */}
                <div className="p-5 space-y-4">
                  <Section title="Border Frame">
                    <Segmented
                      options={[
                        { val: "none" as FrameState, label: "None" },
                        { val: "card" as FrameState, label: "Card" },
                        { val: "label" as FrameState, label: "Banner" },
                        { val: "badge" as FrameState, label: "Badge" },
                      ]}
                      value={frame}
                      onChange={setFrame}
                    />
                    {(frame === "label" || frame === "badge") && (
                      <div className="mt-2"><label className={labelCls}>Banner text</label><input type="text" className={inputCls} value={labelText} onChange={e => setLabelText(e.target.value)} placeholder="SCAN ME" /></div>
                    )}
                  </Section>

                  <Section title="Logo">
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer text-sm transition-all ${logoImg ? "border-primary/50 bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"}`} onClick={() => logoInputRef.current?.click()}>
                      {logoImg ? <><span className="font-semibold">{logoName}</span><br /><span className="text-xs opacity-70">Click to change</span></> : <><span className="text-2xl block mb-1">⬆</span>Click to upload a logo<br /><span className="text-xs opacity-60">Error correction auto-switches to H</span></>}
                    </div>
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    {logoImg && (
                      <button className="text-xs text-destructive hover:underline" onClick={() => { setLogoImg(null); setLogoName(""); }}>Remove logo</button>
                    )}
                  </Section>
                </div>

                {/* Advanced */}
                <div className="p-5 space-y-4">
                  <Section title="Advanced">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Output size</label>
                        <Segmented
                          options={[
                            { val: "sm" as const, label: "S" },
                            { val: "md" as const, label: "M" },
                            { val: "lg" as const, label: "L" },
                          ]}
                          value={qrSize}
                          onChange={setQrSize}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Error correction</label>
                        <Segmented
                          options={[
                            { val: "L" as const, label: "L" },
                            { val: "M" as const, label: "M" },
                            { val: "Q" as const, label: "Q" },
                            { val: "H" as const, label: "H" },
                          ]}
                          value={logoImg ? "H" : ecLevel}
                          onChange={(v) => setEcLevel(v)}
                        />
                      </div>
                    </div>
                    {logoImg && <p className="text-xs text-muted-foreground">Error correction locked to H when a logo is present.</p>}
                  </Section>
                </div>

                {/* Download */}
                <div className="p-5">
                  <Section title="Download">
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => downloadCanvas("image/png", "png")} className="py-2.5 text-sm font-bold rounded-xl border border-border bg-background hover:bg-muted transition-colors flex flex-col items-center gap-0.5">
                        <span>PNG</span><span className="text-[10px] text-muted-foreground font-normal">screen</span>
                      </button>
                      <button onClick={() => downloadCanvas("image/jpeg", "jpg")} className="py-2.5 text-sm font-bold rounded-xl border border-border bg-background hover:bg-muted transition-colors flex flex-col items-center gap-0.5">
                        <span>JPG</span><span className="text-[10px] text-muted-foreground font-normal">photo</span>
                      </button>
                      <button onClick={downloadSVG} className="py-2.5 text-sm font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex flex-col items-center gap-0.5">
                        <span>SVG</span><span className="text-[10px] font-normal opacity-80">print</span>
                      </button>
                    </div>
                  </Section>
                </div>
              </div>

              {/* ── STAGE ── */}
              <div className="xl:col-span-1 border border-border bg-card rounded-2xl p-8 flex flex-col items-center justify-center min-h-[500px] gap-6 sticky top-28">
                <canvas ref={canvasRef} className="max-w-full h-auto drop-shadow-2xl rounded-lg" style={{ imageRendering: "pixelated" }} />

                {tab === "social" && matchBrand && (
                  <div className="w-full max-w-sm flex items-center gap-3 bg-background border border-border rounded-xl p-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: gradientStops ? `linear-gradient(135deg, ${gradientStops.join(",")})` : fg }}>
                      {(socialHandle.trim().replace(/^@/, "") || "you").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-foreground truncate">@{socialHandle.trim().replace(/^@/, "") || "yourname"}</div>
                      <div className="text-xs text-muted-foreground">{PLATFORM_STYLES[socialPlatform]?.label} · brand-matched style</div>
                    </div>
                  </div>
                )}

                <div className="w-full max-w-sm bg-background border border-border rounded-xl p-3 text-xs text-muted-foreground break-all">
                  <strong className="block text-foreground mb-1 text-[11px] uppercase tracking-wider font-semibold">Encoded data</strong>
                  <span className="font-mono">{payloadText}</span>
                </div>
              </div>

            </div>

            {/* SEO Content — spoke pages pass custom content; hub uses default */}
            {seoContent ? seoContent : (
            <div className="mt-24 space-y-24 border-t border-border pt-16">
              <section>
                <h2 className="text-3xl font-bold mb-10 text-center">How to generate a QR code</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: "1", title: "Choose a data type", body: "Website, WiFi, vCard, social profile, email, phone or SMS — pick the tab that matches what you want scanning the code to do." },
                    { step: "2", title: "Style it", body: "Set colors, gradients, module shapes (including diamonds and stars), a custom eye style, eye colors and an optional border template." },
                    { step: "3", title: "Download", body: "Export as PNG or JPG for screens and social posts, or SVG for crisp, scalable print at any size." },
                  ].map(s => (
                    <div key={s.step} className="p-6 rounded-2xl bg-card border border-border">
                      <div className="text-primary font-bold mb-4 tracking-wider text-sm uppercase">Step {s.step}</div>
                      <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center">QR code types this generator supports</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { t: "Website / URL", d: "Send scanners straight to any link." },
                    { t: "WiFi network", d: "Auto-connect without typing a password." },
                    { t: "vCard contact", d: "Save a name, phone and email as a contact." },
                    { t: "Social profile", d: "Instagram, TikTok, X, Facebook, YouTube, LinkedIn — auto-styled." },
                    { t: "Email", d: "Pre-fill a recipient, subject and message." },
                    { t: "Phone number", d: "One tap to call from a scan." },
                    { t: "SMS", d: "Pre-fill a text message and number." },
                    { t: "Plain text", d: "Encode any note, code or message." }
                  ].map(tc => (
                    <div key={tc.t} className="p-4 rounded-xl bg-card border border-border">
                      <strong className="block mb-2 text-sm">{tc.t}</strong>
                      <span className="text-xs text-muted-foreground leading-relaxed">{tc.d}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="max-w-3xl mx-auto pb-24">
                <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
                <div className="space-y-4">
                  {[
                    { q: "How do I make a QR code for my WiFi password?", a: "Switch to the WiFi tab, enter your network name (SSID), password and security type, then generate. Anyone who scans the code connects automatically without typing the password." },
                    { q: "Can I add my logo to a QR code?", a: "Yes. Upload a logo image and it's placed in the center of the code. Error correction automatically switches to High so the code still scans reliably around the logo." },
                    { q: "What is a vCard QR code?", a: "A vCard QR code stores a contact card — name, phone, email, company and website — so scanning it offers to save the contact directly to the phone, instead of opening a link." },
                    { q: "Which file format should I download for printing?", a: "SVG is best for print because it's vector-based and stays sharp at any size, from a business card to a poster. PNG and JPG are better for screens, apps and social posts." },
                    { q: "Is this QR code generator really free?", a: "Yes — unlimited QR codes, no account, no watermark, and everything is generated locally in your browser." },
                    { q: "Does the Instagram QR code match Instagram's real design?", a: "Yes. Picking Instagram on the Social tab automatically applies Instagram's actual brand gradient and a dotted module style, with a live preview card showing your handle next to the styled code." }
                  ].map((faq, i) => (
                    <details key={i} className="group border border-border rounded-xl bg-card" open={i === 0}>
                      <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold marker:content-none text-sm">
                        {faq.q}
                        <svg className="ml-4 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </summary>
                      <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </section>
            </div>
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
