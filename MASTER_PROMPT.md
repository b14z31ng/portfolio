# MASTER_PROMPT.md

# Developer Portfolio CMS
### Production-Grade Personal Developer Portfolio

Version 1.0

---

# YOUR ROLE

You are an elite software engineer and product designer responsible for building a world-class personal developer portfolio.

This project represents **one developer**.

It is **not** a portfolio builder.

It is **not** a multi-user SaaS.

It is a premium portfolio with a private CMS that allows the owner to manage projects, synchronize GitHub repositories, and publish technical content.

The final result should feel closer to a premium software product than a traditional portfolio website.

---

# PROJECT GOAL

Create a portfolio that immediately communicates:

- Professionalism
- Engineering excellence
- Clean architecture
- Attention to detail
- Strong UI/UX
- Modern frontend skills
- Backend engineering capability

The portfolio itself should become one of the strongest projects showcased.

---

# TARGET AUDIENCE

Primary

- Recruiters
- Hiring Managers
- Engineering Managers
- Startup Founders
- Technical Leads
- Clients

Secondary

- Developers
- Researchers
- Students
- Open Source Contributors

Design every page for recruiters first.

---

# PRODUCT OVERVIEW

The application consists of two parts.

## Public Portfolio

Anyone can visit.

Visitors can

- View projects
- Read blog posts
- Explore research
- View experience
- Download resume
- Contact the owner

No authentication required.

---

## Private CMS

Only the owner has access.

The dashboard manages

- GitHub repositories
- Projects
- Blog
- Research
- Experience
- Education
- Certificates
- Media
- Theme
- Portfolio settings

---

# CORE FEATURES

## Public Website

- Home
- About
- Projects
- Project Details
- Experience
- Education
- Research
- Blog
- Certificates
- Resume
- Contact

---

## Private Dashboard

- Authentication
- GitHub Integration
- Repository Sync
- Project Manager
- Blog CMS
- Research CMS
- Media Library
- Analytics
- Theme Settings
- Portfolio Settings

---

# USER FLOWS

Portfolio Owner

Admin Login

↓

Dashboard

↓

Connect GitHub

↓

Synchronize

↓

Select Repositories

↓

Generate Projects

↓

Edit

↓

Publish

Visitors

Landing Page

↓

Featured Projects

↓

About

↓

Project Details

↓

Resume

↓

Contact

---

# DESIGN PHILOSOPHY

The portfolio should feel inspired by

Apple

Vercel

Linear

GitHub

Framer

Raycast

Characteristics

- Clean
- Minimal
- Elegant
- Interactive
- Premium
- Responsive
- Accessible

Avoid unnecessary visual noise.

Motion should improve usability rather than distract.

Whitespace is part of the design.

---

# THEME SYSTEM

Support three themes.

## Light

Professional

Clean

Bright

Soft shadows

---

## Dark

Professional

Muted

High contrast

Glass surfaces

---

## Abyss (Default)

Deep blue-black background

Glass cards

Electric blue highlights

Soft cyan glow

Gradient accents

Ambient lighting

Abyss should become the visual identity of the portfolio.

---

# TECHNOLOGY STACK

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- React Hook Form
- Zod
- Lucide Icons
- next-themes

Backend

- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Redis
- JWT Authentication

Infrastructure

- Docker
- Render
- GitHub Actions
- Cloudinary

---

# PROJECT STRUCTURE

Use a monorepo.

apps/
    web/
    api/

packages/
    ui/
    utils/
    config/
    types/

docs/

infrastructure/

---

# CODING PRINCIPLES

Write production-quality code.

Requirements

- Strict TypeScript
- No any
- Reusable components
- Reusable hooks
- Clean Architecture
- SOLID Principles
- Typed APIs
- Modular folders

Never duplicate business logic.

---

# GITHUB INTEGRATION

GitHub is used only by the owner.

Visitors never authenticate with GitHub.

Workflow

Connect GitHub

↓

Fetch Repositories

↓

Choose Visible Projects

↓

Synchronize

↓

Generate Portfolio Pages

---

# PROJECT GENERATION

Each repository should become a professional project page.

Automatically collect

- Repository metadata
- README
- Technologies
- Screenshots
- Languages
- Stars
- Last update

Generate

- Summary
- Tech Stack
- Architecture Overview
- Skills Demonstrated

Owner can edit every generated field.

---

# HOMEPAGE

Order

Hero

↓

Featured Projects

↓

About

↓

Skills

↓

Experience

↓

Education

↓

Research

↓

Certificates

↓

Contact

↓

Footer

---

# HERO

Contains

Professional headline

Short introduction

Profile image placeholder

GitHub

LinkedIn

Resume

Call-to-action buttons

Animated background

Scroll indicator

---

# PROJECTS

The project section is the centerpiece.

Display featured projects first.

Support

- Search
- Filters
- Categories
- Technology tags

Every project card includes

- Banner
- Title
- Summary
- Technologies
- GitHub
- Live Demo
- Details

---

# PROJECT PAGE

Each project should contain

Hero Banner

↓

Overview

↓

Screenshots

↓

Architecture

↓

Features

↓

Technology Stack

↓

Challenges

↓

Solutions

↓

Lessons Learned

↓

README

↓

GitHub

↓

Live Demo

The page should feel like a software case study.

---

# BLOG

Markdown support

Syntax highlighting

Reading time

Categories

Search

Drafts

SEO

---

# EXPERIENCE

Interactive timeline

Company

Role

Description

Technologies

Achievements

---

# EDUCATION

Timeline

Institution

Degree

Duration

Achievements

Projects

---

# CERTIFICATES

Grid layout

Preview

Credential link

Issue date

Issuer

---

# CONTACT

Simple professional form

Name

Email

Subject

Message

Validation

Loading

Success state

---

# COMPONENTS

Create reusable components.

Examples

Navbar

Footer

Hero

GlassCard

ProjectCard

Timeline

TechnologyBadge

Search

ThemeToggle

MarkdownViewer

Gallery

Skeleton

EmptyState

Toast

Modal

Drawer

Every component must support

Loading

Hover

Focus

Responsive behavior

Accessibility

---

# ANIMATIONS

Use Framer Motion.

Animations

Fade

Slide

Scale

Hover Lift

Spotlight

Page Transition

Counter

Parallax

Support reduced motion.

---

# RESPONSIVE DESIGN

Support

Desktop

Laptop

Tablet

Mobile

No horizontal scrolling.

---

# PERFORMANCE

Target

Performance ≥95

Accessibility ≥95

SEO =100

Best Practices =100

Optimize

Images

Fonts

Bundles

Queries

Animations

---

# ACCESSIBILITY

WCAG AA

Keyboard navigation

ARIA labels

Visible focus

Semantic HTML

Reduced motion

---

# SEO

Meta titles

Descriptions

Open Graph

Twitter Cards

Structured Data

Sitemap

Robots.txt

---

# DEPLOYMENT

Deploy to Render.

Use

Docker

render.yaml

GitHub Actions

Environment variables

Health checks

Background workers

No code changes should be required after deployment.

---

# CLAUDE IMPLEMENTATION RULES

Build incrementally.

For every feature

1. Explain architecture.
2. Generate folder structure.
3. Implement backend.
4. Implement frontend.
5. Connect both.
6. Add validation.
7. Add loading states.
8. Add accessibility.
9. Document.
10. Wait for approval.

Never generate the entire application at once.

Prefer maintainability over cleverness.

Always keep the code production-ready.

END OF MASTER_PROMPT.md