import { Collections } from '../storage';
import arweave from "./client";

// Use the provided wallet address
const WALLET_ADDRESS = "0fC-uw2gmuucfowm2GGM8NFYjiBIcwFXG-QHsCRvS28";

/**
 * Upload question data to Arweave
 * This function handles storing question data permanently on Arweave
 */
export async function storeQuestionOnArweave(questionData: any): Promise<string | null> {
  try {
    console.log('Storing question data on Arweave:', questionData);
    
    // Check if ArConnect is available
    if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
      try {
        // Create transaction with ArConnect
        return await uploadWithArConnect(questionData, Collections.QUESTIONS);
      } catch (error) {
        console.error('Error with ArConnect upload, falling back to mock:', error);
      }
    }
    
    // Fallback to mock implementation
    console.log('Using mock implementation for Arweave storage');
    return await mockArweaveUpload(Collections.QUESTIONS, questionData);
  } catch (error) {
    console.error('Error storing question on Arweave:', error);
    return null;
  }
}

/**
 * Upload answer data to Arweave
 * This function handles storing answer data permanently on Arweave
 */
export async function storeAnswerOnArweave(answerData: any): Promise<string | null> {
  try {
    console.log('Storing answer data on Arweave:', answerData);
    
    // Check if ArConnect is available
    if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
      try {
        // Create transaction with ArConnect
        return await uploadWithArConnect(answerData, Collections.ANSWERS);
      } catch (error) {
        console.error('Error with ArConnect upload, falling back to mock:', error);
      }
    }
    
    // Fallback to mock implementation
    console.log('Using mock implementation for Arweave storage');
    return await mockArweaveUpload(Collections.ANSWERS, answerData);
  } catch (error) {
    console.error('Error storing answer on Arweave:', error);
    return null;
  }
}

/**
 * Upload data with ArConnect directly
 */
async function uploadWithArConnect(data: any, collection: string): Promise<string> {
  // Add metadata
  const dataWithMetadata = {
    ...data,
    _arweaveWallet: WALLET_ADDRESS,
    _arweaveTimestamp: Date.now(),
    _collection: collection
  };
  
  // Convert data to JSON string
  const jsonData = JSON.stringify(dataWithMetadata);
  
  // Create transaction
  const tx = await arweave.createTransaction({ data: jsonData });
  
  // Add tags
  tx.addTag('Content-Type', 'application/json');
  tx.addTag('App-Name', 'Decentralized-QA');
  tx.addTag('App-Version', '1.0.0');
  tx.addTag('Collection', collection);
  tx.addTag('Wallet-Address', WALLET_ADDRESS);
  
  // Sign the transaction with ArConnect
  await window.arweaveWallet.sign(tx);
  
  // Submit the transaction
  const uploader = await arweave.transactions.getUploader(tx);
  
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`Uploading... ${uploader.pctComplete}% complete`);
  }
  
  console.log(`Data uploaded to Arweave with ID: ${tx.id}`);
  return tx.id;
}

/**
 * Mock implementation for Arweave upload
 * Used as fallback when real Arweave integration is not available
 */
async function mockArweaveUpload(collection: string, data: any): Promise<string> {
  // Add wallet address and timestamp to data
  const arweaveData = {
    ...data,
    _arweaveWallet: WALLET_ADDRESS,
    _arweaveTimestamp: Date.now(),
    _collection: collection
  };
  
  // Create a mock transaction ID that includes the collection
  const mockTxId = `ar-${collection}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // In production, the data would be uploaded to Arweave via Bundlr
  // For testing, we'll store it in localStorage
  if (typeof window !== 'undefined') {
    const arweaveStorage = localStorage.getItem('arweaveStorage') || '{}';
    const storage = JSON.parse(arweaveStorage);
    
    storage[mockTxId] = arweaveData;
    localStorage.setItem('arweaveStorage', JSON.stringify(storage));
  }
  
  return mockTxId;
}

/**
 * Get data from Arweave using transaction ID
 */
export async function getDataFromArweave(transactionId: string): Promise<any | null> {
  try {
    console.log('Getting data from Arweave with transaction ID:', transactionId);
    
    // Try to fetch from real Arweave
    if (typeof window !== 'undefined') {
      try {
        // Fetch from Arweave gateway
        const response = await fetch(`https://arweave.net/${transactionId}`);
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (arweaveError) {
        console.error('Error fetching from Arweave, falling back to mock:', arweaveError);
      }
      
      // Fallback to mock implementation
      const arweaveStorage = localStorage.getItem('arweaveStorage') || '{}';
      const storage = JSON.parse(arweaveStorage);
      
      if (storage[transactionId]) {
        return storage[transactionId];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting data from Arweave:', error);
    return null;
  }
}

/**
 * Generate Arweave view URL for a transaction
 */
export function generateArweaveViewUrl(transactionId: string | null): string {
  if (!transactionId) return '';
  return `https://viewblock.io/arweave/tx/${transactionId}`;
} 