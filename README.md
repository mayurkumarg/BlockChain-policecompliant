# Blockchain-based Police Complaint Management System

A decentralized application for submitting and managing police complaints using Ethereum blockchain and IPFS for data storage.

## Features

- Submit complaints with immutable records
- Blockchain-backed transparency and audit trail
- IPFS integration for decentralized file storage
- Real-time status tracking
- Clean, responsive UI

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Blockchain**: Ethereum, Hardhat, Solidity
- **Storage**: IPFS

## Prerequisites

- Node.js (v16+)
- MongoDB
- Hardhat
- IPFS (optional)

## Installation

1. Clone the repository
2. Install dependencies for each component:

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

### Blockchain
```bash
cd blockchain
npm install
```

## Setup

1. Start MongoDB locally
2. Start IPFS daemon (optional):
```bash
ipfs daemon
```

3. Deploy smart contract:
```bash
cd blockchain
npx hardhat node  # In one terminal
npx hardhat run scripts/deploy.js --network localhost  # In another
```

4. Update contract address in `backend/.env`

## Running the Application

1. Start backend:
```bash
cd backend
npm start
```

2. Start frontend:
```bash
cd frontend
npm run dev
```

3. Access at http://localhost:5173

## API Endpoints

- `POST /api/complaints/submit` - Submit new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id/status` - Update complaint status

## Smart Contract

The smart contract provides:
- Adding complaints with IPFS hash
- Retrieving complaint details
- Updating complaint status
- Event logging for transparency

## Testing Blockchain

Use Hardhat console to interact with the contract:
```bash
npx hardhat console --network localhost
```

## Environment Variables

Create `.env` files in backend and frontend directories with necessary configurations.

## License

MIT