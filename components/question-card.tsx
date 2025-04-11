import Link from "next/link"
import { ArrowUp, ArrowDown, MessageSquare, Eye, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface QuestionCardProps {
  title: string
  body: string
  tags: string[]
  votes: number
  answers: number
  views: number
  bounty?: number
  timeAgo: string
  author: {
    name: string
    reputation: number
    avatar: string
  }
  questionId?: string
  onVote?: (questionId: string, voteType: 'up' | 'down', e: React.MouseEvent) => void
}

export function QuestionCard({ 
  title = "", 
  body = "", 
  tags = [], 
  votes = 0, 
  answers = 0, 
  views = 0, 
  bounty, 
  timeAgo = "", 
  author,
  questionId,
  onVote
}: QuestionCardProps) {
  // Create a URL for the question
  const questionUrl = questionId 
    ? `/questions/${questionId}` 
    : title 
      ? `/questions/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))}` 
      : "#";
  
  // Handler for vote buttons
  const handleVoteClick = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    if (onVote && questionId) {
      onVote(questionId, voteType, e);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="flex flex-col items-center p-4 border-r">
            <div className="flex flex-col items-center gap-1">
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => handleVoteClick('up', e)}
                disabled={!onVote || !questionId}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="font-medium">{votes}</span>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => handleVoteClick('down', e)}
                disabled={!onVote || !questionId}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col items-center mt-4 gap-1">
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{answers}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>{views}</span>
              </div>
              {bounty && (
                <div className="flex items-center text-amber-500 mt-2">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="font-medium">{bounty} AR</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 p-4">
            <Link href={questionUrl}>
              <h3 className="text-lg font-semibold hover:text-primary">{title}</h3>
            </Link>
            <p className="mt-2 text-muted-foreground line-clamp-2">{body}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/30 text-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author?.avatar} alt={author?.name} />
            <AvatarFallback>{author?.name?.substring(0, 2) || "??"}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">asked {timeAgo} by</span>
            <Link href={`/users/${author?.name}`} className="font-medium hover:text-primary">
              {author?.name || "Anonymous"}
            </Link>
            <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded-md">
              {author?.reputation?.toLocaleString() || "0"}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
