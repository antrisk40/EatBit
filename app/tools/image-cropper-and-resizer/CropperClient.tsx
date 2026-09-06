"use client";

import React, { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, FlipHorizontal, RefreshCcw, Download, UploadCloud } from 'lucide-react';
import OtherToolsSidebar from "@/components/OtherToolsSidebar";
import Image from "next/image";

interface Preset {
  key: string;
  label: string;
  sub: string;
  ratio: number;
  w: number | null;
  h: number | null;
}

const PRESETS: Preset[] = [
  { key: 'free', label: 'Freeform', sub: 'Any ratio', ratio: NaN, w: null, h: null },
  { key: 'ig-square', label: 'Instagram Post', sub: '1:1 · 1080px', ratio: 1, w: 1080, h: 1080 },
  { key: 'ig-port', label: 'Instagram Portrait', sub: '4:5 · 1080×1350', ratio: 4 / 5, w: 1080, h: 1350 },
  { key: 'ig-story', label: 'Instagram Story', sub: '9:16 · 1080×1920', ratio: 9 / 16, w: 1080, h: 1920 },
  { key: 'li-cover', label: 'LinkedIn Cover', sub: '4:1 · 1584×396', ratio: 4 / 1, w: 1584, h: 396 },
  { key: 'li-page', label: 'LinkedIn Page Cover', sub: '4:1 · 1128×191', ratio: 1128 / 191, w: 1128, h: 191 },
  { key: 'fb-cover', label: 'Facebook Cover', sub: '820×312', ratio: 820 / 312, w: 820, h: 312 },
  { key: 'x-header', label: 'X / Twitter Header', sub: '3:1 · 1500×500', ratio: 3 / 1, w: 1500, h: 500 },
  { key: 'yt-thumb', label: 'YouTube Thumbnail', sub: '16:9 · 1280×720', ratio: 16 / 9, w: 1280, h: 720 },
  { key: 'pin-pin', label: 'Pinterest Pin', sub: '2:3 · 1000×1500', ratio: 2 / 3, w: 1000, h: 1500 },
];

export default function CropperClient() {
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[1]);
  const [activeFormat, setActiveFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(90);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  useEffect(() => {
    if (imageSrc && imageRef.current) {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: isNaN(activePreset.ratio) ? NaN : activePreset.ratio,
        viewMode: 1,
        autoCropArea: 0.9,
        background: false,
        responsive: true,
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, [imageSrc]);
  
  useEffect(() => {
    if (cropperRef.current) {
      cropperRef.current.setAspectRatio(isNaN(activePreset.ratio) ? NaN : activePreset.ratio);
    }
  }, [activePreset.ratio]);

  const loadFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImageSrc(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (!cropperRef.current) return;

    const options: Cropper.GetCroppedCanvasOptions = {};
    if (activePreset.w && activePreset.h) {
      options.width = activePreset.w;
      options.height = activePreset.h;
    }

    const canvas = cropperRef.current.getCroppedCanvas(options);
    if (!canvas) return;

    const mime = activeFormat === 'jpeg' ? 'image/jpeg' : (activeFormat === 'webp' ? 'image/webp' : 'image/png');
    const q = activeFormat === 'png' ? undefined : quality / 100;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = activeFormat === 'jpeg' ? 'jpg' : activeFormat;
      a.download = `cropped-image.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, mime, q);
  };

  const handleZoomIn = () => cropperRef.current?.zoom(0.1);
  const handleZoomOut = () => cropperRef.current?.zoom(-0.1);
  const handleRotateLeft = () => cropperRef.current?.rotate(-90);
  const handleRotateRight = () => cropperRef.current?.rotate(90);
  const handleFlipH = () => {
    if (!cropperRef.current) return;
    const data = cropperRef.current.getData();
    cropperRef.current.scaleX((data.scaleX || 1) * -1);
  };
  const handleReset = () => cropperRef.current?.reset();

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[90rem] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="mb-12 text-center md:text-left">
              <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mb-6">
                <span className="px-3 py-1 text-xs font-medium border border-border rounded-full bg-secondary/50 text-secondary-foreground">No sign-up</span>
                <span className="px-3 py-1 text-xs font-medium border border-border rounded-full bg-secondary/50 text-secondary-foreground">Processed locally</span>
                <span className="px-3 py-1 text-xs font-medium border border-border rounded-full bg-secondary/50 text-secondary-foreground">PNG · JPG · WEBP</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-3xl">
                Privacy-First Image Cropper & Resizer (Zero Uploads)
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A secure, <strong className="text-foreground">client-side image cropper and resizer</strong> with ready-made sizes for 
                <strong className="text-foreground"> Instagram posts and Stories</strong>, <strong className="text-foreground">LinkedIn banners</strong>, 
                <strong className="text-foreground"> Facebook covers</strong>, <strong className="text-foreground">X/Twitter headers</strong>, 
                <strong className="text-foreground"> YouTube thumbnails</strong> and <strong className="text-foreground">Pinterest pins</strong>. Process images locally in your browser without ever uploading them to a server.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Stage */}
              <div className="xl:col-span-2">
                <div 
                  className={`relative w-full h-[500px] md:h-[600px] rounded-xl border-2 flex items-center justify-center overflow-hidden transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-border bg-card'}`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                >
                  {!imageSrc ? (
                    <div className="text-center p-8">
                      <UploadCloud className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Drag & drop a photo here</h3>
                      <p className="text-muted-foreground mb-6">or click below to browse your files</p>
                      <button 
                        onClick={triggerFileSelect}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Choose an image
                      </button>
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/webp, image/gif" 
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <img 
                      ref={imageRef} 
                      src={imageSrc} 
                      alt="Upload to crop" 
                      className="max-w-full block"
                    />
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 space-y-8">
                  
                  {/* Presets */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Crop Size</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setActivePreset(p)}
                          className={`text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                            activePreset.key === p.key 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'bg-secondary/50 border-transparent hover:border-border text-foreground'
                          }`}
                        >
                          <div className="font-medium">{p.label}</div>
                          <div className={`text-xs mt-1 ${activePreset.key === p.key ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            {p.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Adjustments */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Adjust</h3>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={handleZoomIn} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
                      <button onClick={handleZoomOut} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
                      <button onClick={handleRotateLeft} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Rotate Left"><RotateCcw className="w-5 h-5" /></button>
                      <button onClick={handleRotateRight} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Rotate Right"><RotateCw className="w-5 h-5" /></button>
                      <button onClick={handleFlipH} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Flip Horizontal"><FlipHorizontal className="w-5 h-5" /></button>
                      <button onClick={handleReset} className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border transition" title="Reset"><RefreshCcw className="w-5 h-5" /></button>
                    </div>
                  </div>

                  {/* Export Options */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Export Format</h3>
                    <div className="flex gap-2 mb-4">
                      {(['png', 'jpeg', 'webp'] as const).map(fmt => (
                        <button
                          key={fmt}
                          onClick={() => setActiveFormat(fmt)}
                          className={`flex-1 py-2 text-sm font-semibold rounded-lg border uppercase transition-colors ${
                            activeFormat === fmt 
                              ? 'bg-green-500 text-white border-green-500' 
                              : 'bg-secondary/50 text-foreground border-transparent hover:border-border'
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    {activeFormat !== 'png' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <label className="text-muted-foreground">Quality</label>
                          <span className="font-medium">{quality}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={quality}
                          onChange={(e) => setQuality(parseInt(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}
                  </div>

                  {/* Download */}
                  <div className="pt-4 border-t border-border">
                    <button
                      disabled={!imageSrc}
                      onClick={handleDownload}
                      className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="w-5 h-5" />
                      Download Cropped Image
                    </button>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {!imageSrc 
                        ? "Upload an image to get started" 
                        : activePreset.w 
                          ? `Will export at ${activePreset.w} × ${activePreset.h} px`
                          : "Custom crop — exports at your selected size"}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* SEO/Info Sections */}
            <div className="mt-24 space-y-24 border-t border-border pt-16">
              
              {/* Steps */}
              <section>
                <div className="mb-14 text-center">
                  <h2 className="text-3xl font-bold mb-8">How to crop and resize a photo online</h2>
                  <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-border/50">
                    <Image src="/cartoon_cropper.jpg" alt="Cartoon Cropper Illustration" width={1000} height={562} className="w-full h-auto" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="text-primary font-bold mb-4 tracking-wider text-sm uppercase">Step 1</div>
                    <h3 className="text-xl font-semibold mb-3">Upload your photo</h3>
                    <p className="text-muted-foreground leading-relaxed">Drag a JPG, PNG, WEBP or GIF into the editor, or click to browse. Your file stays on your device — it&apos;s never uploaded anywhere.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="text-primary font-bold mb-4 tracking-wider text-sm uppercase">Step 2</div>
                    <h3 className="text-xl font-semibold mb-3">Pick a size or crop freely</h3>
                    <p className="text-muted-foreground leading-relaxed">Choose a platform preset like Instagram Story or LinkedIn Cover, or drag the crop box to any custom aspect ratio you need.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="text-primary font-bold mb-4 tracking-wider text-sm uppercase">Step 3</div>
                    <h3 className="text-xl font-semibold mb-3">Export and download</h3>
                    <p className="text-muted-foreground leading-relaxed">Select PNG, JPG or WEBP, set a quality level if needed, and download the finished image instantly.</p>
                  </div>
                </div>
              </section>

              {/* Cheat Sheet */}
              <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-10 text-center">Social media image size cheat sheet</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-4 px-4 font-semibold text-muted-foreground">Platform</th>
                        <th className="py-4 px-4 font-semibold text-muted-foreground">Placement</th>
                        <th className="py-4 px-4 font-semibold text-muted-foreground">Ratio</th>
                        <th className="py-4 px-4 font-semibold text-muted-foreground">Recommended size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">Instagram</td><td className="py-4 px-4">Square post</td><td className="py-4 px-4">1:1</td><td className="py-4 px-4 font-mono text-sm">1080 × 1080 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">Instagram</td><td className="py-4 px-4">Portrait post</td><td className="py-4 px-4">4:5</td><td className="py-4 px-4 font-mono text-sm">1080 × 1350 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">Instagram</td><td className="py-4 px-4">Story / Reel</td><td className="py-4 px-4">9:16</td><td className="py-4 px-4 font-mono text-sm">1080 × 1920 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">LinkedIn</td><td className="py-4 px-4">Profile background banner</td><td className="py-4 px-4">4:1</td><td className="py-4 px-4 font-mono text-sm">1584 × 396 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">LinkedIn</td><td className="py-4 px-4">Company page cover</td><td className="py-4 px-4">4:1</td><td className="py-4 px-4 font-mono text-sm">1128 × 191 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">Facebook</td><td className="py-4 px-4">Cover photo</td><td className="py-4 px-4">2.63:1</td><td className="py-4 px-4 font-mono text-sm">820 × 312 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">X (Twitter)</td><td className="py-4 px-4">Header photo</td><td className="py-4 px-4">3:1</td><td className="py-4 px-4 font-mono text-sm">1500 × 500 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">YouTube</td><td className="py-4 px-4">Video thumbnail</td><td className="py-4 px-4">16:9</td><td className="py-4 px-4 font-mono text-sm">1280 × 720 px</td></tr>
                      <tr className="hover:bg-muted/30 transition-colors"><td className="py-4 px-4">Pinterest</td><td className="py-4 px-4">Standard pin</td><td className="py-4 px-4">2:3</td><td className="py-4 px-4 font-mono text-sm">1000 × 1500 px</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* FAQ Section */}
              <section className="max-w-3xl mx-auto pb-24">
                <h2 className="text-3xl font-bold mb-10 text-center">Frequently asked questions</h2>
                <div className="space-y-4">
                  <details className="group border border-border rounded-lg bg-card" open>
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      What is the best image size for an Instagram post?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>Square posts look best at 1080×1080px (1:1), portrait posts at 1080×1350px (4:5), and Stories or Reels at 1080×1920px (9:16). All three ratios are one-tap presets in the cropper above.</p>
                    </div>
                  </details>
                  
                  <details className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      How do I crop a photo for a LinkedIn banner?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>LinkedIn&apos;s personal profile background photo uses a 4:1 ratio at 1584×396px. Pick the LinkedIn Cover preset, position your photo, and download.</p>
                    </div>
                  </details>
                  
                  <details className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      Can I resize an image without losing quality?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>Yes. Exporting as PNG keeps your crop lossless. JPG and WEBP include a quality slider so you can balance sharpness against file size.</p>
                    </div>
                  </details>

                  <details className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      Is this image cropper free to use?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>Yes — it&apos;s free, with no sign-up, no watermark, and no limit on how many images you crop.</p>
                    </div>
                  </details>

                  <details className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      Does this tool upload my photos to a server?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>No. Every crop, rotation and format conversion happens locally in your browser using canvas rendering. Your image is never transmitted anywhere.</p>
                    </div>
                  </details>

                  <details className="group border border-border rounded-lg bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold marker:content-none">
                      What image formats can I download?
                      <span className="relative ml-4 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground">
                      <p>PNG (lossless, supports transparency), JPG (small file size, ideal for photos) or WEBP (modern format with strong compression at high quality).</p>
                    </div>
                  </details>
                </div>
              </section>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <OtherToolsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
