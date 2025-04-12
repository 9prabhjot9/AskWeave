'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [navigationType, setNavigationType] = useState<string>('');
  const [windowLocation, setWindowLocation] = useState<string>('');

  useEffect(() => {
    console.error('Application error:', error);
    // Capture navigation information
    if (typeof window !== 'undefined') {
      setNavigationType(window.performance?.navigation?.type?.toString() || 'Not available');
      setWindowLocation(window.location.href);
    }
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        The application encountered an error while loading this page.
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => reset()}
        >
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
        <Button 
          variant="ghost"
          onClick={() => setDetailsVisible(!detailsVisible)}
        >
          {detailsVisible ? 'Hide' : 'Show'} details
        </Button>
      </div>

      {detailsVisible && (
        <div className="mt-4 p-4 bg-muted rounded-md text-left w-full max-w-2xl overflow-auto">
          <h3 className="font-medium mb-2">Error Details:</h3>
          <p className="font-mono text-sm mb-2">Message: {error.message}</p>
          <p className="font-mono text-sm mb-2">Name: {error.name}</p>
          {error.stack && (
            <div className="mb-2">
              <p className="font-medium">Stack Trace:</p>
              <pre className="text-xs mt-1 p-2 bg-background rounded overflow-auto">
                {error.stack}
              </pre>
            </div>
          )}
          <div className="mt-4">
            <p className="font-medium">Navigation Info:</p>
            <p className="text-xs mt-1">URL: {windowLocation}</p>
            <p className="text-xs">Navigation Type: {navigationType}</p>
          </div>
        </div>
      )}
    </div>
  )
} 