# AskWeave - Decentralized Q&A Platform

A decentralized question and answer platform built on the Arweave blockchain. Ask questions, provide answers, and earn rewards - all stored permanently on the blockchain.

## Features

- Permanent storage of questions and answers on Arweave blockchain
- User reputation system
- Question tagging and search
- Upvoting/downvoting system
- Bounties for answers
- Mobile-friendly responsive design

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Basic understanding of blockchain concepts

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd askweave
```

2. Install dependencies
```bash
npm install
```

3. Fix dependencies (needed for WeaveDB)
```bash
node scripts/fix-weavedb-dependencies.js
```

### Development Setup (without Arweave tokens)

For development purposes, you can use a mock contract ID that will store data in localStorage:

```bash
node scripts/mock-deploy.js
```

This will:
- Generate a mock contract ID
- Save it to `.env.local`
- Enable localStorage-based storage for development

> ⚠️ **Note**: With this setup, data will NOT be permanently stored on the Arweave blockchain. It will only be saved in your browser's localStorage.

### Production Setup (with Arweave tokens)

For actual blockchain storage, you need:

1. Generate an Arweave wallet:
```bash
node scripts/generate-wallet.js
```

2. Fund your wallet with AR tokens (from an exchange or faucet)

3. Deploy a WeaveDB contract to Arweave:
```bash
node scripts/deploy-weavedb.js
```

This will:
- Use your funded wallet to deploy a WeaveDB contract to Arweave
- Save the contract ID to `.env.local`
- Enable permanent blockchain storage for your application

> 💰 **Note**: Deploying to Arweave requires AR tokens for transaction fees.

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Troubleshooting

If you encounter any issues:

1. Make sure you have run the fix script:
```bash
node scripts/fix-weavedb-dependencies.js
```

2. Check that you have a contract ID in `.env.local`:
```
NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID=<your-contract-id>
```

3. For development, you can always fall back to the mock deployment:
```bash
node scripts/mock-deploy.js
```

## Learn More

- [Arweave Documentation](https://docs.arweave.org/)
- [WeaveDB Documentation](https://docs.weavedb.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT 