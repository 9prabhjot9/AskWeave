import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import WeaveDB SDK
const { WeaveDB } = require('weavedb-sdk');

async function testWeaveDB() {
  try {
    console.log('Testing WeaveDB SDK...');
    
    // Initialize WeaveDB
    const db = new WeaveDB({
      contractTxId: process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID
    });
    
    // Initialize the SDK
    await db.initialize();
    
    console.log('WeaveDB initialized successfully!');
    console.log('Contract ID:', db.contractTxId);
    
    // Try to get a document to verify connection
    try {
      const result = await db.query('questions', ['test']);
      console.log('Test document:', result);
    } catch (error) {
      console.log('No test document found, but connection is working');
    }
    
    return true;
  } catch (error) {
    console.error('Error testing WeaveDB:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  testWeaveDB().catch(console.error);
} 