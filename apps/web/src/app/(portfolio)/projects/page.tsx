"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Star,
  ExternalLink,
  ArrowRight,
  Code2,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ──────────────────────────────────────
// Types
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

// Language colors
const langColors: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Dart: "#00B4AB",
};

// ──────────────────────────────────────
// Project Card Component
// ──────────────────────────────────────
function ProjectCardComponent({ project }: { project: ProjectCard }) {
  return (
    <motion.div
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
            {project.live_url && (
              <span className="flex items-center gap-1 text-primary">
                <ExternalLink className="w-3 h-3" />
                Live
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ──────────────────────────────────────
// Projects Page
// ──────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await api.get<{ items: ProjectCard[]; total: number }>(
          "/api/v1/projects/public"
        );
        setProjects(data.items);
      } catch {
        // Will show empty state
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A curated collection of software projects showcasing engineering
            skills, architecture decisions, and technical expertise.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/50 glass-card"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <ProjectCardComponent key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {search ? "No matching projects" : "No projects yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {search
                ? "Try adjusting your search terms."
                : "Projects will appear here once they are published from the CMS."}
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
