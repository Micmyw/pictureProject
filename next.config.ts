import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "images.openai.com" },
      { protocol: "https", hostname: "placehold.co" }
    ]
  }
};

export default nextConfig;
