"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AskRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/questions/ask")
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to ask question page...</p>
    </div>
  )
}
