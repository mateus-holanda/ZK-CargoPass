import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface Web3State {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

export const useWeb3 = create<Web3State>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      connect: async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
            const accounts = await window.ethereum.request({
              method: 'eth_requestAccounts',
            })
            set({ address: accounts[0], isConnected: true })
          } catch (error) {
            console.error('Error connecting wallet:', error)
          }
        } else {
          alert('Please install MetaMask or another Web3 wallet')
        }
      },
      disconnect: () => {
        set({ address: null, isConnected: false })
      },
    }),
    {
      name: 'web3-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
) 