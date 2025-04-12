import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ArweaveProvider from '@/lib/arweave/ArweaveProvider'
import { DebugPanel } from '@/components/debug-panel'
import { Shell } from '@/components/shell'

// Initialize the Inter font with minimal configuration
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AskWeave - Decentralized Q&A Platform',
  description: 'A decentralized Q&A platform built on Arweave blockchain',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add a base tag to ensure static assets are loaded correctly */}
        <base href="/" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ArweaveProvider>
            <Shell>
              {children}
            </Shell>
            <Toaster />
            <DebugPanel />
          </ArweaveProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
