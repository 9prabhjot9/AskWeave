import Link from "next/link"
import { format } from "date-fns"
import { ArrowUpIcon, MessageSquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TagBadge } from "@/components/tag-badge"

export interface Question {
  id: string
  title: string
  content: string
  author: string
  timestamp: number
  upvotes: number
  answerCount?: number
  tags?: string[]
}

interface QuestionCardProps {
  question: Question
  showActions?: boolean
}

export function QuestionCard({ question, showActions = true }: QuestionCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="space-y-2">
        <Link
          href={`/question/${question.id}`}
          className="text-xl font-semibold hover:text-blue-600"
        >
          {question.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {question.content}
        </p>
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <TagBadge key={tag} name={tag} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Asked by {question.author} on{" "}
          {format(new Date(question.timestamp), "MMM d, yyyy")}
        </div>
        {showActions && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Upvote"
              >
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{question.upvotes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="View answers"
              >
                <MessageSquareIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {question.answerCount || 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 