import { Metadata } from "next";
import PdfEditorClient from "@/app/tools/free-pdf-editor-no-signup/PdfEditorClient";
import { ToolSeoWrapper } from "@/components/ToolSeoWrapper";

export const metadata: Metadata = {
  title: "Add Text to PDF Online Free | Type on PDF Documents",
  description: "Easily add text to any PDF document online. Type on forms, add notes, or fill out applications directly in your browser for free.",
};

const pageProps = {
  title: "Add Text to PDF Online",
  description: "Type on any PDF document. Upload your PDF, click where you want text, add your notes, and download the finished document.",
  howToSteps: [
    { title: "Upload PDF", description: "Drag and drop your PDF file." },
    { title: "Type on PDF", description: "Select the Text tool, click anywhere on the page, and start typing." },
    { title: "Save PDF", description: "Export the document with your new text." }
  ],
  faqs: [
    { question: "How do I type on a PDF document?", answer: "Simply select the 'Text' tool, click anywhere on the document, and type. You can change font sizes and colors from the toolbar." },
    { question: "Can I fill out a non-interactive PDF form?", answer: "Yes, our text tool is perfect for filling out flat PDF forms. Just click on the blank fields and type your answers." }
  ]
};

export default function AddTextPdfPage() {
  return (
    <>
      <div className="pt-2">
        <PdfEditorClient />
        <ToolSeoWrapper {...pageProps} />
      </div>
    </>
  );
}
