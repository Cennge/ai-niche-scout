import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";

import { PageTransitions } from "@/components/page-transitions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Niche Scout: is your AI startup idea already taken?",
    template: "%s | AI Niche Scout",
  },
  description:
    "Describe an AI product idea and see who already builds it. Explore 54 AI niches and 33,000+ AI startups, powered by the FreeSerp sites index.",
  openGraph: {
    type: "website",
    siteName: "AI Niche Scout",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101814" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:ring-3 focus:ring-ring"
            >
              Skip to content
            </a>
            <SiteHeader />
            <main id="content" className="flex flex-1 flex-col">
              <PageTransitions>{children}</PageTransitions>
            </main>
            <SiteFooter />
            <Toaster position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
