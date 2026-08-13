import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GH_PAGES=1 builds a static export (out/) for GitHub Pages; default stays standalone.
  output: process.env.GH_PAGES ? "export" : "standalone",
  // Emit each route as dir/index.html so GitHub Pages serves both /route and /route/.
  trailingSlash: true,
  // The static export has no image optimizer, so next/image must serve files as-is.
  images: { unoptimized: true },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
