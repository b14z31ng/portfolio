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
  BookOpen,
  Link as LinkIcon,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

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
  citation: string | null;
  bibtex: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

export default function PublicationsAdminPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedPub, setSelectedPub] = useState<Publication | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [conference, setConference] = useState("");
  const [journal, setJournal] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [publicationDate, setPublicationDate] = useState(""); // YYYY-MM-DD
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [abstract, setAbstract] = useState("");
  const [citation, setCitation] = useState("");
  const [bibtex, setBibtex] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Publications ──
  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: Publication[]; total: number }>("/api/v1/publications");
      setPublications(data.items);
    } catch {
      setError("Failed to fetch publications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // ── Reset Form ──
  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setAuthors("");
    setConference("");
    setJournal("");
    setPublisher("");
    setYear("");
    setPublicationDate("");
    setDoi("");
    setUrl("");
    setPdfUrl("");
    setAbstract("");
    setCitation("");
    setBibtex("");
    setIsFeatured(false);
    setIsPublished(true);
    setSortOrder("0");
    setSelectedPub(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (pub: Publication) => {
    setSelectedPub(pub);
    setTitle(pub.title);
    setSubtitle(pub.subtitle || "");
    setAuthors(pub.authors);
    setConference(pub.conference || "");
    setJournal(pub.journal || "");
    setPublisher(pub.publisher || "");
    setYear(pub.year ? pub.year.toString() : "");
    setPublicationDate(pub.publication_date || "");
    setDoi(pub.doi || "");
    setUrl(pub.url || "");
    setPdfUrl(pub.pdf_url || "");
    setAbstract(pub.abstract || "");
    setCitation(pub.citation || "");
    setBibtex(pub.bibtex || "");
    setIsFeatured(pub.is_featured);
    setIsPublished(pub.is_published);
    setSortOrder(pub.sort_order.toString());
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (pubId: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/publications/${pubId}`);
      setPublications((prev) => prev.filter((p) => p.id !== pubId));
      setSuccess("Publication deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to delete publication.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authors.trim()) {
      setError("Title and Authors are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      authors: authors.trim(),
      conference: conference.trim() || null,
      journal: journal.trim() || null,
      publisher: publisher.trim() || null,
      year: year.trim() ? parseInt(year) : null,
      publication_date: publicationDate.trim() || null,
      doi: doi.trim() || null,
      url: url.trim() || null,
      pdf_url: pdfUrl.trim() || null,
      abstract: abstract.trim() || null,
      citation: citation.trim() || null,
      bibtex: bibtex.trim() || null,
      is_featured: isFeatured,
      is_published: isPublished,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (view === "create") {
        const newPub = await api.post<Publication>("/api/v1/publications", payload);
        setPublications((prev) => [...prev, newPub].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Publication created successfully!");
      } else if (view === "edit" && selectedPub) {
        const updatedPub = await api.patch<Publication>(
          `/api/v1/publications/${selectedPub.id}`,
          payload
        );
        setPublications((prev) =>
          prev
            .map((p) => (p.id === selectedPub.id ? updatedPub : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Publication updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save publication."
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
                Academic Publications
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your conference papers, journals, citation details, and BibTeX info.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Publication
            </Button>
          </motion.div>

          {/* Publications List */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : publications.length > 0 ? (
              <div className="space-y-4">
                {publications.map((pub) => (
                  <Card
                    key={pub.id}
                    className="glass-card hover:glow-sm transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold">
                              {pub.title}
                            </h3>
                            {pub.journal && (
                              <>
                                <span className="text-muted-foreground">in</span>
                                <span className="text-primary font-medium">{pub.journal}</span>
                              </>
                            )}
                            {pub.conference && (
                              <>
                                <span className="text-muted-foreground">at</span>
                                <span className="text-indigo-400 font-medium">{pub.conference}</span>
                              </>
                            )}
                            {!pub.is_published && (
                              <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
                                Draft
                              </Badge>
                            )}
                            {pub.is_featured && (
                              <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500 bg-amber-500/10">
                                Featured
                              </Badge>
                            )}
                          </div>

                          <div className="text-sm font-medium text-muted-foreground">
                            {pub.authors}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            {pub.year && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Year: {pub.year}
                              </span>
                            )}
                            {pub.doi && (
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                DOI: {pub.doi}
                              </span>
                            )}
                            {pub.pdf_url && (
                              <a
                                href={pub.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-emerald-400 hover:underline"
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
                                className="flex items-center gap-0.5 text-primary hover:underline"
                              >
                                <LinkIcon className="w-3 h-3" />
                                URL
                              </a>
                            )}
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              Order: {pub.sort_order}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(pub)}
                            aria-label="Edit publication"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(pub.id)}
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
                  <BookOpen className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No academic publications added yet. Add your first publication entry!
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
                {view === "create" ? "Add Publication" : "Edit Publication"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Record a new academic article, journal, or book chapter."
                  : "Update publication details."}
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
                  placeholder="e.g. Deep Reinforcement Learning for Autonomous Drone Navigation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Subtitle / Tagline (Optional)</label>
                <Input
                  placeholder="e.g. A novel approach to sensor fusion and path planning"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
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
                <label className="text-sm font-semibold">Conference / Venue (Optional)</label>
                <Input
                  placeholder="e.g. NeurIPS 2024"
                  value={conference}
                  onChange={(e) => setConference(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Journal (Optional)</label>
                <Input
                  placeholder="e.g. Journal of Machine Learning Research"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Publisher (Optional)</label>
                <Input
                  placeholder="e.g. Springer, IEEE, ACM"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Year (Optional)</label>
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Publication Date (YYYY-MM-DD) (Optional)</label>
                <Input
                  placeholder="e.g. 2024-05-15"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">DOI (Digital Object Identifier) (Optional)</label>
                <Input
                  placeholder="e.g. 10.1109/TRO.2024.12345"
                  value={doi}
                  onChange={(e) => setDoi(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">URL / Link to Publisher Page</label>
                <Input
                  placeholder="e.g. https://doi.org/10.1109/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">PDF URL (Direct Link to Paper PDF)</label>
                <Input
                  placeholder="e.g. https://arxiv.org/pdf/..."
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
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

              {/* Switches */}
              <div className="flex gap-4 md:col-span-2 flex-wrap">
                <div className="flex items-center justify-between p-3 rounded-lg glass-card w-72">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Publish immediately</span>
                    <span className="text-[10px] text-muted-foreground">Drafts won't appear publicly.</span>
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

                <div className="flex items-center justify-between p-3 rounded-lg glass-card w-72">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Featured Publication</span>
                    <span className="text-[10px] text-muted-foreground">Promote to featured status.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isFeatured ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                        isFeatured ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Abstract / Summary</label>
                <Textarea
                  rows={4}
                  placeholder="Paste the abstract here..."
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">How to Cite (Standard text citation)</label>
                <Textarea
                  rows={2}
                  placeholder="e.g. Romim, R. (2024). Deep Reinforcement Learning. Journal of Agentic Coding."
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">BibTeX Citation Block</label>
                <Textarea
                  rows={4}
                  placeholder="@article{romim2024deep, ...}"
                  value={bibtex}
                  onChange={(e) => setBibtex(e.target.value)}
                  className="font-mono text-xs bg-background/50"
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
