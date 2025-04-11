"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowDown, Check, MessageSquare, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { TagBadge } from "@/components/tag-badge";
import { useQAContract } from "@/hooks";
import { useWallet } from "@/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AnswerType {
  id: string;
  content: string;
  author: string;
  createdAt: number;
  voteCount: number;
  isAccepted: boolean;
}

export default function QuestionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getQuestion, answerQuestion, voteOnContent, acceptAnswer, isLoading, error } = useQAContract();
  const { isConnected, walletAddress } = useWallet();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<AnswerType[]>([]);
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch question details
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const data = await getQuestion(id as string);
        if (data) {
          setQuestion(data);
          setAnswers(data.answers || []);
        }
      } catch (error) {
        console.error("Error loading question:", error);
      }
    };

    if (id) {
      loadQuestion();
    }
  }, [id, getQuestion]);

  // Handle submitting an answer
  const handleAnswerSubmit = async () => {
    if (!answerContent.trim() || !isConnected) return;
    
    setIsSubmitting(true);
    try {
      const answerId = await answerQuestion(id as string, answerContent);
      if (answerId) {
        // Show success animation before redirecting
        setShowSuccess(true);
        
        // Redirect to home page after animation completes
        setTimeout(() => {
          router.push('/');
        }, 2000); // 2 second delay
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  // Handle voting
  const handleVote = async (targetId: string, targetType: 'question' | 'answer', voteType: 'up' | 'down') => {
    if (!isConnected) return;
    
    try {
      await voteOnContent(targetId, targetType, voteType);
      // Refresh the question data
      const updatedQuestion = await getQuestion(id as string);
      setQuestion(updatedQuestion);
      setAnswers(updatedQuestion.answers || []);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Handle accepting an answer
  const handleAcceptAnswer = async (answerId: string) => {
    if (!isConnected || !question || question.author !== walletAddress) return;
    
    try {
      await acceptAnswer(id as string, answerId);
      // Refresh the question data
      const updatedQuestion = await getQuestion(id as string);
      setQuestion(updatedQuestion);
      setAnswers(updatedQuestion.answers || []);
    } catch (error) {
      console.error("Error accepting answer:", error);
    }
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold">Question not found</h1>
            <p className="text-muted-foreground">{error || "This question may have been removed or doesn't exist."}</p>
            <Button asChild>
              <Link href="/questions">Back to Questions</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Success overlay - shows when submission is successful */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50 fade-in">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center max-w-md mx-auto slide-in-up">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4 success-icon" />
            <h3 className="text-xl font-bold mb-2">Answer Submitted!</h3>
            <p className="text-muted-foreground mb-4">Your answer has been posted successfully.</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full animate-progress" style={{
                width: '0%',
                animation: 'progress-bar 1.8s ease-in-out forwards'
              }}></div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Redirecting to home page...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Question header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
            <div>
              <span>Asked {formatDate(question.createdAt)}</span>
              {question.updatedAt > question.createdAt && (
                <span> • Modified {formatDate(question.updatedAt)}</span>
              )}
              <span> • Viewed {question.viewCount || 0} times</span>
            </div>
            <Button asChild>
              <Link href="/questions/ask">Ask Question</Link>
            </Button>
          </div>
        </div>

        {/* Question and answers container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Voting controls */}
          <div className="md:col-span-1 flex md:flex-col items-center justify-start md:justify-start gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVote(question.id, 'question', 'up')}
              disabled={!isConnected}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
            <span className="text-xl font-semibold">{question.voteCount || 0}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleVote(question.id, 'question', 'down')}
              disabled={!isConnected}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
            {question.bountyAmount > 0 && (
              <div className="mt-2 flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="font-semibold">{question.bountyAmount}</span>
              </div>
            )}
          </div>

          {/* Question content */}
          <div className="md:col-span-11 space-y-6">
            <div className="prose max-w-none dark:prose-invert">
              <p>{question.content}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {(question.tags || []).map((tag: string) => (
                <TagBadge key={tag} name={tag} />
              ))}
            </div>

            {/* Question footer */}
            <div className="flex justify-between items-start pt-4">
              <div className="text-sm">
                {/* Empty div for layout */}
              </div>
              <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{question.author?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{question.author?.substring(0, 10) || "Anonymous"}</div>
                  <div className="text-xs text-muted-foreground">Asked {formatDate(question.createdAt)}</div>
                </div>
              </div>
            </div>

            {/* Answer count */}
            <div className="pt-8 pb-2">
              <h2 className="text-xl font-semibold">
                {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
              </h2>
            </div>

            <Separator />

            {/* Answers */}
            {answers.length > 0 ? (
              <div className="space-y-8">
                {answers.map((answer) => (
                  <div key={answer.id} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Answer voting */}
                    <div className="md:col-span-1 flex md:flex-col items-center justify-start gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(answer.id, 'answer', 'up')}
                        disabled={!isConnected}
                      >
                        <ArrowUp className="h-6 w-6" />
                      </Button>
                      <span className="text-xl font-semibold">{answer.voteCount || 0}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(answer.id, 'answer', 'down')}
                        disabled={!isConnected}
                      >
                        <ArrowDown className="h-6 w-6" />
                      </Button>
                      {answer.isAccepted && (
                        <div className="mt-2">
                          <Check className="h-6 w-6 text-green-500" />
                        </div>
                      )}
                      {!answer.isAccepted && question.author === walletAddress && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAcceptAnswer(answer.id)}
                          title="Accept this answer"
                        >
                          <Check className="h-6 w-6 text-muted-foreground" />
                        </Button>
                      )}
                    </div>

                    {/* Answer content */}
                    <div className="md:col-span-11 space-y-6">
                      <div className="prose max-w-none dark:prose-invert">
                        <p>{answer.content}</p>
                      </div>

                      {/* Answer footer */}
                      <div className="flex justify-between items-start pt-4">
                        <div className="text-sm">
                          {/* Empty div for layout */}
                        </div>
                        <div className="bg-muted p-4 rounded-lg flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{answer.author?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{answer.author?.substring(0, 10) || "Anonymous"}</div>
                            <div className="text-xs text-muted-foreground">Answered {formatDate(answer.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No answers yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to answer this question!</p>
              </div>
            )}

            <Separator className="my-4" />

            {/* Answer form */}
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
              {isConnected ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your answer here..."
                    className="min-h-[200px]"
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    disabled={showSuccess}
                  />
                  <Button 
                    onClick={handleAnswerSubmit} 
                    disabled={!answerContent.trim() || isSubmitting || showSuccess}
                    className={showSuccess ? "opacity-50" : ""}
                  >
                    {isSubmitting && !showSuccess ? "Submitting..." : showSuccess ? "Posted Successfully" : "Post Your Answer"}
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg text-center">
                  <p className="mb-4">You need to connect your wallet to answer this question.</p>
                  <Link href="/connect" className="text-primary hover:underline">
                    Connect Wallet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 