import { WarpFactory, defaultCacheOptions } from 'warp-contracts';

// Initialize Warp with in-memory cache
const warp = WarpFactory.forMainnet({
  ...defaultCacheOptions,
  inMemory: true,
  dbLocation: './cache/warp',
});

// Initialize Warp for testnet if needed
const testnetWarp = process.env.NEXT_PUBLIC_USE_TESTNET === 'true'
  ? WarpFactory.forTestnet({
      ...defaultCacheOptions,
      inMemory: true,
      dbLocation: './cache/warp-testnet',
    })
  : null;

// Get the appropriate Warp instance
export const getWarp = () => {
  return process.env.NEXT_PUBLIC_USE_TESTNET === 'true' ? testnetWarp! : warp;
};

// Read contract state
export const readContractState = async (contractId: string) => {
  const warp = getWarp();
  return await warp.contract(contractId).readState();
};


export const interactWithContract = async (
  contractId: string,
  input: any,
  wallet?: any
) => {
  const warp = getWarp();
  const contract = warp.contract(contractId);
  
  if (wallet) {
    contract.connect(wallet);
  }
  
  return await contract.viewState(input);
};


export const deployContract = async (
  source: string,
  initState: any,
  wallet?: any
) => {
  const warp = getWarp();
  const contract = warp.contract(source);
  
  if (wallet) {
    contract.connect(wallet);
  }
  
  return await contract.viewState(initState);
};

// Export types
export type ContractState = any;

export default warp; 