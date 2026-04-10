/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // Disable API routes from being handled by Next.js
  rewrites: async () => [],
  redirects: async () => [],
};

module.exports = nextConfig;