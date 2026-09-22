import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free Online PDF & Image Tools | EatBit",
  description: "Edit, merge, split, compress, sign, and convert PDF and image files directly in your browser. 100% free and secure.",
};

export default function ToolsHubPage() {
  const toolCategories = [
    {
      title: "Popular PDF Tools",
      tools: [
        { name: "Edit PDF Online", path: "/tools/edit-pdf-text-online", icon: "✏️", desc: "Edit text and images directly in your browser." },
        { name: "Add Text to PDF", path: "/tools/add-text-to-pdf", icon: "📝", desc: "Type on any PDF document." },
        { name: "Sign PDF", path: "/tools/sign-pdf-online", icon: "✍️", desc: "Draw or upload your signature." },
        { name: "Annotate PDF", path: "/tools/annotate-pdf", icon: "🔗", desc: "Highlight text and add shapes." },
        { name: "Merge & Split PDF", path: "/tools/merge-and-split-pdf", icon: "📑", desc: "Combine or separate PDF pages." },
      ]
    },
    {
      title: "Image Converters",
      tools: [
        { name: "JPG to PNG", path: "/tools/jpg-to-png-converter", icon: "🟠", desc: "Convert JPG to transparent PNG." },
        { name: "PNG to JPG", path: "/tools/png-to-jpg-converter", icon: "🔵", desc: "Convert PNG to optimized JPG." },
        { name: "WebP to JPG", path: "/tools/webp-to-jpg-converter", icon: "🌐", desc: "Convert WebP images to JPG." },
        { name: "HEIC to JPG", path: "/tools/heic-to-jpg-converter", icon: "📱", desc: "Convert iPhone photos to JPG." },
      ]
    },
    {
      title: "Image Tools",
      tools: [
        { name: "Watermark Remover", path: "/tools/gemini-watermark-remover", icon: "✨", desc: "AI-powered watermark removal." },
        { name: "Image Cropper", path: "/tools/image-cropper-and-resizer", icon: "🖼️", desc: "Crop and resize images instantly." },
      ]
    },
    {
      title: "QR Code Generators",
      tools: [
        { name: "All QR Codes", path: "/tools/qr-code-generator", icon: "📱", desc: "Generate any type of QR code." },
        { name: "WiFi QR", path: "/tools/wifi-qr-code-generator", icon: "📶", desc: "Share your WiFi network." },
        { name: "WhatsApp QR", path: "/tools/whatsapp-qr-code-generator", icon: "🟢", desc: "Start WhatsApp chats easily." },
        { name: "PDF QR", path: "/tools/pdf-qr-code-generator", icon: "📄", desc: "Link directly to a PDF file." },
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Free Online PDF & Image Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Edit, merge, split, compress, sign, and convert PDF and image files directly in your browser. No installation or registration required.
          </p>
          <Button size="lg" className="rounded-none font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
            <Link href="/tools/free-pdf-editor-no-signup">Launch PDF Editor</Link>
          </Button>
        </div>

        <div className="space-y-16">
          {toolCategories.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold mb-6 text-foreground border-b border-border pb-2">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool, i) => (
                  <Link href={tool.path} key={i} className="group block bg-card border border-border p-6 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">{tool.icon}</div>
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground">{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
