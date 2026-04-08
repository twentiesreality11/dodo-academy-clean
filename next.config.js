/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
      },
    ],
  },
  trailingSlash: true,
  serverExternalPackages: ['sqlite3', 'bcryptjs'],
};

module.exports = nextConfig;