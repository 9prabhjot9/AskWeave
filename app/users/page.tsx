import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UsersPage() {
  // This would normally come from your contract or database
  const users = [
    { id: "user1", name: "Alice Johnson", username: "alice", reputation: 1250, questions: 15, answers: 42 },
    { id: "user2", name: "Bob Smith", username: "bob", reputation: 980, questions: 8, answers: 35 },
    { id: "user3", name: "Carol Williams", username: "carol", reputation: 750, questions: 12, answers: 28 },
    { id: "user4", name: "David Brown", username: "david", reputation: 620, questions: 5, answers: 22 },
    { id: "user5", name: "Eve Davis", username: "eve", reputation: 450, questions: 3, answers: 18 },
    { id: "user6", name: "Frank Miller", username: "frank", reputation: 380, questions: 7, answers: 15 },
    { id: "user7", name: "Grace Wilson", username: "grace", reputation: 290, questions: 4, answers: 12 },
    { id: "user8", name: "Henry Taylor", username: "henry", reputation: 210, questions: 2, answers: 10 },
    { id: "user9", name: "Ivy Anderson", username: "ivy", reputation: 180, questions: 1, answers: 8 },
    { id: "user10", name: "Jack Thomas", username: "jack", reputation: 150, questions: 0, answers: 5 },
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button asChild>
            <Link href="/questions/ask">Ask a Question</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Link 
              key={user.id} 
              href={`/users/${user.username}`}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="font-medium">{user.reputation}</div>
                  <div className="text-muted-foreground">Reputation</div>
                </div>
                <div>
                  <div className="font-medium">{user.questions}</div>
                  <div className="text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="font-medium">{user.answers}</div>
                  <div className="text-muted-foreground">Answers</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 