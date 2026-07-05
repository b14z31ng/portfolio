"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  ArrowLeft,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
  Microscope,
  BookOpen,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

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
  created_at: string;
}

export default function ResearchAdminPage() {
  const [researchList, setResearchList] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [publishedDate, setPublishedDate] = useState(""); // YYYY-MM
  const [abstract, setAbstract] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Research Publications ──
  const fetchResearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: Research[]; total: number }>("/api/v1/research");
      setResearchList(data.items);
    } catch {
      setError("Failed to fetch research publications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResearch();
  }, [fetchResearch]);

  // ── Reset Form ──
  const resetForm = () => {
    setTitle("");
    setAuthors("");
    setJournal("");
    setDoi("");
    setUrl("");
    setPublishedDate("");
    setAbstract("");
    setIsPublished(true);
    setSortOrder("0");
    setSelectedResearch(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (res: Research) => {
    setSelectedResearch(res);
    setTitle(res.title);
    setAuthors(res.authors);
    setJournal(res.journal);
    setDoi(res.doi || "");
    setUrl(res.url || "");
    setPublishedDate(res.published_date);
    setAbstract(res.abstract || "");
    setIsPublished(res.is_published);
    setSortOrder(res.sort_order.toString());
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (resId: string) => {
    if (!confirm("Are you sure you want to delete this research publication?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/research/${resId}`);
      setResearchList((prev) => prev.filter((r) => r.id !== resId));
      setSuccess("Research publication deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to delete research publication.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authors.trim() || !journal.trim() || !publishedDate.trim()) {
      setError("Title, Authors, Journal, and Published Date are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: title.trim(),
      authors: authors.trim(),
      journal: journal.trim(),
      doi: doi.trim() || null,
      url: url.trim() || null,
      published_date: publishedDate.trim(),
      abstract: abstract.trim() || null,
      is_published: isPublished,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (view === "create") {
        const newRes = await api.post<Research>("/api/v1/research", payload);
        setResearchList((prev) => [...prev, newRes].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Research publication created successfully!");
      } else if (view === "edit" && selectedResearch) {
        const updatedRes = await api.patch<Research>(
          `/api/v1/research/${selectedResearch.id}`,
          payload
        );
        setResearchList((prev) =>
          prev
            .map((p) => (p.id === selectedResearch.id ? updatedRes : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Research publication updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save research publication."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Research Publications
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your academic papers, technical case studies, and research publications.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Publication
            </Button>
          </motion.div>

          {/* Research list */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : researchList.length > 0 ? (
              <div className="space-y-4">
                {researchList.map((res) => (
                  <Card
                    key={res.id}
                    className="glass-card hover:glow-sm transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold">
                              {res.title}
                            </h3>
                            <span className="text-muted-foreground">in</span>
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <BookOpen className="w-4 h-4" />
                              {res.journal}
                            </div>
                            {!res.is_published && (
                              <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
                                Draft
                              </Badge>
                            )}
                          </div>

                          <div className="text-sm font-medium text-muted-foreground">
                            {res.authors}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {res.published_date}
                            </span>
                            {res.doi && (
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                DOI: {res.doi}
                              </span>
                            )}
                            {res.url && (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-primary hover:underline"
                              >
                                <LinkIcon className="w-3 h-3" />
                                View Link
                              </a>
                            )}
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              Order: {res.sort_order}
                            </span>
                          </div>

                          {res.abstract && (
                            <p className="text-sm text-muted-foreground max-w-3xl line-clamp-3">
                              {res.abstract}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(res)}
                            aria-label="Edit publication"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(res.id)}
                            aria-label="Delete publication"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Microscope className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No research publications added yet. Add your first publication entry!
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
                {view === "create" ? "Add Research Publication" : "Edit Research Publication"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Record a new research paper or project."
                  : "Update research publication details."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Publication Title *</label>
                <Input
                  required
                  placeholder="e.g. Deep Learning Approaches to Autonomous Navigation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Authors *</label>
                <Input
                  required
                  placeholder="e.g. Jane Doe, John Smith (comma separated)"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Journal / Venue / Publisher *</label>
                <Input
                  required
                  placeholder="e.g. IEEE Transactions on Robotics"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Published Date (YYYY-MM) *</label>
                <Input
                  required
                  placeholder="2023-06"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Sort Order (lower numbers appear first)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">DOI (Digital Object Identifier)</label>
                <Input
                  placeholder="e.g. 10.1109/TRO.2023.123456"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">URL / Link to Paper</label>
                <Input
                  placeholder="e.g. https://ieeexplore.ieee.org/document/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* Published Switch */}
              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg glass-card max-w-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Publish immediately</span>
                  <span className="text-[10px] text-muted-foreground">
                    If disabled, this publication will be saved as a draft.
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

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Abstract / Summary</label>
                <Textarea
                  rows={6}
                  placeholder="Paste the publication's abstract or a summary of findings here..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("list")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="glow-sm">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Publication
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
