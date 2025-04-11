import fs from 'fs';
import path from 'path';
// @ts-ignore
const Arweave = require('arweave');

async function createWallet() {
  try {
    // Initialize Arweave
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    console.log('Generating a new Arweave wallet...');
    
    // Generate a new wallet key
    const jwk = await arweave.wallets.generate();
    
    // Get the wallet address
    const address = await arweave.wallets.jwkToAddress(jwk);
    
    // Save the wallet to a file
    const walletPath = path.join(__dirname, '../wallet.json');
    fs.writeFileSync(walletPath, JSON.stringify(jwk));
    
    console.log('✅ New wallet generated successfully!');
    console.log(`Wallet address: ${address}`);
    console.log(`Wallet saved to: ${walletPath}`);
    console.log('\n⚠️ IMPORTANT: Your wallet has 0 AR tokens. Before deploying:');
    console.log('1. Back up your wallet.json file securely.');
    console.log(`2. Fund your wallet address (${address}) with AR tokens.`);
    console.log('3. You can get free test tokens from the Arweave faucet for testing.');
    console.log('4. Visit https://faucet.arweave.net/ for test tokens.\n');
    console.log('Once funded, run `npm run deploy-weavedb` to deploy your database.');
    
    return { jwk, address };
  } catch (error) {
    console.error('Error creating wallet:', error);
    process.exit(1);
  }
}

// Execute the wallet creation
createWallet().catch(console.error); 