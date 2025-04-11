"use client";

import { useEffect, useState } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQAContract } from "@/hooks";
import { Question } from "@/lib/arweave";

export default function QuestionsPage() {
  const [activeTab, setActiveTab] = useState("newest");
  const [questions, setQuestions] = useState<Question[]>([]);
  const { getQuestions, isLoading } = useQAContract();

  // Fetch questions when the component mounts or activeTab changes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const sort = activeTab as 'newest' | 'active' | 'bounty' | 'hot';
        const fetchedQuestions = await getQuestions(20, 0, sort);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error loading questions:", error);
      }
    };

    loadQuestions();
  }, [activeTab, getQuestions]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Questions</h1>
          <Button asChild>
            <Link href="/questions/ask">Ask a Question</Link>
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="bounty">Bounty</TabsTrigger>
            <TabsTrigger value="hot">Hot</TabsTrigger>
          </TabsList>
          
          {isLoading ? (
            <div className="py-8 text-center">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No questions found</p>
              <Button asChild>
                <Link href="/questions/ask">Ask the first question</Link>
              </Button>
            </div>
          ) : (
            <>
              {["newest", "active", "bounty", "hot"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {questions.map((question) => (
                    <Link key={question.id} href={`/questions/${question.id}`}>
                      <QuestionCard
                        title={question.title}
                        body={question.content}
                        tags={question.tags || []}
                        votes={question.voteCount || 0}
                        answers={(question.answerIds?.length || 0)}
                        views={question.viewCount || 0}
                        bounty={question.bountyAmount || 0}
                        timeAgo={formatDate(question.createdAt)}
                        author={{
                          name: question.author?.substring(0, 10) || "Anonymous",
                          reputation: 0,
                          avatar: "/placeholder.svg?height=32&width=32"
                        }}
                      />
                    </Link>
                  ))}
                </TabsContent>
              ))}
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
} 