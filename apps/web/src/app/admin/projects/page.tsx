"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Star,
  GitFork,
  ExternalLink,
  Trash2,
  Check,
  Search,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Edit,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  banner_url?: string | null;
  github_url: string | null;
  live_url: string | null;
  stars: number;
  forks: number;
  language: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFetchingFull, setIsFetchingFull] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    banner_url: "",
    github_url: "",
    live_url: "",
    sort_order: 0,
    is_featured: false,
    is_published: false,
  });

  async function handleOpenEdit(project: Project) {
    setEditingProject(project);
    setIsFetchingFull(true);
    setFormData({
      title: project.title || "",
      summary: project.summary || "",
      description: "",
      banner_url: project.banner_url || "",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      sort_order: typeof project.sort_order === "number" ? project.sort_order : 0,
      is_featured: !!project.is_featured,
      is_published: !!project.is_published,
    });

    try {
      const fullProject = await api.get<any>(`/api/v1/projects/${project.id}`);
      setFormData({
        title: fullProject.title || "",
        summary: fullProject.summary || "",
        description: fullProject.description || "",
        banner_url: fullProject.banner_url || "",
        github_url: fullProject.github_url || "",
        live_url: fullProject.live_url || "",
        sort_order: typeof fullProject.sort_order === "number" ? fullProject.sort_order : 0,
        is_featured: !!fullProject.is_featured,
        is_published: !!fullProject.is_published,
      });
    } catch (err) {
      console.error("Failed to fetch full project details:", err);
    } finally {
      setIsFetchingFull(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    try {
      const updated = await api.patch<Project>(
        `/api/v1/projects/${editingProject.id}`,
        formData
      );
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...p, ...updated } : p))
      );
      setEditingProject(null);
    } catch (err) {
      console.error("Failed to save project updates:", err);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await api.post<{ url: string }>("/api/v1/media/upload", body);
      const fullUrl = res.url.startsWith("http")
        ? res.url
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${res.url}`;
      
      setFormData((prev) => ({
        ...prev,
        banner_url: fullUrl,
      }));
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  async function fetchProjects() {
    try {
      const data = await api.get<{ items: Project[] }>("/api/v1/projects");
      setProjects(data.items);
    } catch (err) {
      console.error("Failed to fetch admin projects:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleToggleField(id: string, field: "is_featured" | "is_published", currentVal: boolean) {
    setIsUpdating(id);
    try {
      const updated = await api.patch<Project>(`/api/v1/projects/${id}`, {
        [field]: !currentVal,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: updated[field] } : p))
      );
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleUpdateSortOrder(id: string, currentOrder: number, direction: "up" | "down") {
    const newOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;
    setIsUpdating(id);
    try {
      const updated = await api.patch<Project>(`/api/v1/projects/${id}`, {
        sort_order: newOrder,
      });
      setProjects((prev) =>
        prev
          .map((p) => (p.id === id ? { ...p, sort_order: updated.sort_order } : p))
          .sort((a, b) => a.sort_order - b.sort_order)
      );
    } catch (err) {
      console.error("Failed to update sort order:", err);
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    setIsUpdating(id);
    try {
      await api.delete(`/api/v1/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
    } finally {
      setIsUpdating(null);
    }
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.language && p.language.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Manager</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, publish, and order generated portfolio projects.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title or language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
      </div>

      {/* Projects list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="glass-card overflow-hidden hover:glow-sm transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base">{project.title}</h3>
                        {project.language && (
                          <Badge variant="outline" className="text-xs">
                            {project.language}
                          </Badge>
                        )}
                        {project.is_featured && (
                          <Badge className="bg-primary/20 text-primary text-[10px] glow-sm hover:bg-primary/30 border-primary/30">
                            Featured
                          </Badge>
                        )}
                        {project.is_published ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] border-emerald-500/30">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.summary}
                      </p>
                      {/* GitHub stats / Links */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        {project.stars > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                            {project.stars}
                          </span>
                        )}
                        {project.forks > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork className="w-3.5 h-3.5" />
                            {project.forks}
                          </span>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary flex items-center gap-0.5"
                          >
                            Repository
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary flex items-center gap-0.5 text-primary"
                          >
                            Live Demo
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      {/* Re-ordering */}
                      <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-lg border border-border/40">
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-4 w-4 p-0"
                            onClick={() => handleUpdateSortOrder(project.id, project.sort_order, "up")}
                            disabled={isUpdating !== null}
                            aria-label="Move Up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-4 w-4 p-0"
                            onClick={() => handleUpdateSortOrder(project.id, project.sort_order, "down")}
                            disabled={isUpdating !== null}
                            aria-label="Move Down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>
                        <Input
                          type="number"
                          value={project.sort_order ?? 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setProjects((prev) =>
                              prev.map((p) => (p.id === project.id ? { ...p, sort_order: isNaN(val) ? 0 : val } : p))
                            );
                          }}
                          onBlur={async (e) => {
                            const val = parseInt(e.target.value, 10);
                            const finalVal = isNaN(val) ? 0 : val;
                            setIsUpdating(project.id);
                            try {
                              const updated = await api.patch<Project>(`/api/v1/projects/${project.id}`, {
                                sort_order: finalVal,
                              });
                              setProjects((prev) =>
                                prev
                                  .map((p) => (p.id === project.id ? { ...p, sort_order: updated.sort_order } : p))
                                  .sort((a, b) => a.sort_order - b.sort_order)
                              );
                            } catch (err) {
                              console.error("Failed to update sort order:", err);
                            } finally {
                              setIsUpdating(null);
                            }
                          }}
                          className="w-12 h-7 text-center text-xs p-0 bg-transparent border-none font-mono focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                          title="Display order (lower values show first)"
                        />
                      </div>

                      {/* Edit project details */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs flex items-center gap-1"
                        onClick={() => handleOpenEdit(project)}
                        disabled={isUpdating !== null}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>

                      {/* Feature toggle */}
                      <Button
                        variant={project.is_featured ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleToggleField(project.id, "is_featured", project.is_featured)}
                        disabled={isUpdating !== null}
                      >
                        Feature
                      </Button>

                      {/* Publish toggle */}
                      <Button
                        variant={project.is_published ? "outline" : "default"}
                        size="sm"
                        className="text-xs"
                        onClick={() => handleToggleField(project.id, "is_published", project.is_published)}
                        disabled={isUpdating !== null}
                      >
                        {project.is_published ? "Unpublish" : "Publish"}
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(project.id)}
                        disabled={isUpdating !== null}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Layers className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search
                ? "Try clearing or modifying your search text."
                : "No projects synced from GitHub yet. Go to GitHub Sync to import and generate projects."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProject}
        onOpenChange={(open) => !open && setEditingProject(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border border-border/40 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Edit Project Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Customize descriptions, summary, image, display order, and live demo links.
            </DialogDescription>
          </DialogHeader>

          {isFetchingFull ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading project details...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
              {/* Title & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Title</label>
                  <Input
                    value={formData.title ?? ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={formData.sort_order ?? 0}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                    required
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Summary</label>
                <Textarea
                  value={formData.summary ?? ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Short project overview (shown in cards)"
                  rows={2}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">Description (Markdown)</label>
                  <span className="text-[10px] text-muted-foreground italic font-normal">Overwrites full README if customized</span>
                </div>
                <Textarea
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive description (shown on details page)"
                  rows={6}
                />
              </div>

              {/* Image Upload / URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Banner Image URL</label>
                  <Input
                    value={formData.banner_url ?? ""}
                    onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="flex h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-semibold file:bg-primary/10 file:text-primary file:hover:bg-primary/20 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 cursor-pointer"
                    />
                    {isUploading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Github URL & Live Demo Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">GitHub URL</label>
                  <Input
                    value={formData.github_url ?? ""}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Live Link (Demo)</label>
                  <Input
                    value={formData.live_url ?? ""}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://demo-app.com"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-6 items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-border/40 text-primary focus:ring-primary/30 h-4 w-4 bg-muted/20"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Featured Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-border/40 text-primary focus:ring-primary/30 h-4 w-4 bg-muted/20"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Publish immediately</span>
                </label>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProject(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isUploading} className="glow-sm">
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
