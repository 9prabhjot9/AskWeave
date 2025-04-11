# AskWeave Deployment Guide

This guide will help you deploy AskWeave to the Arweave blockchain to enable permanent storage of questions and answers.

## Prerequisites

- Node.js 16+ installed on your system
- An Arweave wallet with AR tokens (for deployment)
- Basic knowledge of terminal/command-line operations

## Deployment Steps

### 1. Generate an Arweave Wallet

If you don't already have an Arweave wallet, you can generate one using our script:

```bash
npm run create-wallet
```

This will create a `wallet.json` file in your project root. **IMPORTANT**: Back this up securely as it gives full access to your funds.

### 2. Fund Your Wallet

The script will display your wallet address. You need to fund this address with AR tokens:

- For testing: Use the [Arweave Faucet](https://faucet.arweave.net/) to get free testnet tokens
- For production: Purchase AR tokens from an exchange and send them to your wallet address

You can check your wallet balance at [ViewBlock](https://viewblock.io/arweave) by searching for your wallet address.

### 3. Deploy WeaveDB

Once your wallet is funded, deploy your WeaveDB instance:

```bash
npm run deploy-weavedb
```

This script will:
1. Deploy a WeaveDB contract to Arweave
2. Create collections for questions, answers, votes, etc.
3. Set up appropriate rules and indexes
4. Save the contract ID to your `.env.local` file

The deployment will take a few minutes as transactions are mined on the Arweave network.

### 4. Verify Deployment

After deployment, your `.env.local` file will contain your WeaveDB contract ID:

```
NEXT_PUBLIC_WEAVEDB_CONTRACT_ID=your-contract-id-here
```

You can verify your deployment by checking the contract on [ViewBlock](https://viewblock.io/arweave) by searching for the contract ID.

### 5. Restart Your Application

Restart your development server to apply the new contract ID:

```bash
npm run dev
```

## Data Storage

Once deployed, all your application data will be stored permanently on the Arweave blockchain through WeaveDB:

- **Questions** - Stored in the 'questions' collection
- **Answers** - Stored in the 'answers' collection
- **Votes** - Stored in the 'votes' collection
- **Users** - Stored in the 'users' collection
- **Tags** - Stored in the 'tags' collection

Each write operation (creating a question, posting an answer, etc.) requires a small amount of AR tokens as a storage fee.

## Troubleshooting

### Deployment Failures

If deployment fails, check:

1. **Wallet Balance**: Ensure your wallet has enough AR tokens
2. **Network Issues**: Confirm you have a stable internet connection
3. **Permissions**: Make sure `wallet.json` is accessible to the script

### Connection Issues

If your app isn't connecting to WeaveDB after deployment:

1. Check that `.env.local` contains the correct contract ID
2. Verify the contract ID is accessible by browsing to it on ViewBlock
3. Restart your development server to load new environment variables

For additional help, consult the [WeaveDB documentation](https://docs.weavedb.dev/). 