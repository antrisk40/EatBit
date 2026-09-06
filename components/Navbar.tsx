"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname.startsWith(path + '/');
    return `font-medium transition-colors ${
      isActive 
        ? "text-primary underline decoration-2 underline-offset-8" 
        : "text-muted-foreground hover:text-primary"
    }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/EatBit.svg" alt="EatBit Logo" width={40} height={40} />
              <span className="font-bold text-2xl tracking-tight">
                <span className="text-primary">Eat</span><span className="text-foreground">Bit</span>
              </span>
            </Link>
          </motion.div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link className={getLinkClass("/services")} href="/services">Services</Link>
            <Link className={getLinkClass("/plans")} href="/plans">Plans</Link>
            <Link className={getLinkClass("/samples")} href="/samples">Samples</Link>
            <Link className={getLinkClass("/blog")} href="/blog">Blog</Link>
            <div className="relative group py-2">
              <span className={`cursor-pointer ${getLinkClass("/tools")}`}>🛠 Tools</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-80 bg-background border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 gap-0.5 z-50 max-h-[80vh] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Image Tools</div>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/gemini-watermark-remover")}`} href="/tools/gemini-watermark-remover">✨ Watermark Remover</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/image-cropper-and-resizer")}`} href="/tools/image-cropper-and-resizer">🖼️ Image Cropper</Link>
                <div className="my-1 border-t border-border" />
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Image Converters</div>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/image-converter")}`} href="/tools/image-converter">🔄 Image Converter (All)</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/heic-to-jpg-converter")}`} href="/tools/heic-to-jpg-converter">📱 HEIC to JPG</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/webp-to-jpg-converter")}`} href="/tools/webp-to-jpg-converter">🌐 WebP to JPG</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/png-to-jpg-converter")}`} href="/tools/png-to-jpg-converter">🔵 PNG to JPG</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/jpg-to-png-converter")}`} href="/tools/jpg-to-png-converter">🟠 JPG to PNG</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/jpg-to-webp-converter")}`} href="/tools/jpg-to-webp-converter">⚡ JPG to WebP</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/png-to-webp-converter")}`} href="/tools/png-to-webp-converter">⚡ PNG to WebP</Link>
                <div className="my-1 border-t border-border" />
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">PDF Tools</div>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/free-pdf-editor-no-signup")}`} href="/tools/free-pdf-editor-no-signup">✏️ Free PDF Editor (No Sign-up)</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/merge-and-split-pdf")}`} href="/tools/merge-and-split-pdf">📑 PDF Merger (Free, No Sign-up)</Link>
                <div className="my-1 border-t border-border" />
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">QR Codes</div>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/qr-code-generator")}`} href="/tools/qr-code-generator">📱 QR Generator (All Types)</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/wifi-qr-code-generator")}`} href="/tools/wifi-qr-code-generator">📶 WiFi QR Code</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/whatsapp-qr-code-generator")}`} href="/tools/whatsapp-qr-code-generator">🟢 WhatsApp QR Code</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/vcard-qr-code-generator")}`} href="/tools/vcard-qr-code-generator">👤 vCard QR Code</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/email-qr-code-generator")}`} href="/tools/email-qr-code-generator">📧 Email QR Code</Link>
                <Link className={`block px-3 py-2 rounded-lg text-sm hover:bg-muted ${getLinkClass("/tools/pdf-qr-code-generator")}`} href="/tools/pdf-qr-code-generator">📄 PDF QR Code</Link>
              </div>
            </div>
            <Link className={getLinkClass("/careers")} href="/careers">Careers</Link>
            <Link className={getLinkClass("/contact-us")} href="/contact-us">Contact Us</Link>
            <Button className="rounded-none shadow-lg shadow-orange-500/30 w-[140px] font-semibold transition-transform hover:scale-105" asChild>
              <Link href="/contact-us">Get Started</Link>
            </Button>
            <ModeToggle />
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}



