"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Clock,
  ArrowRight,
  Eye,
  Calendar,
  Search,
  Tag,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPostCard {
  id: string;
  slug: string;
  title: string;
  summary: string;
  banner_url: string | null;
  tags: string[];
  read_time: number;
  views: number;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await api.get<{ items: BlogPostCard[] }>("/api/v1/blog/public");
        setPosts(data.items);
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Collect all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={staggerItem}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Technical Blog
            </h1>
            <p className="text-muted-foreground text-lg">
              Technical articles, tutorials, and insights on software engineering.
            </p>
          </motion.div>

          {/* Filters (Search & Tags) */}
          {posts.length > 0 && (
            <motion.div
              variants={staggerItem}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Search */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              {/* Unique Tags */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                  <Badge
                    variant={selectedTag === null ? "default" : "secondary"}
                    className="cursor-pointer hover:glow-sm transition-all"
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </Badge>
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "secondary"}
                      className="cursor-pointer hover:glow-sm transition-all flex items-center gap-1"
                      onClick={() => setSelectedTag(tag)}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Posts Grid */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="h-full"
                    >
                      <Link href={`/blog/${post.slug}`} className="block h-full group">
                        <Card className="glass-card hover:glow-sm h-full flex flex-col justify-between transition-all duration-300">
                          <CardHeader className="pb-2">
                            {post.banner_url && (
                              <div className="aspect-video w-full rounded-lg overflow-hidden mb-3 relative bg-muted">
                                <img
                                  src={post.banner_url}
                                  alt={post.title}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(post.published_at).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.read_time} min read
                              </span>
                            </div>
                            <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {post.summary}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {post.tags.slice(0, 2).map((t) => (
                                  <Badge key={t} variant="outline" className="text-[9px] px-1 py-0">
                                    {t}
                                  </Badge>
                                ))}
                              </div>

                              <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Read
                                <ArrowRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {search || selectedTag ? "No results found" : "Coming Soon"}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {search || selectedTag
                      ? "Try clearing your search query or tag selection to view all posts."
                      : "Blog posts will appear here once published from the CMS. Stay tuned for technical deep-dives."}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
