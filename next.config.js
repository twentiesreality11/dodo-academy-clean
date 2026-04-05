/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration
  trailingSlash: true,
  
  // Image configuration
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
    ],
  },
  
  // External packages that need Node.js modules
  serverExternalPackages: ['sqlite3', 'bcryptjs'],
  
  // Turbopack configuration (empty is fine for most projects)
  turbopack: {},
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;