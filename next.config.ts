import type { NextConfig } from "next";

// Site estático (pasta out/), publicado no Firebase Hosting.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
