import Link from "next/link"
import { ArrowRight, ShieldCheck, Users, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export default function Governance() {
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
          <ConnectWalletButton />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <nav className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Navigation</h3>
                <ul className="space-y-1">
                  <li>
                    <Link href="/" className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent">
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
                      className="flex items-center px-3 py-2 rounded-md bg-primary/10 text-primary"
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
                <h3 className="font-medium mb-2">Governance Stats</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Proposals</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Votes Cast</span>
                    <span className="font-medium">3,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participation Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DAO Treasury</span>
                    <span className="font-medium">12,450 AR</span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">DAO Governance</h1>
              <Button>Create Proposal</Button>
            </div>

            <div className="grid gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Platform Governance</CardTitle>
                  <CardDescription>
                    AskWeave is governed by its community through a Decentralized Autonomous Organization (DAO).
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Vote className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Vote on Proposals</h3>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        Use your governance tokens to vote on community proposals
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <ShieldCheck className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Moderate Content</h3>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        Help maintain quality by participating in moderation
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                      <Users className="h-8 w-8 mb-2 text-primary" />
                      <h3 className="font-medium">Join Committees</h3>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        Participate in specialized governance committees
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-bold mb-4">Active Proposals</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>Increase Bounty Rewards for Top Answers</CardTitle>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                      Active
                    </span>
                  </div>
                  <CardDescription>Proposal #32 • Ends in 3 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This proposal suggests increasing the platform's contribution to bounty rewards for answers with
                    more than 20 upvotes by 25%, to incentivize high-quality responses.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yes</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>No</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">1,245 votes cast • 68% participation</div>
                  <Button variant="outline" size="sm">
                    Cast Vote
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>Add New Category for AI and Machine Learning</CardTitle>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                      Active
                    </span>
                  </div>
                  <CardDescription>Proposal #31 • Ends in 5 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This proposal suggests adding a dedicated category for AI and Machine Learning topics, with
                    specialized tags and potentially dedicated moderators with expertise in the field.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yes</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>No</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">982 votes cast • 54% participation</div>
                  <Button variant="outline" size="sm">
                    Cast Vote
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>Implement Token-Based Reputation System</CardTitle>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                      Active
                    </span>
                  </div>
                  <CardDescription>Proposal #30 • Ends in 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    This proposal suggests implementing a token-based reputation system where users earn tokens for
                    quality contributions, which can be used for governance voting and accessing premium features.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Yes</span>
                      <span>63%</span>
                    </div>
                    <Progress value={63} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>No</span>
                      <span>37%</span>
                    </div>
                    <Progress value={37} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">1,018 votes cast • 62% participation</div>
                  <Button variant="outline" size="sm">
                    Cast Vote
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="mt-6">
              <Link href="/governance/proposals" className="flex items-center text-primary hover:underline">
                View all proposals
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
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
