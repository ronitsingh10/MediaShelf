import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["covers.openlibrary.org", "image.tmdb.org", "media.rawg.io"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;