"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  ArrowDown,
  Sparkles,
  Code2,
  Star,
  ExternalLink,
  ArrowRight,
  Layers,
  GraduationCap,
  Briefcase,
  Building2,
  CalendarDays,
  MapPin,
  Link2,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  FileDown,
} from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/use-profile";

// Brand icons (removed from lucide-react v1.x)
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/layout/contact-form";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ──────────────────────────────────────
// Animated Background Particles
// ──────────────────────────────────────
function FloatingParticles() {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "var(--glow)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────
// Gradient Orb
// ──────────────────────────────────────
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.15 270) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// ──────────────────────────────────────
// Spotlight Cursor
// ──────────────────────────────────────
function SpotlightCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0 hidden md:block"
      style={{
        background: `radial-gradient(800px circle at ${smoothX}px ${smoothY}px, var(--glow-muted), transparent 40%)`,
      }}
    />
  );
}

// ──────────────────────────────────────
// Scroll Indicator
// ──────────────────────────────────────
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <span className="text-xs text-muted-foreground tracking-widest uppercase">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────
// Projects Interface & Lang Colors
// ──────────────────────────────────────
interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  color: string | null;
  icon_url?: string | null;
}

interface ProjectCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url: string | null;
  github_url: string | null;
  live_url: string | null;
  stars: number;
  language: string | null;
  is_featured: boolean;
  technologies: Technology[];
}

interface Experience {
  id: string;
  company: string;
  company_url: string | null;
  role: string;
  location: string | null;
  description: string | null;
  achievements: string[];
  technologies: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  sort_order: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
}

interface Research {
  id: string;
  title: string;
  authors: string;
  journal: string;
  doi: string | null;
  url: string | null;
  published_date: string;
  abstract: string | null;
  is_published: boolean;
  sort_order: number;
}

interface Publication {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  authors: string;
  conference: string | null;
  journal: string | null;
  publisher: string | null;
  year: number | null;
  publication_date: string | null;
  doi: string | null;
  url: string | null;
  pdf_url: string | null;
  abstract: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

interface Certificate {
  id: string;
  title: string;
  provider: string;
  credential_id: string | null;
  credential_url: string | null;
  issue_date: string;
  expiration_date: string | null;
  is_active: boolean;
  sort_order: number;
}

const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Dart: "#00B4AB",
};

// ──────────────────────────────────────
// Hero Section
// ──────────────────────────────────────
export default function HomePage() {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [isLoadingTechs, setIsLoadingTechs] = useState(true);
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  
  const [research, setResearch] = useState<Research[]>([]);
  const [isLoadingResearch, setIsLoadingResearch] = useState(true);
  const [openResearchId, setOpenResearchId] = useState<string | null>(null);
  
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoadingPublications, setIsLoadingPublications] = useState(true);
  const [openPubId, setOpenPubId] = useState<string | null>(null);
  
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);

  const { profile } = useProfile();

  // Fetch Projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await api.get<{ items: ProjectCard[]; total: number }>(
          "/api/v1/projects/public",
          { params: { per_page: "6", featured_only: "true" } }
        );
        setProjects(data.items);
      } catch (err) {
        console.error("Failed to fetch public projects for homepage:", err);
      } finally {
        setIsLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  // Fetch Technologies
  useEffect(() => {
    async function fetchTechs() {
      try {
        const data = await api.get<Technology[]>("/api/v1/projects/public/technologies");
        setTechnologies(data);
      } catch (err) {
        console.error("Failed to fetch public technologies:", err);
      } finally {
        setIsLoadingTechs(false);
      }
    }
    fetchTechs();
  }, []);

  // Fetch Experience & Education
  useEffect(() => {
    async function fetchTimeline() {
      try {
        const [expData, eduData] = await Promise.all([
          api.get<{ items: Experience[] }>("/api/v1/experience/public"),
          api.get<{ items: Education[] }>("/api/v1/education/public"),
        ]);
        setExperiences(expData.items);
        setEducations(eduData.items);
      } catch (err) {
        console.error("Failed to fetch timeline data:", err);
      } finally {
        setIsLoadingTimeline(false);
      }
    }
    fetchTimeline();
  }, []);

  // Fetch Research
  useEffect(() => {
    async function fetchResearch() {
      try {
        const data = await api.get<{ items: Research[] }>("/api/v1/research/public");
        setResearch(data.items);
      } catch (err) {
        console.error("Failed to fetch research:", err);
      } finally {
        setIsLoadingResearch(false);
      }
    }
    fetchResearch();
  }, []);

  // Fetch Publications
  useEffect(() => {
    async function fetchPublications() {
      try {
        const data = await api.get<{ items: Publication[] }>("/api/v1/publications/public");
        setPublications(data.items);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
      } finally {
        setIsLoadingPublications(false);
      }
    }
    fetchPublications();
  }, []);

  // Fetch Certificates
  useEffect(() => {
    async function fetchCertificates() {
      try {
        const data = await api.get<{ items: Certificate[] }>("/api/v1/certificates/public");
        setCertificates(data.items);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setIsLoadingCertificates(false);
      }
    }
    fetchCertificates();
  }, []);

  return (
    <main className="relative flex-1">
      {/* Hero */}
      <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
        <GradientOrbs />
        <FloatingParticles />
        <SpotlightCursor />

        {/* Ambient gradient overlay */}
        <div className="absolute inset-0 abyss-gradient pointer-events-none" />

        {/* Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Avatar Profile Image */}
          {profile?.profile_image_url && (
            <motion.div
              variants={staggerItem}
              className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300 shadow-xl"
            >
              <img
                src={profile.profile_image_url}
                alt={profile.full_name || "Profile avatar"}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Status Badge */}
          <motion.div variants={staggerItem} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm">
              <span className="relative flex h-2 w-2">
                {profile?.availability_status === "busy" ? (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                ) : (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </>
                )}
              </span>
              <span className="text-muted-foreground">
                {profile?.availability_status === "available"
                  ? "Available for opportunities"
                  : profile?.availability_status === "open_to_work"
                  ? "Open to work"
                  : profile?.availability_status === "busy"
                  ? "Not actively looking"
                  : profile?.availability_status || "Available for opportunities"}
              </span>
            </div>
          </motion.div>

          {/* Greeting & Large Name */}
          <motion.div variants={staggerItem} className="space-y-2 mb-6">
            <span className="text-primary font-semibold text-lg sm:text-xl tracking-wider uppercase block">
              Hi, I'm
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground">
              {profile?.full_name || "Reshad Romim"}
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-[oklch(0.7_0.17_200)] to-[oklch(0.65_0.18_270)] bg-clip-text text-transparent glow-text mt-2">
              {profile?.hero_subtitle || profile?.headline || "Backend Engineer & AI Developer"}
            </p>
          </motion.div>

          {/* Headline / Hero Title */}
          {profile?.hero_title && (
            <motion.h2
              variants={staggerItem}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground/85 max-w-3xl mx-auto mb-6 leading-tight"
            >
              {profile.hero_title}
            </motion.h2>
          )}

          {/* Introduction */}
          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {profile?.hero_description ||
              profile?.headline ||
              "Full-stack software engineer specializing in scalable web applications, clean architecture, and exceptional user experiences."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden px-8 glow-sm"
              render={<a href="#projects" />}
              nativeButton={false}
            >
              <Sparkles className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
              View Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 glass-card border-primary/20 text-primary hover:bg-primary/10"
              render={<a href="/resume" />}
              nativeButton={false}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 glass-card"
              render={<a href="#contact" />}
              nativeButton={false}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Me
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={staggerItem}
            className="flex items-center justify-center gap-4 mt-10"
          >
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
            {profile?.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Personal Website"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="py-24 flex items-center justify-center relative z-10"
      >
        <div className="w-full max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A curated selection of my work, fetched directly from my GitHub repositories.
            </p>
          </motion.div>

          {isLoadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden p-5 space-y-4">
                  <div className="h-44 bg-muted/20 animate-pulse rounded-xl" />
                  <div className="h-6 bg-muted/20 animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-muted/20 animate-pulse rounded w-full" />
                  <div className="h-4 bg-muted/20 animate-pulse rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl p-8 max-w-lg mx-auto">
              <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects showcased yet</h3>
              <p className="text-muted-foreground text-sm">
                Connect and sync GitHub repositories in the Admin area to publish projects on your homepage.
              </p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="block group glass-card rounded-2xl overflow-hidden hover:glow-sm transition-all duration-300"
                  >
                    {/* Banner */}
                    <div className="h-44 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent relative overflow-hidden">
                      {project.banner_url ? (
                        <img
                          src={project.banner_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Code2 className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Featured badge */}
                      {project.is_featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary/90 text-primary-foreground text-[10px]">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.summary}
                      </p>

                      {/* Technologies */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-3">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge
                            key={tech.id}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tech.name}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {project.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: langColors[project.language] || "#666",
                              }}
                            />
                            {project.language}
                          </span>
                        )}
                        {project.stars > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {project.stars}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {projects.length > 0 && (
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link href="/projects">
                <Button variant="outline" className="glass-card gap-2">
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>



      {/* Technology Stack Section */}
      {technologies.length > 0 && (
        <section
          id="tech-stack"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Technology Stack</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tools, frameworks, and languages I leverage to build scalable solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(
                technologies.reduce((acc, tech) => {
                  const cat = tech.category || "other";
                  if (!acc[cat]) acc[cat] = [];
                  acc[cat].push(tech);
                  return acc;
                }, {} as Record<string, Technology[]>)
              ).map(([category, techs]) => {
                const categoryNames: Record<string, string> = {
                  language: "Languages",
                  framework: "Frameworks",
                  library: "Libraries & Utilities",
                  database: "Databases",
                  tool: "Tools & DevOps",
                  platform: "Cloud Platforms",
                  other: "Other Technologies",
                };

                return (
                  <motion.div
                    key={category}
                    className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:glow-sm transition-all duration-300 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div>
                      <h3 className="text-lg font-bold mb-4 text-primary capitalize">
                        {categoryNames[category] || category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {techs.map((tech) => (
                          <span
                            key={tech.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold glass-card border border-border/20 transition-all hover:scale-105"
                            style={{
                              borderLeft: tech.color ? `3px solid ${tech.color}` : undefined,
                            }}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section
          id="experience"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Professional Experience</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                My career timeline and software engineering roles.
              </p>
            </motion.div>

            <div className="relative border-l border-border/30 ml-4 sm:ml-6 space-y-12">
              {experiences.map((exp) => (
                <motion.div
                  key={exp.id}
                  className="relative pl-8 sm:pl-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Timeline icon */}
                  <div
                    className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border border-border/50 ${
                      exp.is_current ? "bg-primary text-primary-foreground shadow-lg animate-pulse" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>

                  <div className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Building2 className="w-4 h-4" />
                          {exp.company_url ? (
                            <a
                              href={exp.company_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline font-semibold"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            <span className="font-semibold">{exp.company}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                    )}

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1.5 shrink-0">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {educations.length > 0 && (
        <section
          id="education"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Education & Milestones</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                My academic credentials and graduation milestones.
              </p>
            </motion.div>

            <div className="relative border-l border-border/30 ml-4 sm:ml-6 space-y-12">
              {educations.map((edu) => (
                <motion.div
                  key={edu.id}
                  className="relative pl-8 sm:pl-10"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Timeline icon */}
                  <div
                    className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center border border-border/50 ${
                      edu.is_current ? "bg-primary text-primary-foreground shadow-lg animate-pulse" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>

                  <div className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {edu.degree}
                          {edu.field_of_study && ` in ${edu.field_of_study}`}
                        </h3>
                        <span className="text-sm text-primary font-semibold block mt-1">
                          {edu.institution}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {edu.start_date} — {edu.is_current ? "Present" : edu.end_date}
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Section */}
      {research.length > 0 && (
        <section
          id="research"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Research & Innovations</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                My contributions to scientific and technical research.
              </p>
            </motion.div>

            <div className="space-y-6 text-left">
              {research.map((res) => (
                <motion.div
                  key={res.id}
                  className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <h3 className="text-lg font-bold text-foreground">{res.title}</h3>
                      <p className="text-sm text-primary font-medium">{res.authors}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-muted-foreground/80">{res.journal}</span>
                        <span>•</span>
                        <span>{res.published_date}</span>
                        {res.doi && (
                          <>
                            <span>•</span>
                            <span className="font-mono">DOI: {res.doi}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {res.url && (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Paper
                        </a>
                      )}
                      {res.abstract && (
                        <button
                          onClick={() => setOpenResearchId(openResearchId === res.id ? null : res.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 font-semibold transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {openResearchId === res.id ? "Hide Abstract" : "Read Abstract"}
                          {openResearchId === res.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {res.abstract && openResearchId === res.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-border/10 text-sm text-muted-foreground leading-relaxed overflow-hidden text-left"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="font-semibold text-foreground mb-1">Abstract</h4>
                        <p>{res.abstract}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Publications Section */}
      {publications.length > 0 && (
        <section
          id="publications"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Academic Publications</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Conference papers, scientific journals, and publisher citations.
              </p>
            </motion.div>

            <div className="space-y-6 text-left">
              {publications.map((pub) => (
                <motion.div
                  key={pub.id}
                  className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        {pub.year && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-bold uppercase">
                            {pub.year}
                          </span>
                        )}
                        {pub.conference && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 font-semibold">
                            {pub.conference}
                          </span>
                        )}
                        {pub.journal && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">
                            {pub.journal}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{pub.title}</h3>
                      {pub.subtitle && <p className="text-sm text-muted-foreground italic">{pub.subtitle}</p>}
                      <p className="text-sm text-primary/80 font-medium">{pub.authors}</p>
                      
                      {pub.publisher && (
                        <span className="text-xs text-muted-foreground block mt-1">
                          Publisher: <span className="font-semibold text-muted-foreground/80">{pub.publisher}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start flex-wrap">
                      {pub.pdf_url && (
                        <a
                          href={pub.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      )}
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Paper
                        </a>
                      )}
                      {pub.abstract && (
                        <button
                          onClick={() => setOpenPubId(openPubId === pub.id ? null : pub.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 font-semibold transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {openPubId === pub.id ? "Hide Abstract" : "Read Abstract"}
                          {openPubId === pub.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {pub.abstract && openPubId === pub.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-border/10 text-sm text-muted-foreground leading-relaxed overflow-hidden text-left"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="font-semibold text-foreground mb-1">Abstract</h4>
                        <p>{pub.abstract}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <section
          id="certificates"
          className="py-24 relative z-10 border-t border-border/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Certifications</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                My certified engineering credentials and skill validations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:glow-sm transition-all duration-300 text-left"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{cert.title}</h3>
                      <p className="text-sm text-primary font-semibold mt-1">{cert.provider}</p>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Issued: {cert.issue_date}
                      </p>
                      {cert.credential_id && (
                        <p className="font-mono">ID: {cert.credential_id}</p>
                      )}
                    </div>
                  </div>

                  {cert.credential_url && (
                    <div className="mt-6">
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Verify Credential
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="contact"
        className="py-24 relative z-10 border-t border-border/10"
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Have a project in mind or want to discuss opportunities? Let&apos;s build something amazing together.
                </p>
              </div>

              <div className="space-y-6">
                {/* Availability */}
                {profile?.availability_status && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <span className="relative flex h-2.5 w-2.5">
                        {profile.availability_status === "busy" ? (
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </>
                        )}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Availability</h4>
                      <p className="text-sm font-medium">
                        {profile.availability_status === "available"
                          ? "Available for opportunities"
                          : profile.availability_status === "open_to_work"
                          ? "Open to work"
                          : profile.availability_status === "busy"
                          ? "Not actively looking"
                          : profile.availability_status}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {profile?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</h4>
                      <a href={`mailto:${profile.email}`} className="text-sm font-medium hover:text-primary transition-colors">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Location */}
                {profile?.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-indigo-400">
                        <path d="M12 2a8 8 0 00-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 00-8-8z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</h4>
                      <p className="text-sm font-medium">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-2xl p-6 sm:p-8 hover:glow-sm transition-all duration-300">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
