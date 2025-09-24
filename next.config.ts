import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permitir que el build de producción se complete incluso si hay errores de ESLint
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
