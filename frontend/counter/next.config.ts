import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

export default nextConfig;
