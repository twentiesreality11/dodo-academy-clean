/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  trailingSlash: false,  // Set to false for Netlify
  serverExternalPackages: ['@neondatabase/serverless'],
};

module.exports = nextConfig;