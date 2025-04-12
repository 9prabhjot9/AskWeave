"use client";

import Link from "next/link";
import { MainNav } from "./main-nav";
import { ModeToggle } from "./mode-toggle";
import { ConnectWalletButton } from "./connect-wallet-button";
import { AskWeaveIcon } from "./askweave-icon";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <AskWeaveIcon className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">
                AskWeave
              </span>
            </Link>
            <MainNav />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background md:w-[200px] lg:w-[300px]"
                />
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <ConnectWalletButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built on{" "}
            <a
              href="https://arweave.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Arweave
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/yourusername/decentralized-qa"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
} 