import { WebBundlr } from '@bundlr-network/client';
import arweave from './client';

// Interface for the Bundlr service configuration
interface BundlrConfig {
  currency?: string;
  providerUrl?: string;
  nodeUrl?: string;
}

// Default configuration
const defaultConfig: BundlrConfig = {
  currency: 'arweave',
  nodeUrl: 'https://node1.bundlr.network',
};

/**
 * Initialize a WebBundlr instance for efficient data uploads to Arweave
 * @param provider - The wallet provider
 * @param config - Optional configuration for the bundlr instance
 * @returns A promise that resolves to a WebBundlr instance
 */
export async function initBundlr(
  provider: any,
  config: BundlrConfig = defaultConfig
): Promise<WebBundlr> {
  try {
    // Create and initialize the bundlr client
    const bundlr = new WebBundlr(
      config.nodeUrl || defaultConfig.nodeUrl!,
      config.currency || defaultConfig.currency!,
      provider
    );

    // Initialize the bundlr client
    await bundlr.ready();
    
    return bundlr;
  } catch (error) {
    console.error('Error initializing Bundlr:', error);
    throw error;
  }
}

/**
 * Upload data to Arweave using Bundlr
 * @param bundlr - The bundlr instance
 * @param data - Data to upload (string, buffer, or readable stream)
 * @param tags - Optional metadata tags for the transaction
 * @returns The transaction ID
 */
export async function uploadData(
  bundlr: WebBundlr,
  data: string | Buffer,
  tags: { name: string; value: string }[] = []
): Promise<string> {
  try {
    // Create the transaction
    const tx = bundlr.createTransaction(data, { tags });
    
    // Sign the transaction
    await tx.sign();
    
    // Upload the transaction
    const response = await tx.upload();
    
    return response.id;
  } catch (error) {
    console.error('Error uploading data to Bundlr:', error);
    throw error;
  }
}

/**
 * Get the balance of the connected wallet in Bundlr
 * @param bundlr - The bundlr instance
 * @returns The balance in the native currency
 */
export async function getBundlrBalance(bundlr: WebBundlr): Promise<string> {
  try {
    const balance = await bundlr.getLoadedBalance();
    return bundlr.utils.unitConverter(balance).toString();
  } catch (error) {
    console.error('Error getting Bundlr balance:', error);
    throw error;
  }
}

/**
 * Fund the Bundlr node with the specified amount
 * @param bundlr - The bundlr instance
 * @param amount - Amount to fund in the native currency
 * @returns The funding transaction result
 */
export async function fundBundlr(bundlr: WebBundlr, amount: string): Promise<any> {
  try {
    const response = await bundlr.fund(amount);
    return response;
  } catch (error) {
    console.error('Error funding Bundlr:', error);
    throw error;
  }
} 