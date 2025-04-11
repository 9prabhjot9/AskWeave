"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "@/hooks/useWallet"
import { isArConnectAvailable } from "@/lib/arweave/wallet"
import { Copy, LogOut, CopyCheck, Wallet, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export function ConnectWalletButton() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet()
  const [copied, setCopied] = useState(false)
  const [hasArConnect, setHasArConnect] = useState(false)

  // Check if ArConnect is available
  useEffect(() => {
    setHasArConnect(isArConnectAvailable())
  }, [])

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Handle connect wallet
  const handleConnect = async () => {
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  // Handle disconnect wallet
  const handleDisconnect = () => {
    disconnectWallet()
  }

  // Open ArConnect website
  const goToArConnect = () => {
    window.open("https://www.arconnect.io", "_blank")
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 items-center">
            <Wallet className="h-4 w-4" />
            <span>{formatAddress(walletAddress)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyAddress}>
            {copied ? (
              <>
                <CopyCheck className="mr-2 h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Address</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex flex-col items-start">
      <Button onClick={handleConnect} className="flex gap-2 items-center">
        <Wallet className="mr-1 h-4 w-4" />
        Connect Wallet
      </Button>
      
      {!hasArConnect && (
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <span className="mr-1">ArConnect not detected.</span>
          <Button 
            variant="link" 
            className="h-auto p-0 text-xs flex items-center" 
            onClick={goToArConnect}
          >
            <span className="mr-1">Install ArConnect</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
