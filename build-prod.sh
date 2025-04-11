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

# Build the project with static export
echo "Building for production with static export..."
npm run build

# Verify the build
if [ -d "out" ]; then
  echo "Build successful! Static files are in the 'out' directory."
  
  # Add .nojekyll file for GitHub Pages (if deploying there)
  touch out/.nojekyll
  
  echo "Production build completed successfully!"
else
  echo "Build failed or out directory not found. Check logs for errors."
  exit 1
fi 