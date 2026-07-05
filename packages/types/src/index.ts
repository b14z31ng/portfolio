/**
 * Shared TypeScript types for the portfolio application.
 * Used by both frontend and referenced in API schemas.
 */

// ──────────────────────────────────────
// Profile
// ──────────────────────────────────────
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  email: string;
  location: string | null;
  website: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────
// Project
// ──────────────────────────────────────
export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  banner_url: string | null;
  github_url: string | null;
  live_url: string | null;
  readme: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  technologies: Technology[];
  screenshots: string[];
  architecture: string | null;
  features: string[];
  challenges: string | null;
  solutions: string | null;
  lessons_learned: string | null;
  stars: number;
  forks: number;
  language: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────
// Technology
// ──────────────────────────────────────
export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: TechnologyCategory;
  icon_url: string | null;
  color: string | null;
}

export type TechnologyCategory =
  | "language"
  | "framework"
  | "library"
  | "database"
  | "tool"
  | "platform"
  | "other";

// ──────────────────────────────────────
// Blog
// ──────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover_url: string | null;
  category: string | null;
  tags: string[];
  reading_time: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────
// Experience
// ──────────────────────────────────────
export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  technologies: string[];
  achievements: string[];
  company_url: string | null;
  company_logo: string | null;
  sort_order: number;
}

// ──────────────────────────────────────
// Education
// ──────────────────────────────────────
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  gpa: string | null;
  achievements: string[];
  institution_logo: string | null;
  sort_order: number;
}

// ──────────────────────────────────────
// Certificate
// ──────────────────────────────────────
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  credential_id: string | null;
  image_url: string | null;
  sort_order: number;
}

// ──────────────────────────────────────
// Research
// ──────────────────────────────────────
export interface Research {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────
// Repository (GitHub)
// ──────────────────────────────────────
export interface Repository {
  id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  is_selected: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────
// API Responses
// ──────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  detail: string;
  status_code: number;
}

// ──────────────────────────────────────
// Auth
// ──────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ──────────────────────────────────────
// Settings
// ──────────────────────────────────────
export interface PortfolioSettings {
  site_title: string;
  site_description: string;
  theme: "light" | "dark" | "abyss";
  primary_color: string;
  github_connected: boolean;
  analytics_enabled: boolean;
}
