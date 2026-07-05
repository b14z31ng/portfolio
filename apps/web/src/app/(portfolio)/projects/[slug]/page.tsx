"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Code2,
  Layers,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

// Simple helper to parse basic markdown inline styling (bold, italic, code, links)
function parseInlineStyles(text: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    const italicMatch = remaining.match(/\*(.*?)\*/);
    const codeMatch = remaining.match(/`(.*?)`/);

    const matches = [
      { name: "link", match: linkMatch, index: linkMatch?.index ?? -1 },
      { name: "bold", match: boldMatch, index: boldMatch?.index ?? -1 },
      { name: "italic", match: italicMatch, index: italicMatch?.index ?? -1 },
      { name: "code", match: codeMatch, index: codeMatch?.index ?? -1 },
    ].filter((m) => m.index !== -1);

    if (matches.length === 0) {
      tokens.push(<span key={key++}>{remaining}</span>);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) {
      tokens.push(<span key={key++}>{remaining.slice(0, first.index)}</span>);
    }

    const matchContent = first.match![1];
    if (first.name === "link") {
      const url = first.match![2];
      tokens.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {matchContent}
        </a>
      );
    } else if (first.name === "bold") {
      tokens.push(
        <strong key={key++} className="font-semibold text-foreground">
          {matchContent}
        </strong>
      );
    } else if (first.name === "italic") {
      tokens.push(
        <em key={key++} className="italic text-foreground/90">
          {matchContent}
        </em>
      );
    } else if (first.name === "code") {
      tokens.push(
        <code
          key={key++}
          className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border/40 text-foreground"
        >
          {matchContent}
        </code>
      );
    }

    remaining = remaining.slice(first.index + first.match![0].length);
  }

  return <>{tokens}</>;
}

// Simple helper to parse basic markdown to HTML elements safely
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  let inCode = false;
  let codeLines: string[] = [];
  let listItems: string[] = [];

  const elements: React.ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={key++}
          className="list-disc pl-6 space-y-2 my-4 text-sm sm:text-base text-muted-foreground"
        >
          {listItems.map((item, idx) => (
            <li key={idx}>{parseInlineStyles(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushList();
      if (inCode) {
        elements.push(
          <pre
            key={key++}
            className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto my-4 border border-border/40 text-foreground"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const cleanLine = line.replace(/^\s*[\-\*]\s+/, "");
      listItems.push(cleanLine);
      continue;
    }

    flushList();

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1
          key={key++}
          className="text-3xl font-bold mt-8 mb-4 text-foreground tracking-tight"
        >
          {parseInlineStyles(trimmed.replace("# ", ""))}
        </h1>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-semibold mt-6 mb-3 text-foreground tracking-tight"
        >
          {parseInlineStyles(trimmed.replace("## ", ""))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={key++}
          className="text-xl font-semibold mt-5 mb-2 text-foreground tracking-tight"
        >
          {parseInlineStyles(trimmed.replace("### ", ""))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={key++}
          className="border-l-4 border-primary/60 pl-4 italic my-4 text-muted-foreground bg-muted/10 py-1 rounded-r"
        >
          {parseInlineStyles(trimmed.replace("> ", ""))}
        </blockquote>
      );
      continue;
    }

    if (!trimmed) {
      continue;
    }

    elements.push(
      <p
        key={key++}
        className="text-muted-foreground text-sm sm:text-base leading-relaxed my-4"
      >
        {parseInlineStyles(line)}
      </p>
    );
  }

  flushList();

  return elements;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

interface Technology {
  id: string;
  name: string;
  slug: string;
  category: string;
  color: string | null;
}

interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  banner_url: string | null;
  github_url: string | null;
  live_url: string | null;
  readme: string | null;
  architecture: string | null;
  features: string[] | null;
  challenges: string | null;
  solutions: string | null;
  lessons_learned: string | null;
  screenshots: string[] | null;
  stars: number;
  forks: number;
  language: string | null;
  is_featured: boolean;
  technologies: Technology[];
  created_at: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await api.get<ProjectDetail>(
          `/api/v1/projects/public/${slug}`
        );
        setProject(data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="pt-28 pb-20 min-h-dvh">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="pt-28 pb-20 min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The project you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published.
          </p>
          <Button render={<Link href="/projects" />} nativeButton={false}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </main>
    );
  }

  const techByCategory = project.technologies.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) acc[tech.category] = [];
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>
  );

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Back */}
          <motion.div variants={staggerItem}>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={staggerItem}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                  {project.title}
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {project.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {project.github_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <GithubIcon className="w-4 h-4 mr-2" />
                    Source
                  </Button>
                )}
                {project.live_url && (
                  <Button
                    size="sm"
                    className="glow-sm"
                    render={
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                    nativeButton={false}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-6">
              {project.stars > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-amber-500" />
                  {project.stars} stars
                </div>
              )}
              {project.forks > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <GitFork className="w-4 h-4" />
                  {project.forks} forks
                </div>
              )}
            </div>
          </motion.div>

          {/* Technology Stack */}
          {project.technologies.length > 0 && (
            <motion.div variants={staggerItem}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(techByCategory).map(([category, techs]) => (
                      <div key={category}>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {techs.map((tech) => (
                            <Badge
                              key={tech.id}
                              variant="secondary"
                              className="text-xs"
                              style={
                                tech.color
                                  ? {
                                      borderLeft: `3px solid ${tech.color}`,
                                    }
                                  : undefined
                              }
                            >
                              {tech.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <motion.div variants={staggerItem}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Description / Architecture */}
          {(project.description || project.architecture) && (
            <motion.div variants={staggerItem} className="space-y-6">
              {project.description && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  <div className="prose prose-invert max-w-none">
                    {renderMarkdown(project.description)}
                  </div>
                </div>
              )}
              {project.architecture && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Architecture</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {project.architecture}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
