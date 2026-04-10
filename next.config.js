/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  // No Netlify-specific settings
};

module.exports = nextConfig;