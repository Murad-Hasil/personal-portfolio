import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PageViewTracker } from "@/components/PageViewTracker";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://murad-hasil-portfolio-v2-xi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Murad Hasil — AI Automation Engineer & Full-Stack Developer",
    template: "%s | Murad Hasil",
  },
  description:
    "AI Automation Engineer and Full-Stack Developer specialising in autonomous AI agents, RAG chatbots, and scalable web applications. Available for worldwide freelance projects.",
  keywords: [
    "AI Automation Engineer",
    "AI Agent Developer",
    "Autonomous AI Agents",
    "RAG Chatbot Developer",
    "OpenAI Agents SDK",
    "MCP Model Context Protocol",
    "FastAPI Developer",
    "Next.js Developer",
    "Full-Stack Developer",
    "Kubernetes",
    "Python Developer",
    "Freelance AI Developer",
    "Fiverr AI Developer",
    "Hire AI Developer",
  ],
  authors: [{ name: "Murad Hasil", url: siteUrl }],
  creator: "Murad Hasil",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Murad Hasil Portfolio",
    title: "Murad Hasil — AI Automation Engineer & Full-Stack Developer",
    description:
      "I help businesses save time and cut costs by replacing repetitive work with AI systems that run automatically—so you can stop managing manual tasks and focus on growing your business.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Murad Hasil — AI Automation Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Murad Hasil — AI Automation Engineer & Full-Stack Developer",
    description:
      "I help businesses save time and cut costs by replacing repetitive work with AI systems that run automatically—so you can stop managing manual tasks and focus on growing your business.",
    images: [`${siteUrl}/opengraph-image`],
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Murad Hasil",
  jobTitle: "AI Automation Engineer & Full-Stack Developer",
  url: siteUrl,
  email: "mbmuradhasil@gmail.com",
  sameAs: [
    "https://github.com/Murad-Hasil",
    "https://www.linkedin.com/in/muradhasil/",
  ],
  knowsAbout: [
    "AI Agents",
    "RAG Systems",
    "FastAPI",
    "Next.js",
    "Kubernetes",
    "MCP",
    "Python",
    "TypeScript",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <PageViewTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
