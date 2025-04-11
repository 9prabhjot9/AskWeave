import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import TipButton from './TipButton';

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    author: string;
    timestamp: number;
    topAnswerer?: string;
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <Link href={`/question/${question.id}`}>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600">
          {question.title}
        </h3>
      </Link>
      <p className="text-gray-600 mb-4">{question.content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <span>Asked by {question.author}</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(new Date(question.timestamp), { addSuffix: true })}</span>
        </div>
        {question.topAnswerer && (
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Top Answerer: {question.topAnswerer}</span>
            <TipButton className="text-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard; 