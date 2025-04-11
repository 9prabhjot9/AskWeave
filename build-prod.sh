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

# Build the project with standalone output
echo "Building for production..."
npm run build

# Verify the build
if [ -d ".next" ]; then
  echo "Build successful! Build artifacts are in the .next directory."
else
  echo "Build failed. Check logs for errors."
  exit 1
fi

# Add .nojekyll file for GitHub Pages (if deploying there)
touch .next/.nojekyll

echo "Production build completed successfully!" 