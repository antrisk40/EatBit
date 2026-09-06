"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOOLS = [
  {
    id: "gemini-watermark-remover",
    title: "Gemini Watermark Remover",
    desc: "Remove the visible Google Gemini sparkles logo from images and videos free.",
    path: "/tools/gemini-watermark-remover",
    icon: "✨",
  },
  {
    id: "image-cropper-and-resizer",
    title: "Image Cropper & Resizer",
    desc: "Securely crop and resize images locally in your browser. Zero uploads.",
    path: "/tools/image-cropper-and-resizer",
    icon: "🖼️",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    desc: "Create free custom QR codes for links, WiFi, vCards, and social profiles.",
    path: "/tools/qr-code-generator",
    icon: "📱",
  },
  {
    id: "wifi-qr-code-generator",
    title: "WiFi QR Code",
    desc: "Share your WiFi password as a scannable QR code. Free, no sign-up.",
    path: "/tools/wifi-qr-code-generator",
    icon: "📶",
  },
  {
    id: "whatsapp-qr-code-generator",
    title: "WhatsApp QR Code",
    desc: "Create a scan-to-chat WhatsApp QR code with a pre-filled message.",
    path: "/tools/whatsapp-qr-code-generator",
    icon: "🟢",
  },
  {
    id: "vcard-qr-code-generator",
    title: "vCard QR Code",
    desc: "Business card QR code that saves your contact details in one scan.",
    path: "/tools/vcard-qr-code-generator",
    icon: "👤",
  },
  {
    id: "email-qr-code-generator",
    title: "Email QR Code",
    desc: "Scan to open an email with To, Subject and Body pre-filled.",
    path: "/tools/email-qr-code-generator",
    icon: "📧",
  },
  {
    id: "pdf-qr-code-generator",
    title: "PDF QR Code",
    desc: "Link any hosted PDF (menu, brochure, syllabus) to a scannable QR code.",
    path: "/tools/pdf-qr-code-generator",
    icon: "📄",
  },
  {
    id: "image-converter",
    title: "Image Converter",
    desc: "Convert between JPG, PNG, WebP, HEIC, BMP, GIF and SVG. Batch up to 20 files.",
    path: "/tools/image-converter",
    icon: "🔄",
  },
  {
    id: "heic-to-jpg-converter",
    title: "HEIC to JPG",
    desc: "Convert iPhone HEIC photos to JPG. Open them on Windows, Android and any app.",
    path: "/tools/heic-to-jpg-converter",
    icon: "📱",
  },
  {
    id: "webp-to-jpg-converter",
    title: "WebP to JPG",
    desc: "Convert Chrome WebP images to JPG. Open them in any app, anywhere.",
    path: "/tools/webp-to-jpg-converter",
    icon: "🌐",
  },
  {
    id: "png-to-jpg-converter",
    title: "PNG to JPG",
    desc: "Convert PNG to JPG and reduce file size by up to 80%. Batch supported.",
    path: "/tools/png-to-jpg-converter",
    icon: "🔵",
  },
  {
    id: "jpg-to-png-converter",
    title: "JPG to PNG",
    desc: "Convert JPG to PNG to add transparency support. Lossless output.",
    path: "/tools/jpg-to-png-converter",
    icon: "🟠",
  },
  {
    id: "jpg-to-webp-converter",
    title: "JPG to WebP",
    desc: "Compress images for the web. 25–35% smaller than JPG at same quality.",
    path: "/tools/jpg-to-webp-converter",
    icon: "⚡",
  },
  {
    id: "png-to-webp-converter",
    title: "PNG to WebP",
    desc: "Convert PNG to WebP with transparency. Up to 50% smaller files.",
    path: "/tools/png-to-webp-converter",
    icon: "⚡",
  },
  {
    id: "free-pdf-editor-no-signup",
    title: "Free PDF Editor No Sign-up",
    desc: "Edit PDF text, insert images, redact with whiteout, rotate and export directly in your browser.",
    path: "/tools/free-pdf-editor-no-signup",
    icon: "✏️",
  },
  {
    id: "merge-and-split-pdf",
    title: "PDF Merger Free No Sign-up",
    desc: "Bundle, reorder, merge, and split PDF files locally in your browser.",
    path: "/tools/merge-and-split-pdf",
    icon: "📑",
  },
];

export default function OtherToolsSidebar() {
  const pathname = usePathname();

  const otherTools = TOOLS.filter((tool) => tool.path !== pathname);

  if (otherTools.length === 0) return null;

  return (
    <aside className="sticky top-28 flex flex-col gap-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
        Other Tools You Might Like
      </h3>
      <div className="flex flex-col gap-4">
        {otherTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="group block p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{tool.icon}</span>
              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {tool.title}
              </h4>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
