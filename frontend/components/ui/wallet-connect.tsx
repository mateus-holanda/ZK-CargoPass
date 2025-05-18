"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/useWeb3"
import { LogOut } from "lucide-react"
import { useEffect } from "react"

export function WalletConnect() {
  const { address, isConnected, connect, disconnect } = useWeb3()

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        }
      })
    }
  }, [disconnect])

  if (isConnected && address) {
    return (
      <Button variant="outline" size="sm" onClick={disconnect} title={`Your are connected with ${address}`}>
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
        <LogOut className="mr-2 h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button onClick={connect}>
      Connect Wallet
    </Button>
  )
} 