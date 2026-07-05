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
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export default function EducationAdminPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);

  // Form inputs
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM
  const [endDate, setEndDate] = useState(""); // YYYY-MM
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Educations ──
  const fetchEducations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: Education[]; total: number }>("/api/v1/education");
      setEducations(data.items);
    } catch (err) {
      setError("Failed to fetch education entries.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  // ── Reset Form ──
  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setSortOrder("0");
    setSelectedEdu(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (edu: Education) => {
    setSelectedEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.field_of_study || "");
    setStartDate(edu.start_date);
    setEndDate(edu.end_date || "");
    setIsCurrent(edu.is_current);
    setDescription(edu.description || "");
    setSortOrder(edu.sort_order.toString());
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (eduId: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/education/${eduId}`);
      setEducations((prev) => prev.filter((e) => e.id !== eduId));
      setSuccess("Education entry deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete education entry.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate.trim()) {
      setError("Institution, Degree, and Start Date are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      institution: institution.trim(),
      degree: degree.trim(),
      field_of_study: fieldOfStudy.trim() || null,
      start_date: startDate.trim(),
      end_date: isCurrent ? null : (endDate.trim() || null),
      is_current: isCurrent,
      description: description.trim() || null,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (view === "create") {
        const newEdu = await api.post<Education>("/api/v1/education", payload);
        setEducations((prev) => [...prev, newEdu].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Education entry created successfully!");
      } else if (view === "edit" && selectedEdu) {
        const updatedEdu = await api.patch<Education>(
          `/api/v1/education/${selectedEdu.id}`,
          payload
        );
        setEducations((prev) =>
          prev
            .map((p) => (p.id === selectedEdu.id ? updatedEdu : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Education entry updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save education entry."
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
                Education
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your academic credentials and degrees.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </motion.div>

          {/* Education list */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((edu) => (
                  <Card
                    key={edu.id}
                    className="glass-card hover:glow-sm transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold">
                              {edu.degree}
                              {edu.field_of_study && ` in ${edu.field_of_study}`}
                            </h3>
                            <span className="text-muted-foreground">at</span>
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <GraduationCap className="w-4 h-4" />
                              {edu.institution}
                            </div>
                            {edu.is_current && (
                              <Badge variant="default" className="text-[10px]">
                                Current
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {edu.start_date} — {edu.is_current ? "Present" : edu.end_date}
                            </span>
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              Order: {edu.sort_order}
                            </span>
                          </div>

                          {edu.description && (
                            <p className="text-sm text-muted-foreground max-w-3xl">
                              {edu.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(edu)}
                            aria-label="Edit education"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(edu.id)}
                            aria-label="Delete education"
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
                  <GraduationCap className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No academic credentials added yet. Add your first education entry!
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
                {view === "create" ? "Add Education Entry" : "Edit Education Entry"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Record a new academic achievement."
                  : "Update education entry details."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Degree / Certification *</label>
                <Input
                  required
                  placeholder="e.g. Bachelor of Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Institution / University *</label>
                <Input
                  required
                  placeholder="e.g. Stanford University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Field of Study</label>
                <Input
                  placeholder="e.g. Computer Science"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
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
                <label className="text-sm font-semibold">Start Date (YYYY-MM) *</label>
                <Input
                  required
                  placeholder="2019-09"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">End Date (YYYY-MM)</label>
                <Input
                  placeholder="2023-06"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCurrent}
                  className="bg-background/50"
                />
              </div>

              {/* Current Student Checkbox */}
              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg glass-card max-w-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">I currently study here</span>
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

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold">Description / Achievements</label>
                <Textarea
                  rows={4}
                  placeholder="e.g. Graduated with Honors. Specialization in Intelligent Systems..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                Save Education
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
