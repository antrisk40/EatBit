import { Metadata } from "next";
import Image from "next/image";
import ImageConverter from "./ImageConverter";

export const metadata: Metadata = {
  title: "Free Image Converter — Convert JPG, PNG, WebP, HEIC Online | EatBit",
  description: "Convert images between JPG, PNG, WebP, BMP, GIF, HEIC and SVG formats free. Batch convert up to 20 files at once. 100% browser-based — images never uploaded. No sign-up.",
  keywords: "image converter free online, convert jpg png webp, image format converter, heic to jpg, png to jpg converter, webp to jpg, jpg to webp, batch image converter",
  openGraph: {
    title: "Free Image Converter — JPG, PNG, WebP, HEIC & more",
    description: "Convert between image formats instantly in your browser. Batch up to 20 files. HEIC, WebP, PNG, JPG, SVG. Free, no sign-up, no upload.",
  }
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EatBit Image Converter",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any (runs in browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Free browser-based image format converter. Converts JPG, PNG, WebP, HEIC, BMP, GIF and SVG. Batch conversion, no upload, no sign-up.",
};

export default function ImageConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ImageConverter
        defaultFrom="jpg"
        defaultTo="png"
        heroTitle="Free Image Converter — JPG, PNG, WebP, HEIC & more"
        heroDesc="Convert between image formats instantly in your browser. Supports JPG, PNG, WebP, BMP, GIF, HEIC (iPhone) and SVG. Batch convert up to 20 files. Your images never leave your device."
      />
    </>
  );
}
