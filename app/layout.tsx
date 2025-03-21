import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import { FooterWrapper } from "@/components/FooterWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReceiptsTracker",
  description: "AI-powered Receipt Tracking and Expense Management",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            dynamic
            appearance={{
              baseTheme: dark,
              signIn: { baseTheme: dark },
              variables: {
                colorPrimary: "#00b8db", // Your brand's primary color
                borderRadius: "8px", // Border radius for rounded corners
              },
              elements: {
                card: {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Custom shadow for cards
                },
                headerTitle: {
                  fontFamily: "Arial, sans-serif", // Custom font for headers
                },
              },
            }}
          >
            <ConvexClientProvider>
              <Header />
              <main>{children}</main>
              <Toaster />
              {/* Footer Section*/}
              <FooterWrapper />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
