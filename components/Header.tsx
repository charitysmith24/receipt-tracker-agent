"use client";
import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`sticky top-0 z-10 p-4 flex flex-row justify-between items-center border-b-1 border-primary/70 dark:border-primary/60 ${
        isHomePage
          ? "bg-gradient-to-l from-accent/95 via-accent/30 to-accent/10"
          : "bg-gradient-to-tl from-primary/80 via-primary/30 to-primary/10"
      }`}
    >
      <div className="container mx-auto px-6 flex flex-row justify-between items-center">
        <Link href="/" className="flex items-center">
          <Shield className="size-6 text-teal-800 mr-2 animate-pulse" />
          {isHomePage ? (
            <h1
              className={`text-base md:text-xl font-semibold bg-linear-to-tl from-primary/95 to-teal-700 bg-clip-text text-transparent dark:from-teal-600/95 dark:to-teal-200`}
            >
              Receipt Tracker
            </h1>
          ) : (
            <h1 className="text-base md:text-xl font-semibold text-white">
              Receipt Tracker
            </h1>
          )}
        </Link>
        <div className="flex flex-row items-center space-x-4">
          <SignedIn>
            <Link href="/receipts">
              <Button
                variant="outline"
                className="bg-transparent text-white border border-teal-700 shadow-sm shadow-white/60 hover:border-2 hover:text-white hover:shadow-lg hover:shadow-teal-300/50"
              >
                Receipts
              </Button>
            </Link>
            <Link href="/manage-plan">
              <Button
                variant="default"
                className="bg-transparent text-white border border-teal-700 shadow-sm shadow-white/60 hover:border-2 hover:shadow-lg hover:shadow-teal-300/50"
              >
                Manage Plan
              </Button>
            </Link>
            <ThemeToggle />
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button>Login</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

export default Header;
