import { Metadata } from "next";
import ImageConverter, { type Format } from "./ImageConverter";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Free Image Converter — JPG, PNG, WebP, HEIC Online | EatBit",
  description:
    "Convert images between JPG, PNG, WebP, BMP, GIF, HEIC and SVG in your browser. Batch up to 20 files. Nothing is uploaded. No sign-up.",
  alternates: { canonical: "https://eatbit.in/tools/image-converter" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EatBit Image Converter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (runs in browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Browser-based image format converter for JPG, PNG, WebP, HEIC, BMP, GIF and SVG. Batch conversion with no upload.",
};

const FROM_FORMATS = new Set<Format>(["jpg", "png", "webp", "bmp", "gif", "heic", "svg"]);
const TO_FORMATS = new Set<Format>(["jpg", "png", "webp", "bmp"]);

export default async function ImageConverterPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const from = FROM_FORMATS.has(sp.from as Format) ? (sp.from as Format) : "jpg";
  const to = TO_FORMATS.has(sp.to as Format) ? (sp.to as Format) : "png";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <ImageConverter
        defaultFrom={from}
        defaultTo={to}
        heroTitle="Free Image Converter — JPG, PNG, WebP, HEIC and more"
        heroDesc="Convert between image formats in your browser. Supports JPG, PNG, WebP, BMP, GIF, HEIC (iPhone) and SVG. Batch up to 20 files. Images never leave this device."
      />
      <AdBanner slot="tool-bottom" className="mt-6" />
    </>
  );
}
