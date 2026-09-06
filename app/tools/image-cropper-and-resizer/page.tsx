import React from 'react';
import { Metadata } from 'next';
import CropperClient from './CropperClient';

export const metadata: Metadata = {
  title: 'Privacy-First Image Cropper & Resizer Online (No Uploads)',
  description: 'Crop and resize images locally in your browser without server uploads. Secure image resizer for exact social media dimensions. Free, private, and client-side processing.',
  keywords: [
    'privacy first image cropper online',
    'crop image online without server upload',
    'client-side image cropper free',
    'exact pixel image cropper',
    'crop photo online no watermark',
    'resize image locally in browser',
    'resize image without losing quality free',
    'image resizer for social media exact dimensions',
    'secure image resizer no upload'
  ],
  openGraph: {
    title: 'Privacy-First Image Cropper & Resizer Online (No Uploads)',
    description: 'Crop and resize images locally in your browser without server uploads. Secure image resizer for exact social media dimensions. Free, private, and client-side processing.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy-First Image Cropper & Resizer Online (No Uploads)',
    description: 'Crop and resize images locally in your browser without server uploads. Secure image resizer for exact social media dimensions. Free, private, and client-side processing.',
  }
};

export default function ImageCropperPage() {
  return <CropperClient />;
}
