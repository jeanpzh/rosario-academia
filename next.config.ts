import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol: "https",
        hostname: "images8.alphacoders.com",
      },
      {
        protocol: "https",
        hostname: "cdn.www.gob.pe",
      },
      {
        protocol: "https",
        hostname: "scontent-lim1-1.xx.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "gcdn.emol.cl",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
};

export default nextConfig;
