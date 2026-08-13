import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@pilio/gemini-watermark-remover', 'mediabunny'],
};

export default nextConfig;
