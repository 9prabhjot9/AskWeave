import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ArweaveProvider from '@/lib/arweave/ArweaveProvider'

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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ArweaveProvider>
            {children}
            <Toaster />
          </ArweaveProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
