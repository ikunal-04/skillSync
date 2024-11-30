import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface Session {
  id: number
  mentor: string
  mentee: string
  startTime: number
  duration: number
  payment: string
  isCompleted: boolean
}

export function SessionManagement({ contract, account }: { contract: ethers.Contract; account: string }) {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionCount = await contract.sessionCounter()
        const sessionDetails = await Promise.all(
          Array.from({ length: sessionCount.toNumber() }, async (_, i) => {
            const details = await contract.getSessionDetails(i + 1)
            return {
              id: i + 1,
              mentor: details.mentor,
              mentee: details.mentee,
              startTime: details.startTime.toNumber(),
              duration: details.duration.toNumber(),
              payment: ethers.formatEther(details.payment),
              isCompleted: details.isCompleted,
            }
          })
        )
        setSessions(sessionDetails.filter(s => s.mentor === account || s.mentee === account))
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }
    fetchSessions()
  }, [contract, account])

  const completeSession = async (sessionId: number) => {
    try {
      const tx = await contract.completeSession(sessionId)
      await tx.wait()
      alert('Session completed successfully!')
    } catch (error) {
      console.error('Error completing session:', error)
      alert('Failed to complete session')
    }
  }

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">Your Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} className="mb-4 p-4 border rounded">
            <p>Session ID: {session.id}</p>
            <p>Mentor: {session.mentor}</p>
            <p>Mentee: {session.mentee}</p>
            <p>Start Time: {new Date(session.startTime * 1000).toLocaleString()}</p>
            <p>Duration: {session.duration} hours</p>
            <p>Payment: {session.payment} ETH</p>
            <p>Status: {session.isCompleted ? 'Completed' : 'In Progress'}</p>
            {!session.isCompleted && session.mentor === account && (
              <button
                onClick={() => completeSession(session.id)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Complete Session
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

