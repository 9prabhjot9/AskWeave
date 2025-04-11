import fs from 'fs';
import path from 'path';
// Import Node-compatible SDK
// @ts-ignore
const WeaveDBSDK = require('weavedb-sdk-node');
// @ts-ignore
const Arweave = require('arweave');
import type { JWKInterface } from 'arweave/node/lib/wallet';

// Path to your wallet file
const WALLET_PATH = path.join(__dirname, '../wallet.json');

// Define collections as a regular object instead of an enum
const Collections = {
  QUESTIONS: 'questions',
  ANSWERS: 'answers',
  COMMENTS: 'comments',
  VOTES: 'votes',
  USERS: 'users',
  TAGS: 'tags',
  BOUNTIES: 'bounties',
};

async function deployWeaveDB() {
  try {
    // Check if wallet file exists
    if (!fs.existsSync(WALLET_PATH)) {
      console.error('Wallet file not found. Please create a wallet.json file in the root directory.');
      console.error('Run `npm run create-wallet` to generate a new wallet.');
      process.exit(1);
    }
    
    // Load wallet
    const wallet = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8')) as JWKInterface;
    
    console.log('Deploying WeaveDB...');
    
    // Initialize Arweave
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    // Initialize WeaveDB SDK with Node.js support
    const sdk = new WeaveDBSDK({
      wallet,
      name: 'askweave-db', // Database name
      version: '0.3',
      arweave,
    });
    
    console.log('Initializing SDK...');
    await sdk.initialize();
    
    console.log('Deploying contract...');
    // Deploy the database
    const contractTxId = await sdk.deploy();
    
    console.log(`WeaveDB deployed successfully!`);
    console.log(`WeaveDB Contract Transaction ID: ${contractTxId}`);
    
    // Setup database schema and collections
    console.log('Setting up database schema and collections...');
    
    // Connect to the deployed WeaveDB
    await sdk.setDefaultDB(contractTxId);
    
    // Create collections
    for (const collection of Object.values(Collections)) {
      await sdk.addCollection(collection);
      console.log(`Created collection: ${collection}`);
    }
    
    // Setup rules for collections
    // Questions collection
    await sdk.setRules(Collections.QUESTIONS, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Answers collection
    await sdk.setRules(Collections.ANSWERS, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Comments collection
    await sdk.setRules(Collections.COMMENTS, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Votes collection
    await sdk.setRules(Collections.VOTES, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Users collection
    await sdk.setRules(Collections.USERS, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Tags collection
    await sdk.setRules(Collections.TAGS, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Bounties collection
    await sdk.setRules(Collections.BOUNTIES, [
      { "allow": "write", "who": ["anyone"] },
      { "allow": "read", "who": ["anyone"] }
    ]);
    
    // Add indexes for collections
    // Questions indexes
    await sdk.addIndex(Collections.QUESTIONS, ['createdAt', 'desc']);
    await sdk.addIndex(Collections.QUESTIONS, ['updatedAt', 'desc']);
    await sdk.addIndex(Collections.QUESTIONS, ['voteCount', 'desc']);
    await sdk.addIndex(Collections.QUESTIONS, ['bountyAmount', 'desc']);
    await sdk.addIndex(Collections.QUESTIONS, ['viewCount', 'desc']);
    
    // Answers indexes
    await sdk.addIndex(Collections.ANSWERS, ['questionId', 'asc']);
    await sdk.addIndex(Collections.ANSWERS, ['createdAt', 'desc']);
    await sdk.addIndex(Collections.ANSWERS, ['voteCount', 'desc']);
    
    // Add indexes for the users collection
    await sdk.addIndex(Collections.USERS, ['reputation', 'desc']);
    
    console.log('Database schema and collections setup completed!');
    
    // Save the WeaveDB contract ID to a file
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = `NEXT_PUBLIC_WEAVEDB_CONTRACT_ID=${contractTxId}\n`;
    fs.writeFileSync(envPath, envContent, { flag: 'a' });
    
    console.log(`WeaveDB Contract ID saved to .env.local file.`);
    
    return contractTxId;
  } catch (error) {
    console.error('Error deploying WeaveDB:', error);
    process.exit(1);
  }
}

// Execute the deployment
deployWeaveDB().catch(console.error); 