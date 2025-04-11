#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Configuration
const ENV_FILE_PATH = path.resolve(__dirname, "../.env.local");

// Generate a random 43-character base64url string similar to an Arweave transaction ID
function generateMockContractId() {
  const bytes = crypto.randomBytes(32);
  return bytes.toString("base64url");
}

function mockDeployWeaveDB() {
  console.log("Running mock WeaveDB deployment for development...");
  
  // Generate a fake contract ID
  const mockContractId = generateMockContractId();
  console.log(`Generated mock contract ID: ${mockContractId}`);
  
  // Save to .env.local file
  let envContent = "";
  if (fs.existsSync(ENV_FILE_PATH)) {
    envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
  }
  
  // Check if NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID already exists in the file
  if (envContent.includes("NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=")) {
    // Replace the existing value
    envContent = envContent.replace(
      /NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=.*/,
      `NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=${mockContractId}`
    );
  } else {
    // Add a new line
    envContent += `\nNEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=${mockContractId}\n`;
  }
  
  fs.writeFileSync(ENV_FILE_PATH, envContent);
  console.log(`Mock contract ID saved to .env.local file`);
  console.log("");
  console.log("⚠️ NOTE: This is a mock deployment for development only.");
  console.log("Your data will be stored in localStorage, not on the Arweave blockchain.");
  console.log("");
  console.log("For actual deployment to Arweave:");
  console.log("1. Generate a wallet: node scripts/generate-wallet.js");
  console.log("2. Fund your wallet with AR tokens");
  console.log("3. Deploy to Arweave: node scripts/deploy-weavedb.js");
  
  return mockContractId;
}

// Execute if run directly
if (require.main === module) {
  mockDeployWeaveDB();
}

module.exports = { mockDeployWeaveDB }; 