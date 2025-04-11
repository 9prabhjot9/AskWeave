#!/usr/bin/env node

const { WeaveDB } = require("weavedb-sdk");
const fs = require("fs");
const path = require("path");

// Configuration
const ENV_FILE_PATH = path.resolve(__dirname, "../.env.local");
const WALLET_PATH = path.resolve(__dirname, "../.arweave/wallet.json");

async function deployWeaveDBContract() {
  console.log("Starting WeaveDB contract deployment...");
  
  // Check if wallet exists
  if (!fs.existsSync(WALLET_PATH)) {
    console.error("Arweave wallet not found at:", WALLET_PATH);
    console.log("Please create a wallet first with 'node scripts/generate-wallet.js'");
    process.exit(1);
  }

  // Load wallet
  const wallet = JSON.parse(fs.readFileSync(WALLET_PATH, "utf8"));
  console.log(`Using wallet with address: ${wallet.address || "unknown"}`);

  try {
    // Initialize WeaveDB with the wallet
    console.log("Initializing WeaveDB...");
    const db = new WeaveDB({
      wallet,
      name: "AskWeave Database",
    });

    // Deploy the contract to Arweave
    console.log("Deploying contract to Arweave... (this may take a few minutes)");
    await db.init();
    
    // Get the contract ID
    const contractTxId = db.contractTxId;
    console.log(`✅ WeaveDB contract deployed successfully!`);
    console.log(`Contract ID: ${contractTxId}`);

    // Save the contract ID to .env.local file
    let envContent = "";
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
    }

    // Check if NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID already exists in the file
    if (envContent.includes("NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=")) {
      // Replace the existing value
      envContent = envContent.replace(
        /NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=.*/,
        `NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=${contractTxId}`
      );
    } else {
      // Add a new line
      envContent += `\nNEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=${contractTxId}\n`;
    }

    fs.writeFileSync(ENV_FILE_PATH, envContent);
    console.log(`Contract ID saved to .env.local file`);

    return contractTxId;
  } catch (error) {
    console.error("Error deploying WeaveDB contract:", error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  deployWeaveDBContract()
    .then((contractTxId) => {
      console.log("Deployment completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = { deployWeaveDBContract }; 