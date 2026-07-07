import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GH_PAGES=1 builds a static export (out/) for GitHub Pages; default stays standalone.
  output: process.env.GH_PAGES ? "export" : "standalone",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
