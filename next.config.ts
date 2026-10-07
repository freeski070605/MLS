import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  images: { remotePatterns: [] },
  async redirects(){return [
    {source:'/artists/ke',destination:'/artists/shante',permanent:true},
    {source:'/artists/titi',destination:'/artists/christina',permanent:true}
  ]}
};
export default nextConfig;
