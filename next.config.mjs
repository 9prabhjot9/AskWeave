/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use export for static site generation
  output: 'export',
  // Disable dynamic route static generation errors
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // Disable dynamic route handling
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/questions': { page: '/questions' },
      '/questions/ask': { page: '/questions/ask' },
      '/tags': { page: '/tags' },
      '/users': { page: '/users' },
      '/governance': { page: '/governance' },
      // Add other static routes here
    };
  },
  trailingSlash: true,
  // Disable dynamic routes error for static export
  // This works with Next.js 14+
  experimental: {
    appDocumentPreloading: true,
    optimizeCss: true,
    instrumentationHook: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for modules that only work in Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
