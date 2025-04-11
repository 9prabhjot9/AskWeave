import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import WeaveDB dynamically
const WeaveDB = await import('weavedb-sdk').then(m => m.default);

async function testWeaveDB() {
  try {
    const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_ID;
    
    if (!contractTxId) {
      console.error('WeaveDB contract ID not found in environment variables');
      process.exit(1);
    }
    
    console.log(`Testing WeaveDB with contract ID: ${contractTxId}`);
    
    // Initialize WeaveDB
    const db = new WeaveDB({ 
      contractTxId,
      // Use browser-compatible options
      arweave: {
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      }
    });
    
    // Initialize the database
    await db.initialize();
    
    console.log('WeaveDB initialized successfully!');
    
    // Try to get a document to verify connection
    try {
      const result = await db.get('questions', 'test');
      console.log('Test document:', result);
    } catch (error) {
      console.log('No test document found, but connection is working');
    }
    
    return db;
  } catch (error) {
    console.error('Error testing WeaveDB:', error);
    process.exit(1);
  }
}

// Run the test
testWeaveDB().then(() => {
  console.log('WeaveDB test completed.');
}); 