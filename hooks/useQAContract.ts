"use client";

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useWallet } from './useWallet';
import { Collections } from '@/lib/arweave/weavedb';
import { 
  initWeaveDB, 
  getDocument, 
  queryDocuments, 
  addDocument, 
  updateDocument
} from '@/lib/arweave/weavedb';

// Type definitions for the Q&A data model
export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  tags: string[];
  answerIds: string[];
  voteCount: number;
  bountyAmount: number;
  bountyId?: string;
  isClosed: boolean;
  isAccepted: boolean;
  acceptedAnswerId?: string;
  viewCount: number;
  commentIds: string[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  voteCount: number;
  upvotes: string[];
  downvotes: string[];
  isAccepted: boolean;
}

// Return type for the hook
interface UseQAContractReturn {
  isLoading: boolean;
  error: string | null;
  getQuestions: (limit?: number, offset?: number, sort?: 'newest' | 'active' | 'bounty' | 'hot') => Promise<Question[]>;
  getQuestion: (questionId: string) => Promise<any>;
  askQuestion: (title: string, content: string, tags: string[]) => Promise<string | null>;
  answerQuestion: (questionId: string, content: string) => Promise<string | null>;
  voteOnContent: (contentId: string, contentType: 'question' | 'answer', voteType: 'up' | 'down') => Promise<boolean>;
  acceptAnswer: (questionId: string, answerId: string) => Promise<boolean>;
}

// Initialize the database
let dbInitialized = false;
export async function ensureDBInitialized() {
  if (!dbInitialized) {
    await initWeaveDB();
    dbInitialized = true;
  }
}

export function useQAContract(): UseQAContractReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { walletAddress, isConnected } = useWallet();
  const { toast } = useToast();

  // Get a list of questions
  const getQuestions = useCallback(async (
    limit: number = 10,
    offset: number = 0,
    sort: 'newest' | 'active' | 'bounty' | 'hot' = 'newest'
  ): Promise<Question[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Query questions from the database
      const questions = await queryDocuments(Collections.QUESTIONS);
      
      // Sort questions based on the sort parameter
      let sortedQuestions = [...questions];
      
      switch (sort) {
        case 'newest':
          sortedQuestions.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          break;
        case 'active':
          sortedQuestions.sort((a, b) => ((b.answerIds?.length || 0) - (a.answerIds?.length || 0)));
          break;
        case 'bounty':
          sortedQuestions.sort((a, b) => ((b.bountyAmount || 0) - (a.bountyAmount || 0)));
          break;
        case 'hot':
          sortedQuestions.sort((a, b) => ((b.voteCount || 0) - (a.voteCount || 0)));
          break;
      }
      
      // Apply pagination
      const paginatedQuestions = sortedQuestions.slice(offset, offset + limit);
      
      return paginatedQuestions;
    } catch (err: any) {
      console.error('Error getting questions:', err);
      setError(err.message || 'Failed to get questions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get a single question with its answers
  const getQuestion = useCallback(async (questionId: string): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Get the question
      const question = await getDocument(Collections.QUESTIONS, questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      // Increment view count
      await updateDocument(
        Collections.QUESTIONS,
        questionId,
        { viewCount: (question.viewCount || 0) + 1 }
      );
      
      // Get answers for this question
      const answers = await queryDocuments(
        Collections.ANSWERS,
        [['where', 'questionId', '==', questionId]]
      );
      
      // Sort answers: accepted first, then by vote count
      answers.sort((a, b) => {
        if (a.isAccepted && !b.isAccepted) return -1;
        if (!a.isAccepted && b.isAccepted) return 1;
        return (b.voteCount || 0) - (a.voteCount || 0);
      });
      
      // Return combined data
      return {
        ...question,
        id: questionId,
        answers,
        viewCount: (question.viewCount || 0) + 1
      };
    } catch (err: any) {
      console.error('Error getting question:', err);
      setError(err.message || 'Failed to get question');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ask a new question
  const askQuestion = useCallback(async (
    title: string,
    content: string,
    tags: string[]
  ): Promise<string | null> => {
    try {
      if (!isConnected) {
        throw new Error('You must connect your wallet to ask a question');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Create question data
      const timestamp = Date.now();
      const questionData = {
        title,
        content,
        tags,
        author: walletAddress,
        createdAt: timestamp,
        updatedAt: timestamp,
        voteCount: 0,
        upvotes: [],
        downvotes: [],
        viewCount: 0,
        answerIds: [],
        bountyAmount: 0
      };
      
      // Add question to database
      const result = await addDocument(Collections.QUESTIONS, questionData);
      
      if (!result) {
        throw new Error('Failed to add question');
      }
      
      // Update tag counts
      for (const tag of tags) {
        try {
          // Try to get existing tag
          const existingTag = await getDocument(Collections.TAGS, tag).catch(() => null);
          
          if (existingTag) {
            // Update existing tag
            await updateDocument(
              Collections.TAGS,
              tag,
              { count: (existingTag.count || 0) + 1 }
            );
          } else {
            // Create new tag
            await addDocument(
              Collections.TAGS,
              { name: tag, count: 1 },
              tag
            );
          }
        } catch (err) {
          console.error(`Error updating tag ${tag}:`, err);
        }
      }
      
      toast({
        title: 'Question Asked',
        description: 'Your question has been posted successfully!'
      });
      
      return result.id;
    } catch (err: any) {
      console.error('Error asking question:', err);
      setError(err.message || 'Failed to ask question');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to ask question',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  // Answer a question
  const answerQuestion = useCallback(async (
    questionId: string,
    content: string
  ): Promise<string | null> => {
    try {
      if (!isConnected) {
        throw new Error('You must connect your wallet to answer a question');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Get the question
      const question = await getDocument(Collections.QUESTIONS, questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      // Create answer data
      const timestamp = Date.now();
      const answerData = {
        questionId,
        content,
        author: walletAddress,
        createdAt: timestamp,
        updatedAt: timestamp,
        voteCount: 0,
        upvotes: [],
        downvotes: [],
        isAccepted: false
      };
      
      // Add answer to database
      const result = await addDocument(Collections.ANSWERS, answerData);
      
      if (!result) {
        throw new Error('Failed to add answer');
      }
      
      // Update question with new answerId
      const answerIds = [...(question.answerIds || []), result.id];
      await updateDocument(
        Collections.QUESTIONS,
        questionId,
        { answerIds }
      );
      
      toast({
        title: 'Answer Posted',
        description: 'Your answer has been posted successfully!'
      });
      
      return result.id;
    } catch (err: any) {
      console.error('Error answering question:', err);
      setError(err.message || 'Failed to answer question');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to answer question',
        variant: 'destructive'
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  // Vote on a question or answer
  const voteOnContent = useCallback(async (
    contentId: string,
    contentType: 'question' | 'answer',
    voteType: 'up' | 'down'
  ): Promise<boolean> => {
    try {
      if (!isConnected) {
        throw new Error('You must connect your wallet to vote');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Get the content
      const collection = contentType === 'question' ? Collections.QUESTIONS : Collections.ANSWERS;
      const content = await getDocument(collection, contentId);
      
      if (!content) {
        throw new Error(`${contentType} not found`);
      }
      
      // Check if user has already voted
      const upvotes = content.upvotes || [];
      const downvotes = content.downvotes || [];
      const hasUpvoted = upvotes.includes(walletAddress);
      const hasDownvoted = downvotes.includes(walletAddress);
      
      // Calculate vote count change
      let voteCountChange = 0;
      let newUpvotes = [...upvotes];
      let newDownvotes = [...downvotes];
      
      // Handle upvoting
      if (voteType === 'up') {
        if (hasUpvoted) {
          // Remove upvote
          newUpvotes = newUpvotes.filter(addr => addr !== walletAddress);
          voteCountChange = -1;
        } else {
          // Add upvote
          newUpvotes.push(walletAddress);
          voteCountChange = 1;
          
          // Remove downvote if exists
          if (hasDownvoted) {
            newDownvotes = newDownvotes.filter(addr => addr !== walletAddress);
            voteCountChange += 1;
          }
        }
      }
      // Handle downvoting
      else if (voteType === 'down') {
        if (hasDownvoted) {
          // Remove downvote
          newDownvotes = newDownvotes.filter(addr => addr !== walletAddress);
          voteCountChange = 1;
        } else {
          // Add downvote
          newDownvotes.push(walletAddress);
          voteCountChange = -1;
          
          // Remove upvote if exists
          if (hasUpvoted) {
            newUpvotes = newUpvotes.filter(addr => addr !== walletAddress);
            voteCountChange -= 1;
          }
        }
      }
      
      // Update content with new vote data
      const newVoteCount = (content.voteCount || 0) + voteCountChange;
      await updateDocument(
        collection,
        contentId,
        {
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          voteCount: newVoteCount
        }
      );
      
      return true;
    } catch (err: any) {
      console.error('Error voting on content:', err);
      setError(err.message || 'Failed to vote');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to vote',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  // Accept an answer
  const acceptAnswer = useCallback(async (
    questionId: string,
    answerId: string
  ): Promise<boolean> => {
    try {
      if (!isConnected) {
        throw new Error('You must connect your wallet to accept an answer');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Ensure database is initialized
      await ensureDBInitialized();

      // Get the question
      const question = await getDocument(Collections.QUESTIONS, questionId);
      
      if (!question) {
        throw new Error('Question not found');
      }
      
      // Check if user is question author
      if (question.author !== walletAddress) {
        throw new Error('Only the question author can accept an answer');
      }
      
      // Get answer
      const answer = await getDocument(Collections.ANSWERS, answerId);
      
      if (!answer) {
        throw new Error('Answer not found');
      }
      
      // Update question with accepted answer ID
      await updateDocument(
        Collections.QUESTIONS,
        questionId,
        { acceptedAnswerId: answerId }
      );
      
      // Update answer to mark as accepted
      await updateDocument(
        Collections.ANSWERS,
        answerId,
        { isAccepted: true }
      );
      
      toast({
        title: 'Answer Accepted',
        description: 'You have accepted this answer!'
      });
      
      return true;
    } catch (err: any) {
      console.error('Error accepting answer:', err);
      setError(err.message || 'Failed to accept answer');
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to accept answer',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  return {
    isLoading,
    error,
    getQuestions,
    getQuestion,
    askQuestion,
    answerQuestion,
    voteOnContent,
    acceptAnswer
  };
} 