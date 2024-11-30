import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getContract, getSigner } from '@/utils/contract'
import { MentorRegistration } from '@/components/MentorRegistration'
import { MentorList } from '@/components/MentorList'
import { BookSession } from '@/components/BookSession'
import { SessionManagement } from '@/components/SessionManagement'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const signer = await getSigner()
        const address = await signer.getAddress()
        setAccount(address)
        const contractInstance = await getContract(signer)
        setContract(contractInstance)
      } catch (error) {
        console.error("Failed to initialize:", error)
      }
    }
    init()
  }, [])

  if (!account || !contract) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Peer-to-Peer Mentorship Platform</h1>
      <p className="mb-4">Connected Account: {account}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MentorRegistration contract={contract} />
        <MentorList contract={contract} />
        <BookSession contract={contract} account={account} />
        <SessionManagement contract={contract} account={account} />
      </div>
      <Toaster />
    </div>
  )
}

