const withTM = require('next-transpile-modules')(['eccrypto', 'secp256k1', 'coffee-script']);
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Server-side rendering instead of static export
  // output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Disable server-side features that aren't compatible with static export
  webpack: (config, { isServer }) => {
    // Fix for native modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        path: require.resolve('path-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        vm: require.resolve('vm-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
      };
      
      // Add buffer polyfill
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }
    
    // Exclude problematic dependencies from being bundled
    config.externals = [
      ...(config.externals || []),
      'weavedb-sdk',
      'weavedb-sdk-node',
      'eccrypto',
      'vm2'
    ];

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    // Add rule to handle vm2
    config.module.rules.push({
      test: /node_modules\/vm2/,
      use: 'null-loader'
    });
    
    // Add rule for Bundlr specific packages
    config.module.rules.push({
      test: /node_modules\/@bundlr-network\/client|node_modules\/arbundles/,
      use: 'null-loader'
    });

    return config;
  },
  
  // Disable server-side rendering for routes with compatibility issues
  modularizeImports: {
    'weavedb-sdk': {
      skipDefaultConversion: true,
      transform: 'weavedb-sdk/{{member}}',
    },
  },
  
  // Increase memory limit
  experimental: {
    appDocumentPreloading: true,
    optimizeCss: true,
    instrumentationHook: true,
  },
}

module.exports = withTM(nextConfig); 