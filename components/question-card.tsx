import Link from "next/link"
import { ArrowUp, ArrowDown, MessageSquare, Eye, Award, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Question } from "@/lib/arweave"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface QuestionCardProps {
  question: Question
  formatTimeAgo: (timestamp: number) => string
  onVote?: (questionId: string, voteType: 'up' | 'down', e: React.MouseEvent) => void
}

export function QuestionCard({ 
  question,
  formatTimeAgo,
  onVote
}: QuestionCardProps) {
  // Create a URL for the question
  const questionUrl = question?.id 
    ? `/questions/${question.id}` 
    : "#";
  
  // Handler for vote buttons
  const handleVoteClick = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    if (onVote && question?.id) {
      onVote(question.id, voteType, e);
    }
  };

  // Format the author display
  const authorDisplay = question?.author 
    ? question.author.substring(0, 10) + "..." 
    : "Anonymous";
  
  const timeAgoText = formatTimeAgo(question?.timestamp || 0);
  
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="flex">
          <div className="flex flex-col items-center p-4 border-r">
            <div className="flex flex-col items-center gap-1">
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => handleVoteClick('up', e)}
                disabled={!onVote || !question?.id}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="font-medium">{question?.voteCount || 0}</span>
              <button 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => handleVoteClick('down', e)}
                disabled={!onVote || !question?.id}
              >
                <ArrowDown className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col items-center mt-4 gap-1">
              <div className="flex items-center text-muted-foreground">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{question?.answerIds?.length || 0}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>{question?.viewCount || 0}</span>
              </div>
              {question?.bountyAmount && question.bountyAmount > 0 && (
                <div className="flex items-center text-amber-500 mt-2">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="font-medium">{question.bountyAmount} AR</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 p-4">
            <Link 
              href={questionUrl}
              className="hover:underline"
            >
              <h3 className="text-xl font-semibold">{question?.title}</h3>
            </Link>
            <p className="mt-2 text-muted-foreground line-clamp-2">{question?.content}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {question?.tags?.map((tag, index) => (
                <Badge key={`${tag}-${index}`} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {question?.arweaveTxId && (
              <div className="mt-3 text-xs text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs gap-1"
                        asChild
                      >
                        <a 
                          href={`https://viewblock.io/arweave/tx/${question.arweaveTxId}`} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          <span>Stored on Arweave</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Arweave</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/30 text-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${question?.author}`} alt={authorDisplay} />
            <AvatarFallback>{authorDisplay.substring(0, 2) || "??"}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">asked {timeAgoText} by</span>
            <Link href={`/users/${question?.author}`} className="font-medium hover:text-primary">
              {authorDisplay}
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
