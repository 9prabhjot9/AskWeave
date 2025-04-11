/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Disable dynamic route generation
  skipTrailingSlashRedirect: true,
  webpack: (config, { isServer }) => {
    // Fix for modules that only work in Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, crypto: false, path: false,
      };
    }
    return config;
  },
  // Disable dynamic route handling
  experimental: {
    appDocumentPreloading: true,
    optimizeCss: true,
    instrumentationHook: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
