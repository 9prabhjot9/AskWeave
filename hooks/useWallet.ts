"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  isArConnectAvailable, 
  connectArConnect, 
  disconnectArConnect, 
  getCurrentWalletAddress 
} from '@/lib/arweave/wallet';

// Return type for the hook
interface UseWalletReturn {
  walletAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export function useWallet(): UseWalletReturn {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // First try to get wallet address from ArConnect
        const address = await getCurrentWalletAddress();
        
        if (address) {
          setWalletAddress(address);
          setIsConnected(true);
          return;
        }
        
        // Fall back to localStorage for mock implementation
        if (typeof window !== 'undefined') {
          const savedAddress = localStorage.getItem('mockWalletAddress');
          if (savedAddress) {
            setWalletAddress(savedAddress);
            setIsConnected(true);
          }
        }
      } catch (err: any) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Try to use ArConnect if available
      if (isArConnectAvailable()) {
        const address = await connectArConnect();
        setWalletAddress(address);
        setIsConnected(true);
        
        toast({
          title: 'Wallet Connected',
          description: `Connected with ArConnect: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      } else {
        // Use mock implementation in development or when ArConnect is not available
        const mockAddress = 'Ar' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setWalletAddress(mockAddress);
        setIsConnected(true);
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockWalletAddress', mockAddress);
        }

        toast({
          title: 'Mock Wallet Connected',
          description: `ArConnect not available. Connected with mock address: ${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`,
        });
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      
      toast({
        title: 'Connection Error',
        description: err.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    try {
      // Try to disconnect from ArConnect if available
      if (isArConnectAvailable()) {
        disconnectArConnect();
      }
      
      // Clear wallet address from state
      setWalletAddress('');
      setIsConnected(false);
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('mockWalletAddress');
      }

      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected',
      });
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err);
      
      toast({
        title: 'Disconnection Error',
        description: err.message || 'Failed to disconnect wallet',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return {
    // Always return a string for walletAddress, never undefined
    walletAddress: walletAddress || '',
    isConnected,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
  };
} 