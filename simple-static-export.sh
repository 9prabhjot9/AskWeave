#!/bin/bash

# Clean up existing build files
echo "Cleaning up previous build..."
rm -rf .next out

# Install dependencies
echo "Installing dependencies..."
npm install --no-audit --no-fund

# Set environment variables for build
echo "Setting environment variables..."
export NODE_OPTIONS="--max-old-space-size=4096"
export NEXT_TELEMETRY_DISABLED=1
export NEXT_SKIP_TYPE_CHECK=1

# Create custom next.config.js
echo "Creating temporary next.config.js..."
cat > next.config.js << 'EOF'
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
EOF

# Build the project
echo "Building for static export..."
npm run build:skip-types

# Check if out directory exists
if [ -d "out" ]; then
  echo "Static export successful! Files are in the 'out' directory."
  
  # Add .nojekyll file for GitHub Pages
  touch out/.nojekyll
  
  # Create 404 page if not-found.html exists
  if [ -f "out/not-found.html" ]; then
    cp out/not-found.html out/404.html
  fi
  
  echo "Static export preparation complete!"
else
  echo "Static export failed. Check logs for errors."
  exit 1
fi 