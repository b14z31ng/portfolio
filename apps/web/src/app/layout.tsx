import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Developer Portfolio",
    template: "%s | Developer Portfolio",
  },
  description:
    "Production-grade developer portfolio showcasing projects, research, and engineering excellence.",
  keywords: [
    "developer",
    "portfolio",
    "software engineer",
    "full-stack",
    "projects",
    "blog",
  ],
  authors: [{ name: "Developer" }],
  creator: "Developer",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Developer Portfolio",
    title: "Developer Portfolio",
    description:
      "Production-grade developer portfolio showcasing projects, research, and engineering excellence.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Portfolio",
    description:
      "Production-grade developer portfolio showcasing projects, research, and engineering excellence.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} abyss`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
