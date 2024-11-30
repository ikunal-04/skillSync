import { ethers } from 'ethers'

const contractAddress = "0x73d3E57B900D7AD2525F04494bA3C77Bdf9f520f"
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_mentor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"name": "bookSession",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionId",
				"type": "uint256"
			}
		],
		"name": "completeSession",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "mentor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "expertise",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hourlyRate",
				"type": "uint256"
			}
		],
		"name": "MentorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "mentor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "MentorWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "mentor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReleased",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_expertise",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_hourlyRate",
				"type": "uint256"
			}
		],
		"name": "registerMentor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "mentee",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "mentor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			}
		],
		"name": "SessionBooked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "sessionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "SessionCompleted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_isAvailable",
				"type": "bool"
			}
		],
		"name": "updateAvailability",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawEarnings",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_mentor",
				"type": "address"
			}
		],
		"name": "getMentorDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "expertise",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "hourlyRate",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isAvailable",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					}
				],
				"internalType": "struct PeerToPeerMentorship.Mentor",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sessionId",
				"type": "uint256"
			}
		],
		"name": "getSessionDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "mentor",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "mentee",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "startTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "duration",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "payment",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isCompleted",
						"type": "bool"
					}
				],
				"internalType": "struct PeerToPeerMentorship.Session",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "mentors",
		"outputs": [
			{
				"internalType": "string",
				"name": "expertise",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "hourlyRate",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sessionCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sessions",
		"outputs": [
			{
				"internalType": "address",
				"name": "mentor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "mentee",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "duration",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "payment",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCompleted",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

export const getContract = async (signer: ethers.Signer) => {
  return new ethers.Contract(contractAddress, contractABI, signer)
}

export const getProvider = () => {
    const ethereum = window.ethereum as unknown as ethers.Eip1193Provider;
  return new ethers.BrowserProvider(ethereum)
}

export const getSigner = async () => {
  const provider = getProvider()
  await provider.send("eth_requestAccounts", [])
  return provider.getSigner()
}

