/**
 * Shared configuration constants.
 */

export const SITE_CONFIG = {
  name: "Developer Portfolio",
  description: "Production-grade developer portfolio",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
} as const;

export const NAVIGATION = {
  public: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "Education", href: "/education" },
    { label: "Research", href: "/research" },
    { label: "Blog", href: "/blog" },
    { label: "Certificates", href: "/certificates" },
    { label: "Contact", href: "/contact" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "GitHub", href: "/admin/github" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Blog", href: "/admin/blog" },
    { label: "Research", href: "/admin/research" },
    { label: "Experience", href: "/admin/experience" },
    { label: "Education", href: "/admin/education" },
    { label: "Certificates", href: "/admin/certificates" },
    { label: "Media", href: "/admin/media" },
    { label: "Settings", href: "/admin/settings" },
  ],
} as const;

export const THEMES = ["light", "dark", "abyss"] as const;
export type Theme = (typeof THEMES)[number];

export const PAGINATION = {
  defaultPage: 1,
  defaultPerPage: 12,
  maxPerPage: 50,
} as const;
