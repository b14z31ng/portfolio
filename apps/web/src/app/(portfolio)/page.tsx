"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
} from "lucide-react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await api.get<{ items: ProjectCard[]; total: number }>(
          "/api/v1/projects/public",
          { params: { per_page: "6" } }
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
          {/* Status Badge */}
          <motion.div variants={staggerItem} className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-muted-foreground">
                Available for opportunities
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={staggerItem}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-foreground">Building </span>
            <span
              className="bg-gradient-to-r from-primary via-[oklch(0.7_0.17_200)] to-[oklch(0.65_0.18_270)] bg-clip-text text-transparent glow-text"
            >
              digital experiences
            </span>
            <br />
            <span className="text-foreground">that matter.</span>
          </motion.h1>

          {/* Introduction */}
          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Full-stack software engineer specializing in scalable web
            applications, clean architecture, and exceptional user experiences.
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
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl glass-card hover:glow-sm transition-all duration-300 hover:-translate-y-0.5"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
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

      <section
        id="contact"
        className="py-20 flex items-center justify-center relative z-10"
      >
        <motion.div
          className="w-full max-w-2xl mx-auto px-6 text-center space-y-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground text-lg">
              Have a project in mind or want to discuss opportunities? I&apos;d love to hear from you.
            </p>
          </div>
          
          <ContactForm />
        </motion.div>
      </section>
    </main>
  );
}
