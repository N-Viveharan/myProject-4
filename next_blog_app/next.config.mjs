/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow large file uploads via server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
