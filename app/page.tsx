"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { QuestionCard } from "@/components/question-card"
import { TagBadge } from "@/components/tag-badge"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
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
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-bold">AskWeave</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 rounded-md border border-input bg-background"
              />
            </div>
            <ModeToggle />
            <ConnectWalletButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <nav className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Navigation</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" className="flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/questions"
                      className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      Questions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tags"
                      className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                        <path d="M7 7h.01" />
                      </svg>
                      Tags
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/users"
                      className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/governance"
                      className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-2"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                      Governance
                    </Link>
                  </li>
                </ul>
              </div>
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
            </nav>
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Top Questions</h1>
              <Link href="/questions/ask">
                <Button>Ask Question</Button>
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={activeSort === 'newest' ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveSort('newest')}
                >
                  Newest
                </Button>
                <Button
                  variant={activeSort === 'active' ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveSort('active')}
                >
                  Active
                </Button>
                <Button
                  variant={activeSort === 'bounty' ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveSort('bounty')}
                >
                  Bounties
                </Button>
                <Button
                  variant={activeSort === 'hot' ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveSort('hot')}
                >
                  Hot
                </Button>
              </div>
              
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
                questions.map((question) => (
                  <div key={question.id}>
                    <QuestionCard
                      title={question.title}
                      body={question.content}
                      tags={question.tags || []}
                      votes={question.voteCount || 0}
                      answers={(question.answerIds?.length || 0)}
                      views={question.viewCount || 0}
                      bounty={question.bountyAmount || 0}
                      timeAgo={formatTimeAgo(question.timestamp)}
                      author={{
                        name: question.author?.substring(0, 10) || "Anonymous",
                        reputation: 0,
                        avatar: "/placeholder.svg?height=32&width=32"
                      }}
                      questionId={question.id}
                      onVote={handleVote}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/10 text-primary">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <span>...</span>
                <Button variant="outline" size="sm">
                  12
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="font-bold">AskWeave</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>© 2025 AskWeave. Permanently stored on the Arweave network.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
