import { Metadata } from "next";
import PdfEditorClient from "@/app/tools/free-pdf-editor-no-signup/PdfEditorClient";
import { ToolSeoWrapper } from "@/components/ToolSeoWrapper";

export const metadata: Metadata = {
  title: "Sign PDF Online Free | Add Electronic Signature to PDF",
  description: "Sign PDF documents online for free. Draw your signature, type it, or upload an image. Secure, private, and works in your browser.",
};

const pageProps = {
  title: "Sign PDF Documents Online",
  description: "Add an electronic signature to your contracts and forms securely. No uploads to external servers—your documents remain private.",
  howToSteps: [
    { title: "Upload Document", description: "Drag and drop the PDF you need to sign." },
    { title: "Add Signature", description: "Click 'Image' to upload your signature, or use the drawing/text tools to create one." },
    { title: "Save Signed PDF", description: "Export your document with the signature securely embedded." }
  ],
  faqs: [
    { question: "How do I add my signature?", answer: "You can upload a PNG/JPG of your signature using the Image tool, or draw it using the pen tools provided in the editor." },
    { question: "Is it safe to sign contracts here?", answer: "Yes. All processing is done locally in your browser. Your confidential contracts are never uploaded to any server." }
  ]
};

export default function SignPdfPage() {
  return (
    <>
      <div className="pt-2">
        <PdfEditorClient />
        <ToolSeoWrapper {...pageProps} />
      </div>
    </>
  );
}
