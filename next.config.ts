import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["swiper"],
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimizaciones adicionales para performance
    unoptimized: false, // Mantener optimización activa
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.dj-presskit.com", // Allow API images from centralized service
      },
      {
        protocol: "https",
        hostname: "i1.sndcdn.com",
      },
      {
        protocol: "https",
        hostname: "imagedelivery.net", // Cloudflare Images
      },
    ],
  },
  // Optimizaciones adicionales para performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "react-intersection-observer"],
  },
  // Compresión y optimización
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
