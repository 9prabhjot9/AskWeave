// Re-export mock implementations for browser compatibility
import {
  mockArweave as arweave,
  getMockWalletAddress as getWalletAddress,
  getMockWalletBalance as getWalletBalance,
  mockInitBundlr as initBundlr,
  mockUploadData as uploadData,
  mockGetBundlrBalance as getBundlrBalance,
  mockFundBundlr as fundBundlr,
  getMockWarp as getWarp,
  mockReadContractState as readContractState,
  mockInteractWithContract as interactWithContract,
  mockDeployContract as deployContract,
} from './compatibility';

// Import real wallet functions
import {
  isArConnectAvailable,
  connectArConnect,
  signMessageWithArConnect,
  disconnectArConnect,
  getCurrentWalletAddress,
} from './wallet';

// Import from WeaveDB module
import {
  initWeaveDB,
  getDB,
  addDocument,
  getDocument,
  queryDocuments,
  updateDocument,
  deleteDocument,
  Collections,
} from './weavedb';

// Import types from the contract
import type { State, Question, Answer, Comment, Vote, User, Bounty, DaoProposal, DaoSettings } from './contracts/qa-contract';

// Q&A contracts
export const QA_CONTRACT_ID = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID || '';
export const WEAVEDB_CONTRACT_ID = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID || '';

// Define a mock contract state type
export type ContractState = any;

// Create an ArweaveService singleton
const ArweaveService = {
  // Core Arweave
  arweave,
  getWalletAddress,
  getWalletBalance,
  
  // Bundlr
  initBundlr,
  uploadData,
  getBundlrBalance,
  fundBundlr,
  
  // SmartWeave/Warp
  warp: getWarp(),
  readContractState,
  interactWithContract,
  deployContract,
  getWarp,
  
  // WeaveDB
  initWeaveDB,
  getDB,
  addDocument,
  getDocument,
  queryDocuments,
  updateDocument,
  deleteDocument,
  Collections,
  
  // Wallet
  isArConnectAvailable,
  connectArConnect,
  signMessageWithArConnect,
  disconnectArConnect,
  getCurrentWalletAddress,
};

// Re-export everything
export default ArweaveService;

// Export types
export type QAContractState = State;
export type { Question, Answer, Comment, Vote, User, Bounty, DaoProposal, DaoSettings, ContractState };
export type WalletInfo = { address: string; balance: string; isConnected: boolean };

// Export Collections enum
export { Collections }; 