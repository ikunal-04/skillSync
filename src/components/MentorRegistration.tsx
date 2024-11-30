import { useState } from 'react'
import { ethers } from 'ethers'
import { useToast } from '@/hooks/use-toast'

export function MentorRegistration({ contract }: { contract: ethers.Contract }) {
  const [expertise, setExpertise] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const tx = await contract.registerMentor(expertise, ethers.parseEther(hourlyRate))
      await tx.wait()
      toast({
        title: 'Mentor registered successfully!',
        description: 'You have successfully registered as a mentor',
      })
    } catch (error) {
      console.error('Error registering mentor:', error)
      toast({
        title: 'Failed to register mentor',
        description: 'An error occurred while registering as a mentor',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Register as Mentor</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expertise">
            Expertise
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="expertise"
            type="text"
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hourlyRate">
            Hourly Rate (ETH)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="hourlyRate"
            type="number"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Register as Mentor'}
        </button>
      </form>
    </div>
  )
}

