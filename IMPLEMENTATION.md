# AskWeave Implementation Details

This document provides technical details about the implementation of the AskWeave decentralized Q&A platform backend.

## Backend Architecture

The backend for AskWeave is fully decentralized, relying entirely on the Arweave blockchain and related technologies. The key components are:

### 1. Arweave Client (`lib/arweave/client.ts`)
- Core Arweave client for direct blockchain interactions
- Handles wallet address and balance operations

### 2. Bundlr Integration (`lib/arweave/bundlr.ts`)
- Efficient data uploads to Arweave using Bundlr
- Handles funding, balance checking, and data uploads

### 3. SmartWeave Contract (`lib/arweave/contracts/qa-contract.ts`)
- Implements the core business logic for the Q&A platform
- Handles questions, answers, voting, bounties, and DAO governance
- State management for all platform data

### 4. Warp Integration (`lib/arweave/warp.ts`)
- Interfaces with SmartWeave contracts via Warp
- Handles contract deployment, interaction, and state reading

### 5. WeaveDB Database (`lib/arweave/weavedb.ts`)
- Decentralized NoSQL database for efficient data querying
- Manages collections for questions, answers, votes, etc.
- Handles database operations like add, query, update, delete

### 6. Wallet Authentication (`lib/arweave/wallet.ts`)
- Supports ArConnect and Wanders wallet connections
- Handles wallet-based authentication and signatures

### 7. Main Service (`lib/arweave/index.ts`)
- Exports all Arweave services in a unified interface
- Central point for accessing backend functionality

## React Hooks

### 1. Wallet Hook (`hooks/useWallet.ts`)
- Manages wallet connections
- Tracks wallet state (address, balance, connection status)
- Handles connecting/disconnecting wallets

### 2. Contract Hook (`hooks/useQAContract.ts`)
- Interacts with the Q&A SmartWeave contract
- Provides functions for all contract operations
- Manages loading and error states

### 3. Database Hook (`hooks/useWeaveDB.ts`)
- Manages WeaveDB interactions
- Handles database operations with proper authentication
- Tracks initialization status and errors

## Context Providers

### ArweaveProvider (`lib/arweave/ArweaveProvider.tsx`)
- Provides Arweave services throughout the application
- Manages initialization of Arweave services
- Stores contract IDs and database references

## Deployment Scripts

### 1. Contract Deployment (`scripts/deploy-contract.ts`)
- Deploys the Q&A SmartWeave contract to Arweave
- Sets initial state with owner address
- Saves contract ID to environment variables

### 2. WeaveDB Deployment (`scripts/deploy-weavedb.ts`)
- Deploys a WeaveDB instance to Arweave
- Creates collections and indexes
- Sets access control rules for each collection
- Saves database contract ID to environment variables

## Data Flow

1. **User Authentication**:
   - User connects wallet through ArConnect or Wanders
   - Wallet address is used for identity and permissions

2. **Content Creation**:
   - Content (questions, answers) is stored on Arweave via Bundlr
   - Transaction IDs are recorded in the SmartWeave contract
   - Data is indexed in WeaveDB for efficient retrieval

3. **Content Retrieval**:
   - Fast queries via WeaveDB for UI data
   - Contract state for authoritative data

4. **Voting and Rewards**:
   - Votes are recorded in the contract
   - Reputation and bounties are managed by the contract

5. **Governance**:
   - DAO proposals are submitted and voted on in the contract
   - Implementation is managed by contract owner

## Security Considerations

1. **Authentication**: All actions require wallet signatures, ensuring only authenticated users can perform actions

2. **Authorization**: Contract logic enforces permissions (e.g., only question author can accept answers)

3. **Data Integrity**: All data is stored immutably on Arweave, preventing tampering

4. **Decentralization**: No central server or database, eliminating single points of failure 