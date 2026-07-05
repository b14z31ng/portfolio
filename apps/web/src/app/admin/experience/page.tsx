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
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Briefcase,
  Building2,
  MapPin,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

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
  created_at: string;
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  // Form inputs
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [achievementsInput, setAchievementsInput] = useState(""); // One per line
  const [technologiesInput, setTechnologiesInput] = useState(""); // Comma separated
  const [startDate, setStartDate] = useState(""); // YYYY-MM
  const [endDate, setEndDate] = useState(""); // YYYY-MM
  const [isCurrent, setIsCurrent] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Experiences ──
  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: Experience[]; total: number }>("/api/v1/experience");
      setExperiences(data.items);
    } catch (err) {
      setError("Failed to fetch experience entries.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // ── Reset Form ──
  const resetForm = () => {
    setCompany("");
    setCompanyUrl("");
    setRole("");
    setLocation("");
    setDescription("");
    setAchievementsInput("");
    setTechnologiesInput("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setSortOrder("0");
    setSelectedExp(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (exp: Experience) => {
    setSelectedExp(exp);
    setCompany(exp.company);
    setCompanyUrl(exp.company_url || "");
    setRole(exp.role);
    setLocation(exp.location || "");
    setDescription(exp.description || "");
    setAchievementsInput(exp.achievements.join("\n"));
    setTechnologiesInput(exp.technologies.join(", "));
    setStartDate(exp.start_date);
    setEndDate(exp.end_date || "");
    setIsCurrent(exp.is_current);
    setSortOrder(exp.sort_order.toString());
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (expId: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/experience/${expId}`);
      setExperiences((prev) => prev.filter((e) => e.id !== expId));
      setSuccess("Experience entry deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete experience entry.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      setError("Company, Role, and Start Date are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const parsedAchievements = achievementsInput
      .split("\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const parsedTechnologies = technologiesInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      company: company.trim(),
      company_url: companyUrl.trim() || null,
      role: role.trim(),
      location: location.trim() || null,
      description: description.trim() || null,
      achievements: parsedAchievements,
      technologies: parsedTechnologies,
      start_date: startDate.trim(),
      end_date: isCurrent ? null : (endDate.trim() || null),
      is_current: isCurrent,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (view === "create") {
        const newExp = await api.post<Experience>("/api/v1/experience", payload);
        setExperiences((prev) => [...prev, newExp].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Experience entry created successfully!");
      } else if (view === "edit" && selectedExp) {
        const updatedExp = await api.patch<Experience>(
          `/api/v1/experience/${selectedExp.id}`,
          payload
        );
        setExperiences((prev) =>
          prev
            .map((p) => (p.id === selectedExp.id ? updatedExp : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Experience entry updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save experience entry."
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
                Work Experience
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your professional career timeline items.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </motion.div>

          {/* Experience list */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <Card
                    key={exp.id}
                    className="glass-card hover:glow-sm transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold">{exp.role}</h3>
                            <span className="text-muted-foreground">@</span>
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <Building2 className="w-4 h-4" />
                              {exp.company_url ? (
                                <a
                                  href={exp.company_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-0.5"
                                >
                                  {exp.company}
                                  <Link2 className="w-3 h-3" />
                                </a>
                              ) : (
                                exp.company
                              )}
                            </div>
                            {exp.is_current && (
                              <Badge variant="default" className="text-[10px]">
                                Current
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                            </span>
                            {exp.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {exp.location}
                              </span>
                            )}
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              Order: {exp.sort_order}
                            </span>
                          </div>

                          {exp.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl">
                              {exp.description}
                            </p>
                          )}

                          {/* Technologies */}
                          {exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {exp.technologies.map((t) => (
                                <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(exp)}
                            aria-label="Edit experience"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(exp.id)}
                            aria-label="Delete experience"
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
                  <Briefcase className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No work experiences added yet. Add your first job entry!
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
                {view === "create" ? "Add Work Experience" : "Edit Work Experience"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Record a new career milestone."
                  : "Update experience entry details."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Role / Title *</label>
                <Input
                  required
                  placeholder="e.g. Senior Software Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Company Name *</label>
                <Input
                  required
                  placeholder="e.g. Google"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Company Website URL</label>
                <Input
                  placeholder="https://google.com"
                  value={companyUrl}
                  onChange={(e) => setCompanyUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Location</label>
                <Input
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Start Date (YYYY-MM) *</label>
                <Input
                  required
                  placeholder="2023-01"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">End Date (YYYY-MM)</label>
                <Input
                  placeholder="2024-05"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrent}
                  className="bg-background/50"
                />
              </div>

              {/* Current Job Checkbox */}
              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg glass-card max-w-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">I currently work here</span>
                  <span className="text-[10px] text-muted-foreground">
                    Sets end date to "Present".
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCurrent(!isCurrent)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCurrent ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      isCurrent ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
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

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea
                  rows={3}
                  placeholder="Brief overview of your role..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Key Achievements (one per line)</label>
                <Textarea
                  rows={4}
                  placeholder="Led a team of 4 engineers to rebuild the app.&#10;Decreased build times by 35% using Turborepo."
                  value={achievementsInput}
                  onChange={(e) => setAchievementsInput(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Technologies (comma-separated)</label>
                <Input
                  placeholder="React, Next.js, Node.js, Postgres, AWS"
                  value={technologiesInput}
                  onChange={(e) => setTechnologiesInput(e.target.value)}
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
                Save Experience
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
