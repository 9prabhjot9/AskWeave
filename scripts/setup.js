#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Setting up AskWeave - Decentralized Q&A Platform');
console.log('---------------------------------------------------');

// Paths to our scripts
const fixScript = path.join(__dirname, 'fix-weavedb-dependencies.js');
const mockDeployScript = path.join(__dirname, 'mock-deploy.js');

try {
  console.log('Step 1: Fixing WeaveDB dependencies...');
  execSync(`node ${fixScript}`, { stdio: 'inherit' });
  console.log('');

  console.log('Step 2: Setting up mock deployment for development...');
  execSync(`node ${mockDeployScript}`, { stdio: 'inherit' });
  console.log('');

  console.log('✅ Setup completed successfully!');
  console.log('---------------------------------------------------');
  console.log('Next steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Open your browser at: http://localhost:3000');
  console.log('');
  console.log('⚠️ IMPORTANT: In this development setup, your data is stored in localStorage,');
  console.log('   not on the Arweave blockchain. To use actual blockchain storage, follow');
  console.log('   the instructions in README.md for "Production Setup".');
  console.log('---------------------------------------------------');
} catch (error) {
  console.error('❌ Error during setup:', error.message);
  process.exit(1);
} 