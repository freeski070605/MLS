import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: { remotePatterns: [] }
};
export default nextConfig;
