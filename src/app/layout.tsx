import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/site/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://shubhjain.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shubh Jain — AI Systems · Research · Engineering · Leadership",
    template: "%s · Shubh Jain",
  },
  description:
    "Computer Science student at UIUC building ambitious AI systems, conducting research, shipping real projects, and leading at scale. Multi-agent learning platforms, transformers, NLP, full-stack engineering, and 2 published books.",
  keywords: [
    "Shubh Jain",
    "UIUC Computer Science",
    "AI Engineer",
    "Machine Learning",
    "Multi-Agent Systems",
    "Bayesian Knowledge Tracing",
    "NLP Research",
    "DistilBERT",
    "Next.js",
    "Full Stack Engineer",
    "Researcher",
    "Explainable AI",
  ],
  authors: [{ name: "Shubh Jain", url: SITE_URL }],
  creator: "Shubh Jain",
  publisher: "Shubh Jain",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Shubh Jain",
    title: "Shubh Jain — AI Systems · Research · Engineering · Leadership",
    description:
      "Computer Science @ UIUC. Building ambitious AI systems, conducting research, and shipping real products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubh Jain — AI Systems · Research · Engineering",
    description:
      "Computer Science @ UIUC. Building ambitious AI systems, conducting research, and shipping real products.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shubh Jain",
  email: "mailto:shubhj3@illinois.edu",
  url: SITE_URL,
  jobTitle: "Computer Science Student & AI Engineer",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "University of Illinois Urbana-Champaign",
  },
  sameAs: [
    "https://github.com/infoshubhjain",
    "https://www.linkedin.com/in/infoshubhjain/",
    "https://aiceuiuc.vercel.app/",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "Bayesian Knowledge Tracing",
    "Multi-Agent Systems",
    "Transformers",
    "Explainable AI",
    "Next.js",
    "FastAPI",
    "Rust",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
