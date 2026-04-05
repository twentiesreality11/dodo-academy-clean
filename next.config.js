/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['sqlite3', 'bcryptjs'],
  },
  // Allow Next.js to handle SQLite properly
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        assert: false,
        url: false,
        http: false,
        https: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;