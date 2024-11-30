import { useState } from 'react'
import { ethers } from 'ethers'
import { useToast } from '@/hooks/use-toast';

export function BookSession({ contract }: { contract: ethers.Contract; account: string }) {
    const [mentorAddress, setMentorAddress] = useState('')
    const [duration, setDuration] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const mentorDetails = await contract.getMentorDetails(mentorAddress)
            const totalCost = ethers.getBigInt(mentorDetails.hourlyRate) * BigInt(duration)
            const tx = await contract.bookSession(mentorAddress, duration, { value: totalCost })
            await tx.wait()
            toast({
                title: 'Session booked successfully!',
                description: 'You have successfully booked a session with the mentor'
            })
        } catch (error) {
            console.error('Error booking session:', error)
            toast({
                title: 'Failed to book session',
                description: 'An error occurred while booking the session',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-bold mb-4">Book a Session</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mentorAddress">
                        Mentor Address
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="mentorAddress"
                        type="text"
                        value={mentorAddress}
                        onChange={(e) => setMentorAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                        Duration (hours)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </div>
                <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Booking...' : 'Book Session'}
                </button>
            </form>
        </div>
    )
}

