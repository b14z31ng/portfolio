"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  Tag,
  BookOpen,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  banner_url: string | null;
  tags: string[];
  read_time: number;
  views: number;
  published_at: string | null;
}

// Simple helper to parse basic markdown to HTML elements safely
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  let inList = false;
  let inCode = false;
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    // Code block
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      return;
    }

    if (inCode) {
      elements.push(
        <pre key={index} className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto my-2 border border-border/40">
          <code>{line}</code>
        </pre>
      );
      return;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">
          {line.replace("# ", "")}
        </h1>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-foreground">
          {line.replace("## ", "")}
        </h2>
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-xl font-semibold mt-4 mb-2 text-foreground">
          {line.replace("### ", "")}
        </h3>
      );
      return;
    }

    // Bullet list
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const cleanLine = line.replace(/^[\s\-\*]+/, "");
      elements.push(
        <ul key={index} className="list-disc pl-6 space-y-1 my-1 text-sm sm:text-base text-muted-foreground">
          <li>{cleanLine}</li>
        </ul>
      );
      return;
    }

    // Blockquote
    if (line.trim().startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
          {line.replace("> ", "")}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      return;
    }

    // Standard paragraph
    // Parse inline bold: **text** -> strong
    const parts = line.split(" ");
    const formattedParts = parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx}>{part.replace(/\*\*/g, "")} </strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={idx}>{part.replace(/\*/g, "")} </em>;
      }
      return part + " ";
    });

    elements.push(
      <p key={index} className="text-muted-foreground text-sm sm:text-base leading-relaxed my-3">
        {formattedParts}
      </p>
    );
  });

  return elements;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await api.get<BlogPost>(`/api/v1/blog/public/${slug}`);
        setPost(data);
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6 space-y-6">
        <Skeleton className="h-6 w-24 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-28 pb-20 max-w-3xl mx-auto px-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="text-muted-foreground">
          The blog post you are looking for does not exist or has been unpublished.
        </p>
        <Button onClick={() => router.push("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <article className="max-w-3xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Back button */}
          <motion.div variants={staggerItem}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/blog")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to articles
            </Button>
          </motion.div>

          {/* Banner image */}
          {post.banner_url && (
            <motion.div
              variants={staggerItem}
              className="aspect-video w-full rounded-2xl overflow-hidden bg-muted relative border border-border/40"
            >
              <img
                src={post.banner_url}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </motion.div>
          )}

          {/* Title & Metadata */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-2 border-b border-border/40 pb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Draft"}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </span>

              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views} views
              </span>
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <motion.div variants={staggerItem} className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            variants={staggerItem}
            className="prose prose-invert max-w-none pt-4"
          >
            {renderMarkdown(post.content)}
          </motion.div>
        </motion.div>
      </article>
    </main>
  );
}
