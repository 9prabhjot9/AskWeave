'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletStatus, setWalletStatus] = useState('Not connected');
  const [walletAddress, setWalletAddress] = useState('N/A');
  const [pageInfo, setPageInfo] = useState({pathname: '', url: ''});
  const pathname = usePathname();

  useEffect(() => {
    // Update page info
    if (typeof window !== 'undefined') {
      setPageInfo({
        pathname,
        url: window.location.href
      });
    }

    // Check wallet status
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
        try {
          const address = await window.arweaveWallet.getActiveAddress();
          if (address) {
            setWalletStatus('Connected');
            setWalletAddress(address);
          } else {
            setWalletStatus('Disconnected');
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
          setWalletStatus('Error checking');
        }
      } else {
        setWalletStatus('ArConnect not available');
      }
    };

    checkWallet();
  }, [pathname]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full shadow-lg z-50"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background border border-border p-4 rounded-lg shadow-lg max-w-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Panel</h3>
        <button onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-sm space-y-2">
        <div>
          <p className="font-medium">Wallet:</p>
          <p className="text-xs">{walletStatus}</p>
          <p className="text-xs truncate">Address: {walletAddress}</p>
        </div>
        
        <div>
          <p className="font-medium">Navigation:</p>
          <p className="text-xs">Path: {pageInfo.pathname}</p>
          <p className="text-xs truncate">URL: {pageInfo.url}</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                if (typeof window !== 'undefined' && 'arweaveWallet' in window) {
                  await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION']);
                  const address = await window.arweaveWallet.getActiveAddress();
                  setWalletStatus('Connected');
                  setWalletAddress(address || 'Unknown');
                }
              } catch (error) {
                console.error('Connect error:', error);
                setWalletStatus('Connection error');
              }
            }}
            className="bg-primary text-primary-foreground px-2 py-1 text-xs rounded"
          >
            Connect Wallet
          </button>
          
          <button
            onClick={() => {
              // Reload the page to avoid client-side routing issues
              if (typeof window !== 'undefined') {
                window.location.href = window.location.pathname;
              }
            }}
            className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded"
          >
            Reload Page
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                console.log('Current page state:', {
                  pathname: window.location.pathname,
                  search: window.location.search,
                  hash: window.location.hash,
                  localStorage: Object.keys(localStorage),
                  wallet: 'arweaveWallet' in window ? 'Available' : 'Not available'
                });
                alert('Debug info logged to console');
              }
            }}
            className="bg-muted text-muted-foreground border border-border px-2 py-1 text-xs rounded"
          >
            Log Debug Info
          </button>
        </div>
      </div>
    </div>
  );
} 