import { Metadata } from "next";
import PdfEditorClient from "@/app/tools/free-pdf-editor-no-signup/PdfEditorClient";
import { ToolSeoWrapper } from "@/components/ToolSeoWrapper";

export const metadata: Metadata = {
  title: "Annotate PDF Online Free | Highlight, Draw & Add Notes",
  description: "Free online PDF annotator. Highlight text, draw shapes, redact sensitive info, and add notes to your PDF files directly in the browser.",
};

const pageProps = {
  title: "Annotate PDFs Online",
  description: "Highlight text, add sticky notes, draw shapes, and redact information securely without installing any software.",
  howToSteps: [
    { title: "Upload PDF", description: "Load your document securely in the browser." },
    { title: "Annotate & Draw", description: "Use the highlight, draw, shapes, and whiteout tools to mark up your document." },
    { title: "Save Document", description: "Export the annotated PDF to your device." }
  ],
  faqs: [
    { question: "Can I highlight text?", answer: "Yes, use the highlighting tool to emphasize important text in your document." },
    { question: "How does the redaction tool work?", answer: "Use the whiteout tool to draw a box over sensitive information. Once exported, the content underneath is permanently masked." }
  ]
};

export default function AnnotatePdfPage() {
  return (
    <>
      <div className="pt-2">
        <PdfEditorClient />
        <ToolSeoWrapper {...pageProps} />
      </div>
    </>
  );
}
