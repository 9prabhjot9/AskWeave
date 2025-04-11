import { WebBundlr } from "@bundlr-network/client";
import { Collections } from '../storage';
import arweave from "./client";

// Use the provided wallet address
const WALLET_ADDRESS = "0fC-uw2gmuucfowm2GGM8NFYjiBIcwFXG-QHsCRvS28";

// Bundlr node URL
const BUNDLR_NODE_URL = "https://node1.bundlr.network";

// Initialize bundlr instance
let bundlrInstance: WebBundlr | null = null;

/**
 * Initialize Bundlr for Arweave uploads
 */
async function initBundlr(): Promise<WebBundlr> {
  if (bundlrInstance) return bundlrInstance;
  
  // Using wallet as JWK
  try {
    const bundlr = new WebBundlr(BUNDLR_NODE_URL, "arweave", window.arweaveWallet);
    await bundlr.ready();
    bundlrInstance = bundlr;
    return bundlr;
  } catch (error) {
    console.error("Error initializing Bundlr:", error);
    throw error;
  }
}

/**
 * Upload question data to Arweave
 * This function handles storing question data permanently on Arweave via Bundlr
 */
export async function storeQuestionOnArweave(questionData: any): Promise<string | null> {
  try {
    console.log('Storing question data on Arweave:', questionData);
    
    // In a browser environment, use real Arweave via Bundlr
    if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
      // Initialize bundlr
      const bundlr = await initBundlr();
      
      // Store data on Arweave
      return await uploadToArweave(questionData, bundlr, Collections.QUESTIONS);
    } else {
      // Fall back to mock implementation if needed
      console.log('Using mock implementation for Arweave storage');
      return await mockArweaveUpload(Collections.QUESTIONS, questionData);
    }
  } catch (error) {
    console.error('Error storing question on Arweave:', error);
    return null;
  }
}

/**
 * Upload answer data to Arweave
 * This function handles storing answer data permanently on Arweave via Bundlr
 */
export async function storeAnswerOnArweave(answerData: any): Promise<string | null> {
  try {
    console.log('Storing answer data on Arweave:', answerData);
    
    // In a browser environment, use real Arweave via Bundlr
    if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
      // Initialize bundlr
      const bundlr = await initBundlr();
      
      // Store data on Arweave
      return await uploadToArweave(answerData, bundlr, Collections.ANSWERS);
    } else {
      // Fall back to mock implementation if needed
      console.log('Using mock implementation for Arweave storage');
      return await mockArweaveUpload(Collections.ANSWERS, answerData);
    }
  } catch (error) {
    console.error('Error storing answer on Arweave:', error);
    return null;
  }
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
 * Upload data to Arweave via Bundlr
 */
async function uploadToArweave(data: any, bundlr: WebBundlr, collection: string): Promise<string> {
  try {
    // Add metadata
    const dataWithMetadata = {
      ...data,
      _arweaveWallet: WALLET_ADDRESS,
      _arweaveTimestamp: Date.now(),
      _collection: collection
    };
    
    // Convert data to JSON string
    const jsonData = JSON.stringify(dataWithMetadata);
    
    // Check if user has enough funds
    const price = await bundlr.getPrice(Buffer.byteLength(jsonData));
    const balance = await bundlr.getLoadedBalance();
    
    console.log(`Upload price: ${bundlr.utils.unitConverter(price)} AR`);
    console.log(`Your balance: ${bundlr.utils.unitConverter(balance)} AR`);
    
    if (balance.isLessThan(price)) {
      throw new Error(`Not enough funds to upload. Need ${bundlr.utils.unitConverter(price)} AR but have ${bundlr.utils.unitConverter(balance)} AR`);
    }
    
    // Create the transaction
    const tx = bundlr.createTransaction(jsonData, {
      tags: [
        { name: 'Content-Type', value: 'application/json' },
        { name: 'App-Name', value: 'Decentralized-QA' },
        { name: 'App-Version', value: '1.0.0' },
        { name: 'Collection', value: collection },
        { name: 'Wallet-Address', value: WALLET_ADDRESS }
      ]
    });
    
    // Sign the transaction
    await tx.sign();
    
    // Upload the transaction
    const response = await tx.upload();
    
    console.log(`Data uploaded to Arweave with ID: ${response.id}`);
    
    return response.id;
  } catch (error) {
    console.error('Error uploading to Arweave:', error);
    throw error;
  }
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