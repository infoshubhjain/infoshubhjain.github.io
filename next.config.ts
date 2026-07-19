import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GH_PAGES=1 builds a static export (out/) for GitHub Pages; default stays standalone.
  output: process.env.GH_PAGES ? "export" : "standalone",
  // Emit each route as dir/index.html so GitHub Pages serves /prototype AND /prototype/.
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
