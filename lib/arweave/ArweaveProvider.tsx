"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import StorageService from '@/lib/storage';
import { isArConnectAvailable } from './wallet';

// Interface for ArweaveContext
interface ArweaveContextType {
  isInitialized: boolean;
  isArConnectAvailable: boolean;
  initialize: () => Promise<void>;
}

// Create context
const ArweaveContext = createContext<ArweaveContextType>({
  isInitialized: false,
  isArConnectAvailable: false,
  initialize: async () => {},
});

// Provider component
export function ArweaveProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasArConnect, setHasArConnect] = useState(false);

  // Initialize function
  const initialize = async () => {
    if (isInitialized) return;
    
    try {
      // Check for ArConnect
      const arConnectAvailable = isArConnectAvailable();
      setHasArConnect(arConnectAvailable);
      
      // Initialize the storage service
      await StorageService.initStorage();
      
      setIsInitialized(true);
      console.log(`ArweaveProvider initialized. ArConnect available: ${arConnectAvailable}`);
    } catch (error) {
      console.error('Failed to initialize ArweaveProvider:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initialize();
    
    // Check for ArConnect changes
    const handleArConnectChange = () => {
      setHasArConnect(isArConnectAvailable());
    };
    
    window.addEventListener('arweaveWalletLoaded', handleArConnectChange);
    
    return () => {
      window.removeEventListener('arweaveWalletLoaded', handleArConnectChange);
    };
  }, []);

  return (
    <ArweaveContext.Provider value={{ 
      isInitialized, 
      isArConnectAvailable: hasArConnect,
      initialize 
    }}>
      {children}
    </ArweaveContext.Provider>
  );
}

// Hook for consuming the context
export function useArweave() {
  return useContext(ArweaveContext);
}

export default ArweaveProvider; 