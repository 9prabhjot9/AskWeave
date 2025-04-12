"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { TagBadge } from "@/components/tag-badge"
import { useQAContract } from "@/hooks"
import { Question, Collections } from "@/lib/arweave"
import StorageService from "@/lib/storage"

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [popularTags, setPopularTags] = useState<any[]>([]);
  const [activeSort, setActiveSort] = useState<'newest' | 'active' | 'bounty' | 'hot'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  
  const { getQuestions, voteOnContent } = useQAContract();

  // Fetch questions when component mounts or sort changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch questions
        const fetchedQuestions = await getQuestions(10, 0, activeSort);
        setQuestions(fetchedQuestions);
        
        // Fetch tags
        const tagsData = await StorageService.queryDocuments(Collections.TAGS);
        
        // Sort by count if available, otherwise take the first 6
        const sortedTags = tagsData.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 6);
        setPopularTags(sortedTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getQuestions, activeSort]);
  
  // Handle voting on a question
  const handleVote = async (questionId: string, voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    try {
      await voteOnContent(questionId, 'question', voteType);
      // Refresh questions after voting
      const updatedQuestions = await getQuestions(10, 0, activeSort);
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error voting on question:", error);
    }
  };

  // Format date for display
  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp) return "unknown time ago";
    
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    if (interval === 1) return "1 year ago";
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    if (interval === 1) return "1 month ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    if (interval === 1) return "1 day ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    if (interval === 1) return "1 hour ago";
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    if (interval === 1) return "1 minute ago";
    
    return "just now";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading tags...</div>
                ) : popularTags.length > 0 ? (
                  popularTags.map((tag, index) => (
                    <TagBadge key={`tag-${tag.name}-${index}`} name={tag.name} count={tag.count || 0} />
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No tags found</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Top Questions</h1>
            <Button asChild>
              <Link href="/ask">Ask Question</Link>
            </Button>
          </div>
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 ${activeSort === 'newest' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveSort('newest')}
            >
              Newest
            </button>
            <button
              className={`px-4 py-2 ${activeSort === 'active' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveSort('active')}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 ${activeSort === 'bounty' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveSort('bounty')}
            >
              Bounty
            </button>
            <button
              className={`px-4 py-2 ${activeSort === 'hot' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveSort('hot')}
            >
              Hot
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="p-6 border rounded-lg animate-pulse">
                  <div className="w-3/4 h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="w-full h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-1/4 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  formatTimeAgo={formatTimeAgo}
                  onVote={handleVote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-10 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">Be the first to ask a question on AskWeave!</p>
              <Button asChild>
                <Link href="/ask">Ask a Question</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
