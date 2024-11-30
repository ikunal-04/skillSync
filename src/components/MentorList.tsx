import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface Mentor {
  address: string
  expertise: string
  hourlyRate: string
  isAvailable: boolean
}

export function MentorList({ contract }: { contract: ethers.Contract }) {
  const [mentors, setMentors] = useState<Mentor[]>([])

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const mentorAddresses = await contract.getMentorAddresses()
        const mentorDetails = await Promise.all(
          mentorAddresses.map(async (address: string) => {
            const details = await contract.getMentorDetails(address)
            return {
              address,
              expertise: details.expertise,
              hourlyRate: ethers.formatEther(details.hourlyRate),
              isAvailable: details.isAvailable,
            }
          })
        )
        setMentors(mentorDetails)
      } catch (error) {
        console.error('Error fetching mentors:', error)
      }
    }
    fetchMentors()
  }, [contract])

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Available Mentors</h2>
      <ul>
        {mentors.map((mentor) => (
          <li key={mentor.address} className="mb-2">
            <p>Address: {mentor.address}</p>
            <p>Expertise: {mentor.expertise}</p>
            <p>Hourly Rate: {mentor.hourlyRate} ETH</p>
            <p>Available: {mentor.isAvailable ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

