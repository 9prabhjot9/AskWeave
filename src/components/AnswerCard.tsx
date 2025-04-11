import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import TipButton from './TipButton';

interface AnswerCardProps {
  answer: {
    id: string;
    content: string;
    author: string;
    timestamp: number;
    upvotes: number;
  };
  onUpvote: (answerId: string) => void;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer, onUpvote }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-700 mb-4">{answer.content}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Answered by {answer.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDistanceToNow(new Date(answer.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <button
            onClick={() => onUpvote(answer.id)}
            className="text-gray-500 hover:text-blue-500 mb-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          <span className="text-gray-600">{answer.upvotes}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <TipButton />
      </div>
    </div>
  );
};

export default AnswerCard; 