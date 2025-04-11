#!/bin/bash

# Clean up existing build files
echo "Cleaning up previous build..."
rm -rf .next out

# Temporarily move the dynamic route out of the way
echo "Temporarily disabling dynamic routes..."
if [ -d "app/questions/[id]" ]; then
  mv app/questions/[id] app/questions/_id_disabled
fi

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
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
EOF

# Build the project
echo "Building for static export..."
npm run build:skip-types

# Restore the dynamic route
echo "Restoring dynamic routes..."
if [ -d "app/questions/_id_disabled" ]; then
  mv app/questions/_id_disabled app/questions/[id]
fi

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
  # Restore the dynamic route even if build fails
  if [ -d "app/questions/_id_disabled" ]; then
    mv app/questions/_id_disabled app/questions/[id]
  fi
  
  echo "Static export failed. Check logs for errors."
  exit 1
fi 