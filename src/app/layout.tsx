import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { wins, directives } from "@/lib/prototype-data";

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

const SITE_URL = "https://infoshubhjain.github.io";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Shubh Jain — AI Systems Engineer, built at the limit",
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
    title: "Shubh Jain — AI Systems Engineer, built at the limit",
    description:
      "Computer Science @ UIUC. Building ambitious AI systems, conducting research, and shipping real products.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shubh Jain, #16 — AI Systems Engineer, built at the limit. CS @ UIUC, 3.83 CGPA, 2 papers, 2 books, 1 patent.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubh Jain — AI Systems Engineer, built at the limit",
    description:
      "Computer Science @ UIUC. Building ambitious AI systems, conducting research, and shipping real products.",
    images: ["/og-image.png"],
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

// Per-project structured data as SoftwareApplication.
const projectJsonLd = wins.map((w) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: w.name,
  description: w.circuit,
  author: { "@type": "Person", name: "Shubh Jain" },
  url: SITE_URL,
  applicationCategory: w.role,
  programmingLanguage: w.tech.join(", "),
  datePublished: w.year,
  ...(w.links.find((l) => l.kind === "demo") && {
    installUrl: w.links.find((l) => l.kind === "demo")!.href,
  }),
  ...(w.links.find((l) => l.kind === "github") && {
    codeRepository: w.links.find((l) => l.kind === "github")!.href,
  }),
}));

// Research papers as ScholarlyArticle.
const researchJsonLd = directives
  .filter((d) => d.kind === "Paper")
  .map((d) => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    name: d.title,
    description: d.note,
    author: { "@type": "Person", name: "Shubh Jain" },
    publisher: { "@type": "Organization", name: d.venue },
    datePublished: d.year,
  }));

// Books as Book.
const booksJsonLd = directives
  .filter((d) => d.kind === "Book")
  .map((d) => ({
    "@context": "https://schema.org",
    "@type": "Book",
    name: d.title,
    description: d.note,
    author: { "@type": "Person", name: "Shubh Jain" },
    isbn: d.venue.replace("ISBN ", ""),
    datePublished: d.year,
  }));

const allJsonLd = [personJsonLd, ...projectJsonLd, ...researchJsonLd, ...booksJsonLd];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(allJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
