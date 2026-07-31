import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // AVIF first (roughly 20-30% smaller than WebP), WebP as the fallback.
    formats: ['image/avif', 'image/webp'],
    // Photos are static and content-hashed by path, so cache the optimized
    // variants for a year instead of re-optimizing every 60s.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ]
  },
  poweredByHeader: false
};

export default nextConfig;
