import { Metadata } from "next";
import PdfEditorClient from "@/app/tools/free-pdf-editor-no-signup/PdfEditorClient";
import { ToolSeoWrapper } from "@/components/ToolSeoWrapper";

export const metadata: Metadata = {
  title: "Edit PDF Text Online Free | Replace Words & Correct Typos",
  description: "Free online PDF text editor. Click on any text in your PDF to edit it, fix typos, change fonts, and rewrite sentences. 100% private and in-browser.",
};

const pageProps = {
  title: "Edit PDF Text Online",
  description: "Click anywhere on your PDF to edit text, replace words, correct typos, and change font styles directly in your browser.",
  howToSteps: [
    { title: "Upload PDF", description: "Drag and drop your PDF into the editor." },
    { title: "Edit Text", description: "Select the Text tool, click on existing text, and type to replace it." },
    { title: "Download", description: "Click Export to save your edited PDF with no watermarks." }
  ],
  faqs: [
    { question: "Can I edit existing text in my PDF?", answer: "Yes! Our editor detects the original text and allows you to rewrite it, matching the font size and position seamlessly." },
    { question: "Is this tool free?", answer: "Yes, it is 100% free with no hidden subscriptions or watermarks." }
  ]
};

export default function EditPdfTextPage() {
  return (
    <>
      <div className="pt-2">
        <PdfEditorClient />
        <ToolSeoWrapper {...pageProps} />
      </div>
    </>
  );
}
