import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /home-services duplicates /services — pick /services as canonical
      { source: "/home-services", destination: "/services", permanent: true },
      // /mayday → /founding48 (existing social posts)
      { source: "/mayday", destination: "/founding48", permanent: true },
      // /48 → /founding48 (new short URL for social posts)
      { source: "/48", destination: "/founding48", permanent: true },
    ];
  },
  webpack: (config, { isServer }) => {
    // Disable filesystem cache to prevent corrupted chunk errors on Windows
    config.cache = false;

    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
};

export default nextConfig;