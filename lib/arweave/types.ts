import { Question as BaseQuestion } from './contracts/qa-contract';

// Extended Question type with Arweave-specific properties
export interface Question extends BaseQuestion {
  // Arweave transaction ID where the question data is stored
  arweaveTxId?: string;
}

// Re-export the base type as a fallback
export type { BaseQuestion }; 