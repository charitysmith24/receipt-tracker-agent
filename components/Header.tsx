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
      className={`sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center ${
        isHomePage
          ? "bg-gradient-to-l from-rose-50 to-rose-800"
          : "bg-background border-b border-rose-900"
      }`}
    >
      <Link href="/" className="flex items-center">
        <Shield className="size-6 text-rose-50 mr-2 animate-pulse" />
        <h1 className="text-base md:text-xl font-semibold text-white">
          Receipt Tracker
        </h1>
      </Link>
      <div className="flex flex-row items-center space-x-4">
        <SignedIn>
          <Link href="/receipts">
            <Button variant="outline">Receipts</Button>
          </Link>
          <Link href="/manage-plan">
            <Button
              variant="default"
              className="bg-transparent text-rose-700 border border-rose-700"
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
  );
}

export default Header;
