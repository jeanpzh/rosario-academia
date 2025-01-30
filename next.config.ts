import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    ],
  },
};
export default nextConfig;
