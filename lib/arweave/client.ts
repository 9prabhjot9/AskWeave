import Arweave from 'arweave';

// Initialize Arweave client
// Using the main Arweave gateway for browser compatibility
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

export default arweave;

// Helper function to get wallet address from a public key
export async function getWalletAddress(publicKey: string): Promise<string> {
  return await arweave.wallets.ownerToAddress(publicKey);
}

// Helper function to get wallet balance
export async function getWalletBalance(address: string): Promise<string> {
  try {
    const winstonBalance = await arweave.wallets.getBalance(address);
    // Convert from winston (smallest unit) to AR
    const arBalance = arweave.ar.winstonToAr(winstonBalance);
    return arBalance;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return '0';
  }
} 