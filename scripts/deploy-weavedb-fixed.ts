import fs from 'fs';
import path from 'path';

// Use CommonJS require for modules that may have TS issues
const Arweave = require('arweave');

// Starting with a simpler approach - require core SDK
const SDK = require('weavedb-sdk');

// Define collections for our Q&A app
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
    // Constants
    const WALLET_PATH = path.join(__dirname, '../wallet.json');

    // Check if wallet exists
    if (!fs.existsSync(WALLET_PATH)) {
      console.error('Wallet file not found! Please run: npm run create-wallet');
      process.exit(1);
    }

    // Load wallet
    const wallet = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8'));
    
    // Initialize Arweave
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    console.log('Starting WeaveDB deployment...');
    
    // Initialize WeaveDB SDK
    const weavedb = new SDK({
      wallet,
      name: 'askweave-db',
      version: '0.3',
      arweave
    });
    
    try {
      console.log('Initializing SDK...');
      await weavedb.initialize();
    } catch (err) {
      console.error('Failed to initialize:', err);
      throw err;
    }
    
    console.log('SDK initialized successfully!');
    
    try {
      // Deploy the actual contract
      console.log('Deploying WeaveDB contract to Arweave...');
      const contractTxId = await weavedb.deploy();
      console.log('Contract deployed successfully!');
      console.log(`Contract Transaction ID: ${contractTxId}`);
      
      // Update the environment file
      const envPath = path.join(__dirname, '../.env.local');
      const envContent = `NEXT_PUBLIC_WEAVEDB_CONTRACT_ID=${contractTxId}\n`;
      fs.writeFileSync(envPath, envContent, { flag: 'a' });
      
      console.log('Environment file updated with Contract ID');
      
      // Set the deployed contract as the default DB
      console.log('Setting up database...');
      await weavedb.setDefaultDB(contractTxId);
      
      // Create collections
      for (const collection of Object.values(Collections)) {
        console.log(`Creating collection: ${collection}`);
        await weavedb.addCollection(collection);
      }
      
      // Set up rules (simplified for all collections)
      for (const collection of Object.values(Collections)) {
        console.log(`Setting rules for collection: ${collection}`);
        await weavedb.setRules(collection, [
          { "allow": "write", "who": ["anyone"] },
          { "allow": "read", "who": ["anyone"] }
        ]);
      }
      
      // Add some indexes
      console.log('Adding indexes...');
      await weavedb.addIndex(Collections.QUESTIONS, ['createdAt', 'desc']);
      await weavedb.addIndex(Collections.ANSWERS, ['questionId', 'asc']);
      
      console.log('WeaveDB deployment completed successfully!');
      return contractTxId;
    } catch (err) {
      console.error('Deployment error:', err);
      throw err;
    }
  } catch (error) {
    console.error('ERROR in deployment process:', error);
    process.exit(1);
  }
}

// Execute the deployment
deployWeaveDB().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 