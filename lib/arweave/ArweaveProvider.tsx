"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import StorageService from '@/lib/storage';

// Interface for ArweaveContext
interface ArweaveContextType {
  isInitialized: boolean;
  initialize: () => Promise<void>;
}

// Create context
const ArweaveContext = createContext<ArweaveContextType>({
  isInitialized: false,
  initialize: async () => {},
});

// Provider component
export function ArweaveProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize function
  const initialize = async () => {
    if (isInitialized) return;
    
    try {
      // Initialize the storage service
      await StorageService.initStorage();
      setIsInitialized(true);
      console.log('ArweaveProvider initialized with localStorage');
    } catch (error) {
      console.error('Failed to initialize ArweaveProvider:', error);
    }
  };

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []);

  return (
    <ArweaveContext.Provider value={{ isInitialized, initialize }}>
      {children}
    </ArweaveContext.Provider>
  );
}

// Hook for consuming the context
export function useArweave() {
  return useContext(ArweaveContext);
}

export default ArweaveProvider; 