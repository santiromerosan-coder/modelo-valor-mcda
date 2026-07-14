import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Permitir requests cross-origin desde la URL de preview del sandbox
  // (necesario para que el usuario pueda acceder vía preview-*.space-z.ai)
  allowedDevOrigins: [
    "preview-chat-b3b58e1b-874a-4faa-bee3-f44445f2a06b.space-z.ai",
    "*.space-z.ai",
    "*.space-z.ai:443",
  ],
};

export default nextConfig;
