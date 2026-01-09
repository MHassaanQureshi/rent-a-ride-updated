import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'car-rental-website-five.vercel.app',
      },
    ],
  },
};
export default nextConfig;