import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['*'],
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
