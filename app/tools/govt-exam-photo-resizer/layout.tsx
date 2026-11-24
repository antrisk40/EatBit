import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Exam Photo & Signature Resizer — SSC, UPSC, IBPS, NEET | EatBit",
  description:
    "Resize and compress your photo and signature for SSC, UPSC, IBPS, SBI, RRB, NEET, JEE, and all government exam forms. Set exact pixel dimensions and file size (KB) in seconds. 100% free, no upload, no sign-up.",
  keywords: [
    "government exam photo resizer",
    "govt exam image cropper",
    "ssc exam image cropper",
    "ssc photo cropper online",
    "ssc photo resizer",
    "ssc signature resizer 10kb to 20kb",
    "ssc photo resizer 20kb to 50kb",
    "upsc photo resize",
    "upsc photo cropper",
    "ibps photo resize",
    "sbi po photo resize",
    "neet photo resize",
    "jee photo resize",
    "rrb photo resize",
    "government exam photo size",
    "compress photo to 50kb",
    "compress photo to 20kb",
    "compress photo to 100kb",
    "resize photo for government form",
    "photo size for online application",
    "signature resize for exam",
    "compress signature to 20kb",
    "compress signature to 10kb",
    "online application photo size",
    "photo 200x230 resize",
    "photo 100x120 resize",
    "exam form photo compressor",
    "govt form photo jpeg resize",
    "resize photo without losing quality",
    "photo resize online free india",
    "government exam photo format",
    "passport size photo resize online",
  ],
  openGraph: {
    title: "Government Exam Photo & Signature Resizer — SSC, UPSC, IBPS, NEET | EatBit",
    description:
      "Resize photos and signatures for SSC, UPSC, IBPS, NEET, JEE, RRB online forms. Set exact pixel size and KB limit. Free, private, no upload.",
    url: "https://eatbit.in/tools/govt-exam-photo-resizer",
    siteName: "EatBit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Exam Photo & Signature Resizer | EatBit",
    description:
      "Resize photos and signatures for SSC, UPSC, IBPS, NEET, JEE exams. Free, private, runs in your browser.",
  },
  alternates: {
    canonical: "https://eatbit.in/tools/govt-exam-photo-resizer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
