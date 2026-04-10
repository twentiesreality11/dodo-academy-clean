/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' if you have it - this breaks API routes
  images: {
    unoptimized: true,
  },
  // Ensure API routes are handled correctly
  trailingSlash: false,
};

module.exports = nextConfig;