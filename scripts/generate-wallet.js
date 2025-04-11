#!/usr/bin/env node

const Arweave = require("arweave");
const fs = require("fs");
const path = require("path");

// Initialize Arweave
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

async function generateWallet() {
  console.log("Generating Arweave wallet...");
  
  // Create .arweave directory if it doesn't exist
  const walletDir = path.resolve(__dirname, "../.arweave");
  if (!fs.existsSync(walletDir)) {
    fs.mkdirSync(walletDir, { recursive: true });
  }
  
  const walletPath = path.join(walletDir, "wallet.json");
  
  // Check if wallet already exists
  if (fs.existsSync(walletPath)) {
    console.log("Wallet already exists at:", walletPath);
    console.log("If you want to generate a new wallet, delete the existing one first.");
    return;
  }
  
  try {
    // Generate a new wallet key
    const key = await arweave.wallets.generate();
    
    // Save the wallet to a file
    fs.writeFileSync(walletPath, JSON.stringify(key));
    
    // Get the wallet address
    const address = await arweave.wallets.jwkToAddress(key);
    
    console.log(`✅ Wallet generated successfully!`);
    console.log(`Wallet saved to: ${walletPath}`);
    console.log(`Wallet address: ${address}`);
    console.log("");
    console.log("IMPORTANT: To use this wallet with Arweave, you need to fund it with AR tokens.");
    console.log("Visit https://www.arweave.org to get AR tokens.");
    console.log("");
    console.log("After funding, you can deploy your WeaveDB contract with:");
    console.log("  node scripts/deploy-weavedb.js");
    
  } catch (error) {
    console.error("Error generating wallet:", error);
  }
}

// Execute if run directly
if (require.main === module) {
  generateWallet();
}

module.exports = { generateWallet }; 