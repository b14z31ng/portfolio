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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/v1/profile/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    const profile = await res.json();

    const title = profile.seo_title || `${profile.full_name} — Portfolio` || "Developer Portfolio";
    const description = profile.seo_description || profile.headline || "Production-grade developer portfolio.";

    return {
      title: {
        default: title,
        template: `%s | ${profile.full_name || "Developer Portfolio"}`,
      },
      description,
      keywords: [
        "developer",
        "portfolio",
        "software engineer",
        "full-stack",
        "projects",
        "blog",
      ],
      authors: [{ name: profile.full_name || "Developer" }],
      creator: profile.full_name || "Developer",
      openGraph: {
        type: "website",
        locale: "en_US",
        siteName: profile.full_name || "Developer Portfolio",
        title,
        description,
        images: profile.og_image_url ? [{ url: profile.og_image_url }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: profile.og_image_url ? [profile.og_image_url] : [],
      },
      icons: {
        icon: profile.favicon_url || "/favicon.ico",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    return {
      title: {
        default: "Developer Portfolio",
        template: "%s | Developer Portfolio",
      },
      description:
        "Production-grade developer portfolio showcasing projects, research, and engineering excellence.",
      icons: {
        icon: "/favicon.ico",
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

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
