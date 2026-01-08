import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ FIX: Forzar que todos los assets (/_next/*) se sirvan desde la cápsula

  // Esto evita “white screen” cuando el HTML se entrega vía router con dominio limpio.

  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
};

export default nextConfig;
