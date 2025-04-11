"use client";

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from './useWallet';
import { 
  initWeaveDB, 
  getDocument, 
  queryDocuments, 
  addDocument, 
  updateDocument, 
  deleteDocument 
} from '@/lib/arweave/weavedb';
import { WEAVEDB_CONTRACT_ID } from '@/lib/arweave';

// Return type for the hook
interface UseWeaveDBReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  addDocument: typeof addDocument;
  getDocument: typeof getDocument;
  queryDocuments: typeof queryDocuments;
  updateDocument: typeof updateDocument;
  deleteDocument: typeof deleteDocument;
}

export function useWeaveDB(): UseWeaveDBReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress } = useWallet();
  const { toast } = useToast();

  // Initialize WeaveDB on mount
  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        
        if (!WEAVEDB_CONTRACT_ID) {
          console.warn('No WeaveDB contract ID found. Using mock contract ID.');
        }
        
        console.log(`Initializing WeaveDB with contract ID: ${WEAVEDB_CONTRACT_ID || 'mock'}`);
        await initWeaveDB(WEAVEDB_CONTRACT_ID);
        setIsInitialized(true);
        
        toast({
          title: 'Database Connected',
          description: 'Using browser storage for development',
        });
      } catch (err: any) {
        console.error('Error initializing WeaveDB:', err);
        setError(err.message || 'Failed to initialize WeaveDB');
        
        toast({
          title: 'Database Error',
          description: err.message || 'Failed to initialize database',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!isInitialized && !isLoading) {
      initDB();
    }
  }, [isInitialized, isLoading, toast]);

  return {
    isInitialized,
    isLoading,
    error,
    addDocument,
    getDocument,
    queryDocuments,
    updateDocument,
    deleteDocument,
  };
} 