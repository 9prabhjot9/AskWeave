"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useQAContract } from "@/hooks/useQAContract"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

export default function AskQuestionPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { askQuestion, isLoading, error } = useQAContract()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const tagArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      const questionId = await askQuestion(title, content, tagArray)
      
      if (questionId) {
        // Show success animation
        setShowSuccess(true)
        
        // Redirect to home page after animation completes
        setTimeout(() => {
          router.push('/')
        }, 2000) // 2 second delay
      } else {
        toast({
          title: "Error",
          description: "Failed to submit your question",
          variant: "destructive",
        })
        setIsSubmitting(false)
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred while submitting your question",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Success overlay - shows when submission is successful */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50 fade-in">
          <div className="bg-card p-8 rounded-lg shadow-lg text-center flex flex-col items-center max-w-md mx-auto slide-in-up">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4 success-icon" />
            <h3 className="text-xl font-bold mb-2">Question Submitted!</h3>
            <p className="text-muted-foreground mb-4">Your question has been posted successfully.</p>
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ask a Question</h1>
          <Button variant="outline" asChild>
            <Link href="/questions">Back to Questions</Link>
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's your question? Be specific."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting || showSuccess}
              />
              <p className="text-sm text-muted-foreground">
                A good title is clear, specific, and descriptive.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Details</Label>
              <Textarea
                id="content"
                placeholder="Provide more context about your question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                required
                disabled={isSubmitting || showSuccess}
              />
              <p className="text-sm text-muted-foreground">
                Include any relevant code, error messages, or examples.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="arweave, blockchain, javascript (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                disabled={isSubmitting || showSuccess}
              />
              <p className="text-sm text-muted-foreground">
                Add up to 5 tags to help others find your question.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading || showSuccess}
                className={showSuccess ? "opacity-50" : ""}
              >
                {isSubmitting && !showSuccess 
                  ? "Submitting..." 
                  : showSuccess 
                  ? "Posted Successfully" 
                  : "Submit Question"
                }
              </Button>
            </div>
            
            {error && !showSuccess && (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 