/**
 * Arweave Compatibility Layer
 * 
 * This module provides mock implementations of Arweave services
 * that can run in the browser without native dependencies.
 */

// Mock Arweave
export const mockArweave = {
  wallets: {
    generate: async () => {
      return { address: 'mock-wallet-address' };
    },
    jwkToAddress: async () => 'mock-wallet-address',
  },
  createTransaction: async () => ({
    id: 'mock-transaction-id',
    addTag: () => {},
  }),
};

// Mock wallet
export function getMockWalletAddress(): string {
  return 'mock-wallet-address';
}

export function getMockWalletBalance(): string {
  return '0';
}

// Mock Bundlr
export async function mockInitBundlr() {
  console.log('Mock Bundlr initialized');
  return {
    uploadData: async () => ({ id: 'mock-bundlr-id' }),
    getLoadedBalance: async () => '0',
    fund: async () => ({ id: 'mock-funding-tx' }),
  };
}

export async function mockUploadData(data: any) {
  console.log('Mock data upload:', data);
  return { id: 'mock-data-id' };
}

export async function mockGetBundlrBalance() {
  return '0';
}

export async function mockFundBundlr() {
  return { id: 'mock-funding-tx' };
}

// Mock Warp
export function getMockWarp() {
  return {
    contract: () => ({
      connect: () => ({
        writeInteraction: async () => ({ originalTxId: 'mock-tx-id' }),
        readState: async () => ({ cachedValue: { state: {} } }),
      }),
    }),
    createContract: async () => ({ contractTxId: 'mock-contract-id' }),
  };
}

export async function mockReadContractState() {
  return { state: {} };
}

export async function mockInteractWithContract() {
  return { originalTxId: 'mock-tx-id' };
}

export async function mockDeployContract() {
  return { contractTxId: 'mock-contract-id' };
}

// Mock wallet connection
export function isMockArConnectAvailable() {
  return false;
}

export async function mockConnectArConnect() {
  return { address: 'mock-wallet-address' };
}

export async function mockSignMessageWithArConnect() {
  return 'mock-signature';
}

export function mockDisconnectArConnect() {
  console.log('Mock wallet disconnected');
}

export function getMockWalletInfo() {
  return {
    address: 'mock-wallet-address',
    balance: '0',
    isConnected: false,
  };
} 