import Arweave from "arweave";
import { WeaveDB } from "weavedb-sdk";

// Initialize Arweave with mainnet configuration
const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

// Use a default contract ID for mainnet
// For simplicity, we're using a mock contract ID which will use
// local storage during development
// In production, you should deploy your own contract
const MOCK_CONTRACT_ID = "mock-contract-id";

// Initialize WeaveDB with mainnet configuration
const db = new WeaveDB({
  contractTxId: MOCK_CONTRACT_ID,
  arweave: arweave,
});

// Initialize the database
db.init();

// Your ArDrive wallet address
export const ARDRIVE_WALLET_ADDRESS = "jKpXerisNlv1ewb1NjVVy9jpopiR9GZRJ1Q-B15i-l8w";

// Function to store a question
export const addQuestion = async (title: string, content: string, author: string) => {
  try {
    const question = {
      title,
      content,
      author,
      timestamp: Date.now(),
      upvotes: 0,
    };
    
    const result = await db.add(question, "questions");
    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error("Error adding question:", error);
    return {
      success: false,
      error,
    };
  }
};

// Function to get all questions
export const getQuestions = async () => {
  try {
    const questions = await db.get("questions");
    return {
      success: true,
      questions,
    };
  } catch (error) {
    console.error("Error getting questions:", error);
    return {
      success: false,
      error,
    };
  }
};

// Function to add an answer
export const addAnswer = async (questionId: string, content: string, author: string) => {
  try {
    const answer = {
      questionId,
      content,
      author,
      timestamp: Date.now(),
      upvotes: 0,
    };
    
    const result = await db.add(answer, "answers");
    return {
      success: true,
      id: result.id,
    };
  } catch (error) {
    console.error("Error adding answer:", error);
    return {
      success: false,
      error,
    };
  }
};

// Function to get answers for a question
export const getAnswers = async (questionId: string) => {
  try {
    const answers = await db.get("answers", ["questionId", "==", questionId]);
    return {
      success: true,
      answers,
    };
  } catch (error) {
    console.error("Error getting answers:", error);
    return {
      success: false,
      error,
    };
  }
};

// Function to upvote an answer
export const upvoteAnswer = async (answerId: string) => {
  try {
    const answer = await db.get("answers", ["id", "==", answerId]);
    if (answer) {
      await db.update({ upvotes: answer.upvotes + 1 }, "answers", answerId);
      return { success: true };
    }
    return { success: false, error: "Answer not found" };
  } catch (error) {
    console.error("Error upvoting answer:", error);
    return { success: false, error };
  }
};

// Function to send AR tokens as a tip to your ArDrive wallet
export const sendTip = async (fromAddress: string, amount: number) => {
  try {
    const tx = await arweave.createTransaction({
      target: ARDRIVE_WALLET_ADDRESS, // Your ArDrive wallet address
      quantity: arweave.ar.arToWinston(amount.toString()),
    });

    // Sign the transaction
    await arweave.transactions.sign(tx);

    // Submit the transaction
    const response = await arweave.transactions.post(tx);
    
    return {
      success: true,
      txId: tx.id,
      response
    };
  } catch (error) {
    console.error("Error sending tip:", error);
    return {
      success: false,
      error
    };
  }
};

// Function to get user's AR balance
export const getBalance = async (address: string) => {
  try {
    const balance = await arweave.wallets.getBalance(address);
    return arweave.ar.winstonToAr(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    return "0";
  }
};

export default db; 