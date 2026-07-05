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
  Award,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Certificate {
  id: string;
  title: string;
  provider: string;
  credential_id: string | null;
  credential_url: string | null;
  issue_date: string;
  expiration_date: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form view state: "list" | "create" | "edit"
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [issueDate, setIssueDate] = useState(""); // YYYY-MM
  const [expirationDate, setExpirationDate] = useState(""); // YYYY-MM
  const [hasNoExpiration, setHasNoExpiration] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch Certificates ──
  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ items: Certificate[]; total: number }>("/api/v1/certificates");
      setCertificates(data.items);
    } catch {
      setError("Failed to fetch certifications.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCertificates();
  }, [fetchCertificates]);

  // ── Reset Form ──
  const resetForm = () => {
    setTitle("");
    setProvider("");
    setCredentialId("");
    setCredentialUrl("");
    setIssueDate("");
    setExpirationDate("");
    setHasNoExpiration(true);
    setIsActive(true);
    setSortOrder("0");
    setSelectedCert(null);
    setError(null);
  };

  // ── Handle Create Click ──
  const handleCreateClick = () => {
    resetForm();
    setView("create");
  };

  // ── Handle Edit Click ──
  const handleEditClick = (cert: Certificate) => {
    setSelectedCert(cert);
    setTitle(cert.title);
    setProvider(cert.provider);
    setCredentialId(cert.credential_id || "");
    setCredentialUrl(cert.credential_url || "");
    setIssueDate(cert.issue_date);
    setExpirationDate(cert.expiration_date || "");
    setHasNoExpiration(!cert.expiration_date);
    setIsActive(cert.is_active);
    setSortOrder(cert.sort_order.toString());
    setError(null);
    setView("edit");
  };

  // ── Handle Delete ──
  const handleDelete = async (certId: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/api/v1/certificates/${certId}`);
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      setSuccess("Certificate deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to delete certificate.");
    }
  };

  // ── Handle Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim() || !issueDate.trim()) {
      setError("Title, Provider, and Issue Date are required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: title.trim(),
      provider: provider.trim(),
      credential_id: credentialId.trim() || null,
      credential_url: credentialUrl.trim() || null,
      issue_date: issueDate.trim(),
      expiration_date: hasNoExpiration ? null : (expirationDate.trim() || null),
      is_active: isActive,
      sort_order: parseInt(sortOrder) || 0,
    };

    try {
      if (view === "create") {
        const newCert = await api.post<Certificate>("/api/v1/certificates", payload);
        setCertificates((prev) => [...prev, newCert].sort((a, b) => a.sort_order - b.sort_order));
        setSuccess("Certificate created successfully!");
      } else if (view === "edit" && selectedCert) {
        const updatedCert = await api.patch<Certificate>(
          `/api/v1/certificates/${selectedCert.id}`,
          payload
        );
        setCertificates((prev) =>
          prev
            .map((p) => (p.id === selectedCert.id ? updatedCert : p))
            .sort((a, b) => a.sort_order - b.sort_order)
        );
        setSuccess("Certificate updated successfully!");
      }
      setView("list");
      resetForm();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save certificate."
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
                Certifications
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your professional certificates, badges, and verified credentials.
              </p>
            </div>
            <Button onClick={handleCreateClick} className="glow-sm shrink-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </motion.div>

          {/* Certificates list */}
          <motion.div variants={staggerItem}>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <Card
                    key={cert.id}
                    className="glass-card hover:glow-sm transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold">
                              {cert.title}
                            </h3>
                            <span className="text-muted-foreground">from</span>
                            <div className="flex items-center gap-1 text-primary font-medium">
                              <ShieldCheck className="w-4 h-4" />
                              {cert.provider}
                            </div>
                            {!cert.is_active && (
                              <Badge variant="outline" className="text-[10px] border-yellow-500/30 text-yellow-500 bg-yellow-500/10">
                                Inactive
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Issued: {cert.issue_date} {cert.expiration_date ? `— Expires: ${cert.expiration_date}` : "(No Expiration)"}
                            </span>
                            {cert.credential_id && (
                              <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                                ID: {cert.credential_id}
                              </span>
                            )}
                            {cert.credential_url && (
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-0.5 text-primary hover:underline"
                              >
                                <LinkIcon className="w-3 h-3" />
                                Verify
                              </a>
                            )}
                            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                              Order: {cert.sort_order}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditClick(cert)}
                            aria-label="Edit certificate"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(cert.id)}
                            aria-label="Delete certificate"
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
                  <Award className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No certifications added yet. Add your first certificate!
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
                {view === "create" ? "Add Certification" : "Edit Certification"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {view === "create"
                  ? "Record a new professional qualification or badge."
                  : "Update certification details."}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Certificate Name *</label>
                <Input
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Issuing Organization / Provider *</label>
                <Input
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Credential ID</label>
                <Input
                  placeholder="e.g. AWS-1234567"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Credential URL</label>
                <Input
                  placeholder="e.g. https://www.credly.com/..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Issue Date (YYYY-MM) *</label>
                <Input
                  required
                  placeholder="2023-06"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Expiration Date (YYYY-MM)</label>
                <Input
                  placeholder="2026-06"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  disabled={hasNoExpiration}
                  className="bg-background/50"
                />
              </div>

              {/* No Expiration Switch */}
              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg glass-card max-w-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">This credential does not expire</span>
                  <span className="text-[10px] text-muted-foreground">
                    Disables the expiration date field.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasNoExpiration(!hasNoExpiration)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasNoExpiration ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      hasNoExpiration ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Active Switch */}
              <div className="md:col-span-2 flex items-center justify-between p-3 rounded-lg glass-card max-w-sm">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Active</span>
                  <span className="text-[10px] text-muted-foreground">
                    Display this certificate in your public profile.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-5" : "translate-x-0"
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
                Save Certificate
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
