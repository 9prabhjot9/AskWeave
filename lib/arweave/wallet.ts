/// <reference path="./types.d.ts" />

// Define the permission types
type PermissionType = 
  | 'ACCESS_ADDRESS'
  | 'ACCESS_PUBLIC_KEY'
  | 'ACCESS_ALL_ADDRESSES'
  | 'SIGN_TRANSACTION'
  | 'ENCRYPT'
  | 'DECRYPT'
  | 'SIGNATURE'
  | 'ACCESS_ARWEAVE_CONFIG'
  | 'DISPATCH';

// Define ArConnect types
interface AppInfo {
  name?: string;
  logo?: string;
}

interface GatewayConfig {
  host: string;
  port: number;
  protocol: string;
}

interface Transaction {
  id?: string;
  owner?: string;
  tags?: { name: string; value: string }[];
  target?: string;
  quantity?: string;
  data?: string;
  reward?: string;
  signature?: string;
  data_root?: string;
  data_size?: string;
}

// Required permissions
const PERMISSIONS: PermissionType[] = [
  'ACCESS_ADDRESS',
  'ACCESS_PUBLIC_KEY',
  'SIGN_TRANSACTION',
  'SIGNATURE'
];

// Wallet info interface
export interface WalletInfo {
  address: string;
  balance: string;
}

// Check if ArConnect is available
export function isArConnectAvailable(): boolean {
  return typeof window !== 'undefined' && 'arweaveWallet' in window;
}

// Connect to ArConnect
export async function connectArConnect(): Promise<string> {
  if (!isArConnectAvailable()) {
    throw new Error('ArConnect not available');
  }

  try {
    // Request permissions
    await window.arweaveWallet.connect(PERMISSIONS);
    
    // Get the wallet address
    const address = await window.arweaveWallet.getActiveAddress();
    return address;
  } catch (error) {
    console.error('Error connecting to ArConnect:', error);
    throw error;
  }
}

// Sign message with ArConnect
export async function signMessageWithArConnect(message: string): Promise<string> {
  if (!isArConnectAvailable()) {
    throw new Error('ArConnect not available');
  }

  try {
    const messageBytes = new TextEncoder().encode(message);
    const signature = await window.arweaveWallet.signature(messageBytes, { name: 'SHA-256' });
    return Array.from(signature).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error signing message with ArConnect:', error);
    throw error;
  }
}

// Disconnect from ArConnect
export async function disconnectArConnect(): Promise<void> {
  if (!isArConnectAvailable()) {
    throw new Error('ArConnect not available');
  }

  try {
    await window.arweaveWallet.disconnect();
  } catch (error) {
    console.error('Error disconnecting from ArConnect:', error);
    throw error;
  }
}

// Get current wallet address
export async function getCurrentWalletAddress(): Promise<string | null> {
  try {
    if (isArConnectAvailable()) {
      return await window.arweaveWallet.getActiveAddress();
    }
    return null;
  } catch (error) {
    console.error('Error getting current wallet address:', error);
    return null;
  }
} 