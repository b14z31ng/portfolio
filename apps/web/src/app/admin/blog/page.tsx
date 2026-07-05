"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  FileText,
  Tag,
  Globe,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  banner_url: string | null;
  tags: string[];
  is_published: boolean;
  read_time: number;
  views: number;
  published_at: string | null;
  created_at: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Posts ──
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: BlogPost[]; total: number }>("/api/v1/blog", {
        params: { per_page: "100" },
      });
      setPosts(data.items);
    } catch (err) {
      setError("Failed to fetch blog posts. Is the API server running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ── Reset Form ──
  const resetForm = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setBannerUrl("");
    setTagsInput("");
    setIsPublished(false);
    setSelectedPost(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (post: BlogPost) => {
    setSelectedPost(post);
    setTitle(post.title);
    setSummary(post.summary || "");
    setContent(post.content);
    setBannerUrl(post.banner_url || "");
    setTagsInput(post.tags.join(", "));
    setIsPublished(post.is_published);
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/blog/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSuccess("Blog post deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete blog post.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      summary: summary.trim() || undefined,
      content: content.trim(),
      banner_url: bannerUrl.trim() || null,
      tags: parsedTags,
      is_published: isPublished,
    };

    try {
      if (view === "create") {
        const newPost = await api.post<BlogPost>("/api/v1/blog", payload);
        setPosts((prev) => [newPost, ...prev]);
        setSuccess("Blog post created successfully!");
      } else if (view === "edit" && selectedPost) {
        const updatedPost = await api.patch<BlogPost>(
          `/api/v1/blog/${selectedPost.id}`,
          payload
        );
        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? updatedPost : p)));
        setSuccess("Blog post updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save blog post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {view === "list" ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Blog Posts
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your technical articles and draft entries.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </motion.div>

          {/* Search bar */}
          <motion.div variants={staggerItem} className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </motion.div>

          {/* Posts list */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className={`glass-card hover:glow-sm transition-all duration-300 flex flex-col justify-between ${
                      !post.is_published && "border-dashed"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          variant={post.is_published ? "default" : "secondary"}
                          className="text-[10px] px-2 py-0.5"
                        >
                          {post.is_published ? "Published" : "Draft"}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {post.views} views
                        </div>
                      </div>
                      <CardTitle className="text-base line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {post.summary || "No summary provided."}
                      </p>

                      <div className="space-y-3">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-[9px] px-1 py-0"
                              >
                                {t}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-[9px] text-muted-foreground">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer details */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/50 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.read_time} min read
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEditClick(post)}
                              aria-label="Edit post"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(post.id)}
                              aria-label="Delete post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No blog posts match your search query."
                      : "No blog posts found. Create your first post!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("list")}
              aria-label="Back to list"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {view === "create" ? "Create Blog Post" : "Edit Blog Post"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Write and publish a new article to the portfolio."
                  : "Modify the existing blog article."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content inputs */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Title *</label>
                  <Input
                    required
                    placeholder="Enter blog post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Content (Markdown supported) *</label>
                  <Textarea
                    required
                    rows={15}
                    placeholder="Write your article content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="font-mono text-sm bg-background/50"
                  />
                </div>
              </div>

              {/* Sidebar metadata inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Summary</label>
                  <Textarea
                    rows={4}
                    placeholder="Brief description of the post (falls back to content start if empty)"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="bg-background/50 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Banner Image URL</label>
                  <Input
                    placeholder="https://example.com/banner.png"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="bg-background/50 text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tags (comma-separated)</label>
                  <Input
                    placeholder="React, TypeScript, Next.js"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="bg-background/50 text-xs"
                  />
                </div>

                {/* Published status toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg glass-card">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Publish Post</span>
                    <span className="text-[10px] text-muted-foreground">
                      Make it visible on the public website.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPublished ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                        isPublished ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setView("list")}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="w-full glow-sm">
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Post
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
