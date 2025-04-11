import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { WarpFactory } from 'warp-contracts';
import { initialState } from '../lib/arweave/contracts/qa-contract';

// Path to your wallet file
const WALLET_PATH = path.join(__dirname, '../wallet.json');

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

// Initialize Warp
const warp = WarpFactory.forMainnet();

async function deployQAContract() {
  try {
    // Check if wallet file exists
    if (!fs.existsSync(WALLET_PATH)) {
      console.error('Wallet file not found. Please create a wallet.json file in the root directory.');
      process.exit(1);
    }
    
    // Load wallet
    const wallet: JWKInterface = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8'));
    
    // Get wallet address
    const walletAddress = await arweave.wallets.jwkToAddress(wallet);
    console.log(`Deploying contract from wallet: ${walletAddress}`);
    
    // Get wallet balance
    const balance = await arweave.wallets.getBalance(walletAddress);
    const arBalance = arweave.ar.winstonToAr(balance);
    console.log(`Wallet balance: ${arBalance} AR`);
    
    // Make sure there's enough balance
    if (Number(arBalance) < 0.1) {
      console.error('Wallet balance is too low. Please fund your wallet with at least 0.1 AR.');
      process.exit(1);
    }
    
    // Prepare the initial state
    const contractInitialState = {
      ...initialState,
      owner: walletAddress,
    };
    
    // Read the contract source code
    const contractSrcPath = path.join(__dirname, '../lib/arweave/contracts/qa-contract.js');
    
    // Create a temporary JavaScript file from TypeScript since we need to deploy JS
    // This is a simple approach - in production, you'd use a proper build process
    const contractSrc = `
      // QA Contract
      ${fs.readFileSync(contractSrcPath, 'utf-8')}
    `;
    
    console.log('Deploying contract...');
    
    // Deploy the contract
    const { contractTxId } = await warp.deploy({
      wallet,
      initState: JSON.stringify(contractInitialState),
      src: contractSrc,
    });
    
    console.log(`Contract deployed successfully!`);
    console.log(`Contract Transaction ID: ${contractTxId}`);
    console.log(`You can view the contract at: https://sonar.warp.cc/#/app/contract/${contractTxId}`);
    
    // Save the contract ID to a file
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = `NEXT_PUBLIC_QA_CONTRACT_ID=${contractTxId}\n`;
    fs.writeFileSync(envPath, envContent, { flag: 'a' });
    
    console.log(`Contract ID saved to .env.local file.`);
    
    return contractTxId;
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

// Run the deployment function
deployQAContract().then(() => {
  console.log('Deployment script completed.');
}); 