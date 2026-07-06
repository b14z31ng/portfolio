# PORTFOLIO REFINEMENT TASK

IMPORTANT

This project is already fully implemented and running correctly.

This is NOT a request to regenerate the project.

This is NOT a request to redesign everything.

This is NOT a request to change the project architecture.

Your responsibility is to improve and extend the existing production-ready application while preserving its architecture, coding style, UI consistency and existing functionality.

Always inspect existing components before modifying them.

Reuse components whenever possible.

Never duplicate logic.

Never replace working code unnecessarily.

Maintain full compatibility with

• Next.js
• FastAPI
• PostgreSQL
• Docker
• Render
• Existing Database
• Existing APIs
• Existing Authentication
• Existing GitHub Sync

The application must remain production-ready after every change.

------------------------------------------------------------
PRIMARY OBJECTIVE
------------------------------------------------------------

Transform the portfolio from a generic developer template into a premium personal developer portfolio representing ME.

The portfolio should immediately communicate

Professionalism

Backend Engineering

Artificial Intelligence

Modern Software Development

Clean Architecture

Problem Solving

Scalable Systems

Every remaining placeholder should be removed.

Every hardcoded profile value should become editable through the Admin Dashboard.

The portfolio should feel handcrafted rather than template generated.

------------------------------------------------------------
CURRENT ISSUES TO FIX
------------------------------------------------------------

Current Hero

"Building digital experiences that matter."

"Full-stack software engineer specializing in scalable web applications..."

This is generic.

Replace it.

------------------------------------------------------------
PROFILE INFORMATION
------------------------------------------------------------

Use these values as the initial profile.

Name

Reshad Romim

GitHub

https://github.com/b14z31ng

LinkedIn

https://www.linkedin.com/in/reshadromimkhan/

These values should be inserted into the database as default profile values.

DO NOT hardcode them inside React components.

The frontend must always fetch profile information dynamically.

------------------------------------------------------------
HERO SECTION
------------------------------------------------------------

Completely rewrite the Hero.

Do not use generic marketing phrases.

Avoid

"Building digital experiences."

"Creating amazing experiences."

"Innovative developer."

"Passionate engineer."

Instead write something that reflects

Backend Engineering

AI

Machine Learning

Modern Web Development

FastAPI

Next.js

Python

System Design

Software Architecture

Production Software

The Hero must contain

Greeting

Large Name

Professional Title

Professional Summary

Primary CTA

Secondary CTA

GitHub

LinkedIn

Resume

Scroll Indicator

Profile Image

Animated Background

The writing should feel modern, confident and authentic.

------------------------------------------------------------
ABOUT SECTION
------------------------------------------------------------

Rewrite the About section.

Describe me as

Computer Science student

Backend Engineer

AI Developer

Full Stack Developer

Focus on

building production-ready software

backend systems

machine learning

problem solving

clean architecture

continuous learning

Do not exaggerate.

Do not invent experience.

Keep it professional.

------------------------------------------------------------
PROFILE MANAGEMENT
------------------------------------------------------------

Currently profile information is incomplete.

Create a dedicated

Dashboard

↓

Profile

The Profile page should manage

Full Name

Professional Headline

Hero Description

About Description

Profile Image

Email

Phone

Location

Website

GitHub

LinkedIn

Availability

Resume

SEO Title

SEO Description

OpenGraph Image

Every field must be editable.

Nothing should remain hardcoded.

------------------------------------------------------------
SOCIAL LINKS
------------------------------------------------------------

The GitHub button currently links to

https://github.com

This is incorrect.

Replace it with

https://github.com/b14z31ng

The LinkedIn button currently links to

https://linkedin.com

Replace it with

https://www.linkedin.com/in/reshadromimkhan/

These values must come from the Profile table.

If any link is empty

Hide the button.

Never show placeholder links.

------------------------------------------------------------
HERO BUTTONS
------------------------------------------------------------

Primary Button

View Projects

Secondary Button

Download Resume

Social Buttons

GitHub

LinkedIn

Resume button should automatically use the uploaded resume.

Never hardcode URLs.

------------------------------------------------------------
PROFILE IMAGE
------------------------------------------------------------

The profile image should be managed by CMS.

Allow

Upload

Replace

Delete

Preview

The Hero should always display the uploaded profile image.

Fallback

Use placeholder avatar.

------------------------------------------------------------
HOMEPAGE ORDER
------------------------------------------------------------

Improve information hierarchy.

Homepage should become

Hero

↓

Featured Projects

↓

About Me

↓

Technology Stack

↓

Experience

↓

Education

↓

Research

↓

Publications

↓

Certificates

↓

Contact

↓

Footer

This order is optimized for recruiters.

------------------------------------------------------------
FEATURED PROJECTS
------------------------------------------------------------

Do not display every project equally.

Allow admin to choose

Featured Projects.

Homepage should display only featured projects.

The remaining projects stay inside the Projects page.

Every featured project should have

Large Card

Image

Summary

Technologies

GitHub

Live Demo

View Details

------------------------------------------------------------
GENERAL REQUIREMENTS
------------------------------------------------------------

Maintain

Responsive Design

Accessibility

SEO

Animations

Glass Design

Dark Theme

Light Theme

Abyss Theme

Do not redesign existing components.

Improve them.

Follow existing architecture.

Preserve existing APIs.

Preserve existing routing.

Preserve existing database relationships.

Never break working functionality.

------------------------------------------------------------
RESUME MANAGEMENT
------------------------------------------------------------

There is currently NO way to upload or manage my resume.

This is a major missing feature.

Implement complete Resume Management.

The Resume must become a first-class entity inside the CMS.

Create

Dashboard

↓

Profile

↓

Resume

The Resume page should support

• Upload Resume (PDF only)

• Replace Resume

• Delete Resume

• Preview Resume

• Download Resume

• Display upload date

• Display file size

• Display current active resume

Only one active resume should exist.

Uploading a new resume automatically replaces the previous one.

Store the file using the existing storage implementation.

Use Cloudinary if already configured.

Otherwise use the existing media storage system.

Never hardcode resume URLs.

------------------------------------------------------------
DOWNLOAD RESUME
------------------------------------------------------------

Homepage Hero

Navbar

Footer

Project Pages

About Page

Every Download Resume button must automatically use the uploaded resume.

Never use static files.

Never use hardcoded links.

If no resume exists

Hide the Download Resume button

or

Show a disabled button with

"Resume Coming Soon"

------------------------------------------------------------
PROFILE COMPLETENESS
------------------------------------------------------------

Inside Dashboard

Create

Profile Completion

Example

✓ Profile Photo

✓ Hero Title

✓ About

✓ Resume Uploaded

✓ GitHub

✓ LinkedIn

✓ Contact Information

✓ Featured Projects

✓ Certificates

✓ Publications

Display completion percentage.

Example

92% Complete

This helps ensure no placeholder content remains.

------------------------------------------------------------
PUBLICATIONS MODULE
------------------------------------------------------------

The portfolio currently has no Publications section.

Implement an entirely new module.

This should behave similarly to Research but represent published work.

Navigation

Home

Projects

Experience

Research

Publications

Certificates

Contact

Resume

------------------------------------------------------------
HOMEPAGE
------------------------------------------------------------

Add

Publications

between

Research

and

Certificates

------------------------------------------------------------
PUBLICATIONS PAGE
------------------------------------------------------------

Create

/publications

Each publication should support

Title

Subtitle

Authors

Conference

Journal

Publisher

Year

Publication Date

Status

DOI

Citation

BibTeX

Abstract

Keywords

PDF

Presentation

GitHub Repository

Images

Featured

Categories

Tags

Visibility

Published

Accepted

Under Review

Draft

The page should follow the same premium design language used throughout the portfolio.

------------------------------------------------------------
PUBLICATION CARD
------------------------------------------------------------

Each publication card should display

Publication Cover

Title

Authors

Conference

Year

Status Badge

Short Summary

View Details

PDF

DOI

GitHub

Publication cards should use

Glass Cards

Hover Animations

Gradient Borders

Consistent Shadows

Responsive Grid

------------------------------------------------------------
PUBLICATION DETAILS PAGE
------------------------------------------------------------

Each publication should have its own page.

Include

Hero

Abstract

Authors

Publication Information

Conference

Journal

Citation

BibTeX

Keywords

Gallery

Downloads

GitHub

Related Projects

Related Research

------------------------------------------------------------
PUBLICATION ADMIN
------------------------------------------------------------

Create

Dashboard

↓

Publications

Implement complete CRUD

Create

Update

Delete

Publish

Unpublish

Feature

Archive

Preview

Duplicate

Search

Filtering

Sorting

Status Management

Everything should follow existing CMS architecture.

------------------------------------------------------------
DATABASE
------------------------------------------------------------

Create

Publication

Model

Migration

Repository

Service

Schemas

API

Relationships

Use existing coding standards.

------------------------------------------------------------
CERTIFICATES
------------------------------------------------------------

Certificates currently exist.

Improve them.

Each certificate should support

Title

Issuer

Description

Issue Date

Expiration Date

Credential URL

Certificate Image

Skills

Category

Featured

Visibility

Download

Preview

Credential ID

Homepage should display Featured Certificates only.

Certificates page should display all.

------------------------------------------------------------
CERTIFICATE PAGE
------------------------------------------------------------

Improve layout.

Each certificate should include

Large Preview

Issuer Information

Description

Skills

Issue Date

Credential Verification

Download

External Credential Link

Related Technologies

------------------------------------------------------------
NAVIGATION
------------------------------------------------------------

Update navigation.

Desktop

Home

Projects

Experience

Research

Publications

Certificates

Contact

Resume

Dashboard (Authenticated Only)

Mobile Navigation

Must contain identical items.

------------------------------------------------------------
FOOTER
------------------------------------------------------------

Improve Footer.

Include

Profile

GitHub

LinkedIn

Email

Quick Links

Resume

Copyright

Current Year

Social Icons

Footer should dynamically load profile information.

------------------------------------------------------------
CONTACT
------------------------------------------------------------

Improve Contact section.

Include

Professional Email

LinkedIn

GitHub

Contact Form

Location

Availability Status

Response Time

Everything should come from Profile Settings.

------------------------------------------------------------
MEDIA LIBRARY
------------------------------------------------------------

Expand Media Library.

Support

Images

Certificates

Publication PDFs

Resume

Profile Photo

Project Screenshots

Research Files

Preview

Replace

Delete

Search

Filtering

Everything should reuse the existing Media implementation.

------------------------------------------------------------
GENERAL RULES
------------------------------------------------------------

Never hardcode

Resume

GitHub

LinkedIn

Profile

Certificates

Publications

Everything should come from CMS.

Maintain

Responsive Design

Accessibility

SEO

Animations

Dark Theme

Light Theme

Abyss Theme

Glass Design

Production Quality

Do not introduce duplicate components.

Reuse existing architecture whenever possible.

Every new page must follow the same design language as the existing portfolio.

------------------------------------------------------------
ADMIN DASHBOARD IMPROVEMENTS
------------------------------------------------------------

The current Admin Dashboard is functional but incomplete.

Improve it without changing the existing architecture.

The dashboard should become the single place where every piece of portfolio content is managed.

Updated Dashboard Navigation

Dashboard

Profile

Projects

GitHub

Experience

Education

Research

Publications

Certificates

Blog

Media

Analytics

Theme

Settings

System

Only authenticated administrators should have access.

------------------------------------------------------------
PROFILE SETTINGS
------------------------------------------------------------

The Profile page should become the central configuration page for the portfolio.

Support editing

Full Name

Professional Headline

Hero Title

Hero Subtitle

Hero Description

About Description

Location

Email

Phone

GitHub

LinkedIn

Website

Availability Status

Resume

Profile Photo

SEO Title

SEO Description

Open Graph Image

Favicon

Everything displayed publicly must originate from this page.

------------------------------------------------------------
SETTINGS PAGE
------------------------------------------------------------

Expand Settings.

General

Portfolio Name

Site URL

Default Theme

Timezone

Language

SEO

Meta Title

Meta Description

Keywords

Canonical URL

Google Verification

Open Graph

Analytics

Google Analytics

Plausible

Microsoft Clarity

GitHub

GitHub Token

Sync Interval

Default Branch

Auto Sync

Theme

Primary Color

Accent Color

Default Theme

Glass Intensity

Animation Speed

Enable Motion

------------------------------------------------------------
GITHUB SYNCHRONIZATION
------------------------------------------------------------

Improve the GitHub integration.

Dashboard

↓

GitHub

Show

Connection Status

GitHub Username

Profile Avatar

Repository Count

Last Synchronization

Sync Duration

Rate Limit

Allow

Manual Sync

Auto Sync

Force Sync

Select Repositories

Hide Repository

Feature Repository

Remove Repository

Only selected repositories should appear publicly.

------------------------------------------------------------
PROJECT MANAGEMENT
------------------------------------------------------------

Projects should become fully editable.

Every project should support

Featured

Pinned

Draft

Published

Hidden

Archive

Order

Category

Tags

SEO

Gallery

GitHub

Demo

README

Architecture

Challenges

Solutions

Lessons Learned

Do not remove automatic GitHub synchronization.

Manual changes should always override generated content.

------------------------------------------------------------
SEARCH
------------------------------------------------------------

Improve global search.

Support

Projects

Research

Publications

Certificates

Blog

Technologies

Search should include

Title

Description

Tags

Technologies

Content

Keyboard shortcut

Ctrl + K

or

Cmd + K

------------------------------------------------------------
DATABASE
------------------------------------------------------------

Create any missing database tables required for

Resume

Profile

Publications

Settings

Social Links

Analytics

Generate

SQLAlchemy Models

Alembic Migrations

Pydantic Schemas

CRUD Services

Repositories

API Routes

Relationships

Indexes

Use UUID primary keys if the existing project already follows that pattern.

Maintain consistency with the existing database.

------------------------------------------------------------
API
------------------------------------------------------------

Every new feature must expose REST endpoints.

Profile

GET

PATCH

Resume

Upload

Replace

Delete

Download

Publications

CRUD

Certificates

CRUD Improvements

Settings

GET

PATCH

GitHub

Sync

Repositories

Status

Analytics

GET

Maintain API versioning.

Maintain existing response format.

Never introduce breaking API changes.

------------------------------------------------------------
MEDIA STORAGE
------------------------------------------------------------

All uploads should reuse the existing media storage layer.

Supported uploads

Profile Photo

Resume

Publication PDFs

Certificate Images

Project Images

Research Files

Validate

Type

Size

Extension

Prevent duplicate uploads.

------------------------------------------------------------
SEO
------------------------------------------------------------

Improve SEO management.

Every page should support

Title

Description

Keywords

Canonical

OpenGraph

Twitter Cards

Structured Data

Automatically generate Sitemap.

Automatically generate Robots.txt.

------------------------------------------------------------
ANALYTICS
------------------------------------------------------------

Dashboard should display

Visitors

Page Views

Top Projects

Downloads

Most Viewed Project

Most Downloaded Resume

Traffic Sources

Countries

Devices

Browsers

Analytics should degrade gracefully if no provider is configured.

------------------------------------------------------------
ERROR HANDLING
------------------------------------------------------------

Every feature should include

Loading State

Empty State

Error State

Retry State

Graceful Fallback

Never expose internal exceptions to users.

------------------------------------------------------------
ACCESSIBILITY
------------------------------------------------------------

Maintain WCAG AA.

Keyboard Navigation

Visible Focus

Semantic HTML

ARIA Labels

Reduced Motion

High Contrast

Touch Friendly Controls

------------------------------------------------------------
RESPONSIVE DESIGN
------------------------------------------------------------

Every new page must support

Mobile

Tablet

Laptop

Desktop

No horizontal scrolling.

Maintain existing spacing system.

------------------------------------------------------------
PERFORMANCE
------------------------------------------------------------

Do not reduce Lighthouse score.

Target

Performance ≥95

Accessibility ≥95

SEO =100

Best Practices =100

Optimize

Images

Fonts

Bundles

Animations

API Requests

Database Queries

------------------------------------------------------------
SECURITY
------------------------------------------------------------

Never expose

GitHub Token

Environment Variables

Secrets

Passwords

Use existing authentication.

Validate every upload.

Sanitize every input.

Protect every admin endpoint.

------------------------------------------------------------
RENDER COMPATIBILITY
------------------------------------------------------------

The application is already prepared for deployment.

Preserve compatibility with

Render

Docker

PostgreSQL

Redis

Cloudinary

Environment Variables

Health Checks

Do not introduce deployment-breaking changes.

------------------------------------------------------------
TESTING
------------------------------------------------------------

Before completing modifications

Verify

Homepage

Projects

GitHub Sync

Research

Publications

Certificates

Resume

Profile

Admin Dashboard

Authentication

Media Upload

Responsive Layout

Theme Switching

Accessibility

Search

No existing feature should regress.

------------------------------------------------------------
FINAL QUALITY REQUIREMENTS
------------------------------------------------------------

This should no longer feel like a portfolio template.

It should feel like a polished software product built by an experienced software engineer.

Recruiters should immediately understand

who I am,

what I build,

and the quality of my engineering.

Every page should reinforce professionalism.

Every interaction should feel intentional.

Every piece of personal information should be editable through the CMS.

There must be no placeholder text, placeholder links, placeholder images, or hardcoded personal information remaining anywhere in the application.

------------------------------------------------------------
IMPLEMENTATION RULES
------------------------------------------------------------

Work incrementally.

Before changing any feature

1. Inspect the existing implementation.

2. Reuse existing components.

3. Extend existing functionality instead of replacing it.

4. Preserve architecture.

5. Preserve folder structure.

6. Preserve coding standards.

7. Preserve database consistency.

8. Update backend and frontend together.

9. Generate database migrations where required.

10. Verify existing functionality.

11. Test before moving to the next feature.

Do not rewrite the application.

Do not regenerate the project.

Improve the existing production-ready portfolio while maintaining stability, maintainability, performance, and deployment compatibility.

------------------------------------------------------------
RECRUITER EXPERIENCE
------------------------------------------------------------

The portfolio is primarily designed for recruiters, hiring managers, engineering managers, CTOs, and potential clients.

Every page should help visitors quickly understand

• Who I am
• What I build
• My strongest technical skills
• My engineering approach
• My best projects
• How to contact me

A recruiter should be able to understand my profile within the first 30–60 seconds.

Prioritize clarity over visual complexity.

------------------------------------------------------------
CONTENT QUALITY
------------------------------------------------------------

Review every page.

Remove

• Generic marketing text
• Placeholder content
• Lorem Ipsum
• Dummy statistics
• Fake testimonials
• Empty sections
• Template wording

Replace with meaningful, professional content.

Never fabricate experience, publications, certifications, or achievements.

If content is missing, provide a graceful empty state in the CMS instead of displaying placeholders.

------------------------------------------------------------
FEATURED WORK
------------------------------------------------------------

The homepage should prioritize quality over quantity.

Display only 3–6 featured projects.

Each featured project should include

• Banner Image
• Short Description
• Tech Stack
• GitHub
• Live Demo (if available)
• View Details

The complete project list remains on the Projects page.

------------------------------------------------------------
PROJECT CASE STUDIES
------------------------------------------------------------

Every project page should read like a software engineering case study.

Suggested structure

• Hero
• Project Overview
• Problem Statement
• Solution
• Key Features
• Tech Stack
• System Architecture
• Screenshots
• Challenges
• Solutions
• Lessons Learned
• GitHub Repository
• Live Demo
• README

Avoid simply embedding the README.

Transform project information into a structured and readable presentation.

------------------------------------------------------------
ADMIN EXPERIENCE
------------------------------------------------------------

The CMS should allow me to update my portfolio without modifying source code.

Every personal detail should be editable from the dashboard.

This includes

• Hero
• About
• Profile
• Resume
• Projects
• Experience
• Education
• Research
• Publications
• Certificates
• Contact Information
• SEO
• Social Links

The CMS should be intuitive and consistent.

------------------------------------------------------------
VISUAL CONSISTENCY
------------------------------------------------------------

Review the entire application.

Ensure consistent

• Spacing
• Typography
• Card layouts
• Border radius
• Shadows
• Glass effects
• Icon sizes
• Animation timing
• Hover effects
• Button styles

No page should feel visually disconnected from the rest of the application.

------------------------------------------------------------
FINAL REVIEW
------------------------------------------------------------

Before considering the task complete, perform a complete review of the application.

Verify

✓ No broken links

✓ No placeholder URLs

✓ GitHub links open my profile

✓ LinkedIn opens my profile

✓ Resume downloads correctly

✓ Publications appear in Homepage and Navbar

✓ Certificates display correctly

✓ Featured projects work

✓ Hero content is personalized

✓ About section is personalized

✓ Profile image loads

✓ Mobile responsiveness

✓ Tablet responsiveness

✓ Desktop responsiveness

✓ Theme switching

✓ Accessibility

✓ SEO metadata

✓ Production build succeeds

✓ Docker build succeeds

✓ Render deployment remains compatible

The final result should feel like a premium, handcrafted developer portfolio built for a professional software engineer—not a modified template.
