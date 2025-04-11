import fs from 'fs';
import path from 'path';
import * as crypto from 'crypto';

/**
 * This script creates a mock WeaveDB contract ID and saves it to .env.local
 * This allows the app to use local storage while appearing to be connected to WeaveDB
 */
async function mockWeaveDBDeployment() {
  try {
    // Generate a random mock contract ID (43 characters like a real Arweave TX)
    const generateContractId = () => {
      const randomBytes = crypto.randomBytes(32);
      return randomBytes.toString('base64url');
    };
    
    // Create a mock contract ID
    const mockContractId = generateContractId();
    console.log('Generated mock WeaveDB Contract ID:', mockContractId);
    
    // Save to .env.local
    const envPath = path.join(__dirname, '../.env.local');
    
    // Check if file exists and create if it doesn't
    if (!fs.existsSync(envPath)) {
      fs.writeFileSync(envPath, '', 'utf8');
    }
    
    // Read existing file
    const existingContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if the variable already exists
    const regex = /^NEXT_PUBLIC_WEAVEDB_CONTRACT_ID=.*/m;
    const newContent = existingContent.match(regex)
      ? existingContent.replace(regex, `NEXT_PUBLIC_WEAVEDB_CONTRACT_ID=${mockContractId}`)
      : `${existingContent}\nNEXT_PUBLIC_WEAVEDB_CONTRACT_ID=${mockContractId}`;
    
    // Write back to file
    fs.writeFileSync(envPath, newContent, 'utf8');
    
    console.log('Mock Contract ID saved to .env.local');
    console.log('\nIMPORTANT:');
    console.log('This is a mock deployment. Data will be stored in local storage only.');
    console.log('To store data permanently on Arweave:');
    console.log('1. Create an Arweave wallet and fund it with AR tokens');
    console.log('2. Use a real WeaveDB deployment script');
    
    return mockContractId;
  } catch (error) {
    console.error('Error creating mock deployment:', error);
    process.exit(1);
  }
}

// Execute the mock deployment
mockWeaveDBDeployment().catch(console.error); 