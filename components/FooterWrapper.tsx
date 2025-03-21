"use client";
import { Github, Twitter, Instagram, Linkedin, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/ui/footer";

function FooterWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      className={`px-4 py-12 ${
        isHomePage
          ? "bg-gradient-to-l from-accent/90 via-accent/30 to-accent/10"
          : "bg-gradient-to-tl from-primary/80 via-primary/30 to-primary/10"
      }`}
    >
      <div className="container w-full mx-auto">
        <Footer
          logo={<Shield className="size-10 animate-pulse text-teal-800" />}
          brandName="ReceiptIQ Agent"
          socialLinks={[
            {
              icon: <Twitter className="size-5 text-white bg-transparent" />,
              href: "https://x.com/CharitySmith24",
              label: "Twitter",
            },
            {
              icon: <Instagram className="size-5 text-white bg-transparent" />,
              href: "https://www.instagram.com/charity.smith24/",
              label: "GitHub",
            },
            {
              icon: <Linkedin className="size-5 text-white bg-transparent" />,
              href: "https://www.linkedin.com/in/charitysmith40175/",
              label: "LinkedIn",
            },
            {
              icon: <Github className="size-5 text-white bg-transparent" />,
              href: "https://github.com/charitysmith24",
              label: "GitHub",
            },
          ]}
          mainLinks={[
            { href: "/newsletter", label: "Newsletter" },
            { href: "/contact", label: "Contact" },
          ]}
          legalLinks={[
            { href: "/privacy", label: "Privacy" },
            { href: "/tos", label: "Terms" },
          ]}
          copyright={{
            text: "© 2025 ReceiptIQ Agent - Techvaultlabs",
            license: "All rights reserved",
          }}
        />
      </div>
    </div>
  );
}

export { FooterWrapper };
