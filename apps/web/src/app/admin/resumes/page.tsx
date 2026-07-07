"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit, Trash2, ArrowLeft, Check, Loader2, Sparkles, AlertCircle,
  FileText, Upload, Download, Eye, Printer, Search, Star, StarOff,
  Power, PowerOff, Clock, HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getApiBaseUrl } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Resume {
  id: string; title: string; description: string | null; version: string | null;
  file_url: string; file_name: string; thumbnail_url: string | null;
  file_size: number; mime_type: string; is_active: boolean; is_featured: boolean;
  display_order: number; created_by: string | null; updated_by: string | null;
  created_at: string; updated_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ResumesAdminPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all"|"active"|"inactive"|"featured">("all");
  const [view, setView] = useState<"list"|"edit">("list");
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchResumes = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const data = await api.get<{ items: Resume[]; total: number }>("/api/v1/resumes");
      setResumes(data.items);
    } catch { setError("Failed to fetch resumes."); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const filteredResumes = resumes.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || r.title.toLowerCase().includes(q) || r.file_name.toLowerCase().includes(q);
    const matchesFilter = filterStatus === "all" || (filterStatus === "active" && r.is_active) || (filterStatus === "inactive" && !r.is_active) || (filterStatus === "featured" && r.is_featured);
    return matchesSearch && matchesFilter;
  });

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true); setError(null); setSuccess(null);
    const formData = new FormData(); formData.append("file", uploadFile);
    try {
      const newResume = await api.post<Resume>("/api/v1/resumes", formData);
      setResumes((prev) => [...prev, newResume]); setUploadFile(null);
      setSuccess("Resume uploaded successfully!"); setTimeout(() => setSuccess(null), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to upload resume."); }
    finally { setIsUploading(false); }
  };

  const handleEditClick = (resume: Resume) => {
    setSelectedResume(resume); setTitle(resume.title);
    setDescription(resume.description || ""); setVersion(resume.version || "");
    setDisplayOrder(resume.display_order.toString()); setError(null); setView("edit");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume || !title.trim()) { setError("Title is required."); return; }
    setIsSubmitting(true); setError(null); setSuccess(null);
    try {
      const updated = await api.patch<Resume>(`/api/v1/resumes/${selectedResume.id}`, {
        title: title.trim(), description: description.trim() || null,
        version: version.trim() || null, display_order: parseInt(displayOrder) || 0,
      });
      setResumes((prev) => prev.map((r) => (r.id === selectedResume.id ? updated : r)).sort((a, b) => a.display_order - b.display_order));
      setSuccess("Resume updated!"); setView("list"); setSelectedResume(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to update."); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try { await api.delete(`/api/v1/resumes/${id}`); setResumes((prev) => prev.filter((r) => r.id !== id)); setSuccess("Resume deleted."); setTimeout(() => setSuccess(null), 3000); }
    catch { setError("Failed to delete resume."); }
  };

  const handleActivate = async (id: string) => {
    try { const u = await api.post<Resume>(`/api/v1/resumes/${id}/activate`); setResumes((prev) => prev.map((r) => r.id === id ? u : { ...r, is_active: false })); setSuccess("Resume activated!"); setTimeout(() => setSuccess(null), 3000); }
    catch { setError("Failed to activate."); }
  };

  const handleDeactivate = async (id: string) => {
    try { const u = await api.post<Resume>(`/api/v1/resumes/${id}/deactivate`); setResumes((prev) => prev.map((r) => r.id === id ? u : r)); setSuccess("Resume deactivated."); setTimeout(() => setSuccess(null), 3000); }
    catch { setError("Failed to deactivate."); }
  };

  const handleToggleFeature = async (id: string, featured: boolean) => {
    try { const u = await api.post<Resume>(`/api/v1/resumes/${id}/${featured ? "unfeature" : "feature"}`); setResumes((prev) => prev.map((r) => r.id === id ? u : r)); setSuccess(featured ? "Unfeatured." : "Featured!"); setTimeout(() => setSuccess(null), 3000); }
    catch { setError("Failed to update featured status."); }
  };

  const handlePrint = (url: string) => { const w = window.open(url, "_blank"); if (w) w.addEventListener("load", () => w.print()); };
  const activeResume = resumes.find((r) => r.is_active);
  const apiBase = getApiBaseUrl();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <AnimatePresence>
        {success && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20"><Sparkles className="w-4 h-4 shrink-0" /><span>{success}</span></motion.div>)}
        {error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></motion.div>)}
      </AnimatePresence>

      {view === "list" ? (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Resume Management</h1><p className="text-muted-foreground mt-1 text-sm">Upload, manage, and activate your resume/CV documents.</p></div>
          </motion.div>

          {activeResume && (<motion.div variants={staggerItem}><Card className="glass-card border-primary/20 glow-sm"><CardContent className="p-4 flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-primary" /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-primary">Currently Active Resume</p><p className="text-xs text-muted-foreground truncate">{activeResume.title}{activeResume.version && ` · ${activeResume.version}`} · {formatFileSize(activeResume.file_size)}</p></div><Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge></CardContent></Card></motion.div>)}

          <motion.div variants={staggerItem}><Card className="glass-card"><CardContent className="p-6"><h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Upload className="w-4 h-4 text-primary" />Upload New Resume</h3><div className="flex flex-col sm:flex-row items-start sm:items-end gap-4"><div className="flex-1 w-full"><input type="file" accept=".pdf,application/pdf" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" /><p className="text-[10px] text-muted-foreground mt-1">PDF only, max 10 MB</p></div><Button onClick={handleUpload} disabled={!uploadFile || isUploading} className="glow-sm gap-2 shrink-0">{isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}Upload</Button></div></CardContent></Card></motion.div>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search resumes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background/50" /></div>
            <div className="flex gap-2">{(["all","active","inactive","featured"] as const).map((f) => (<button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${filterStatus === f ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-accent/50 border border-transparent"}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>))}</div>
          </motion.div>

          <motion.div variants={staggerItem}>
            {isLoading ? (<div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-24 rounded-xl" />))}</div>
            ) : filteredResumes.length > 0 ? (
              <div className="space-y-3">{filteredResumes.map((resume) => (
                <Card key={resume.id} className={`glass-card hover:glow-sm transition-all duration-300 ${resume.is_active ? "border-primary/20" : ""}`}>
                  <CardContent className="p-5"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><FileText className="w-5 h-5 text-primary" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap"><h3 className="text-sm font-bold truncate">{resume.title}</h3>{resume.is_active && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Active</Badge>}{resume.is_featured && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">★ Featured</Badge>}</div>
                        {resume.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{resume.description}</p>}
                        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground flex-wrap">
                          {resume.version && <span className="bg-muted px-1.5 py-0.5 rounded">{resume.version}</span>}
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{formatFileSize(resume.file_size)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(resume.created_at).toLocaleDateString()}</span>
                          <span className="bg-muted px-1.5 py-0.5 rounded">Order: {resume.display_order}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {resume.is_active ? (<Button variant="ghost" size="icon-sm" onClick={() => handleDeactivate(resume.id)} title="Deactivate" className="text-emerald-400 hover:bg-emerald-500/10"><Power className="w-4 h-4" /></Button>) : (<Button variant="ghost" size="icon-sm" onClick={() => handleActivate(resume.id)} title="Activate" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"><PowerOff className="w-4 h-4" /></Button>)}
                      <Button variant="ghost" size="icon-sm" onClick={() => handleToggleFeature(resume.id, resume.is_featured)} title={resume.is_featured ? "Unfeature" : "Feature"} className={resume.is_featured ? "text-amber-400 hover:bg-amber-500/10" : "text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10"}>{resume.is_featured ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}</Button>
                      <a href={`${apiBase}/api/v1/resumes/${resume.id}/pdf`} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon-sm" title="Preview"><Eye className="w-4 h-4" /></Button></a>
                      <a href={`${apiBase}/api/v1/resumes/${resume.id}/pdf?download=true`} download><Button variant="ghost" size="icon-sm" title="Download"><Download className="w-4 h-4" /></Button></a>
                      <Button variant="ghost" size="icon-sm" onClick={() => handlePrint(`${apiBase}/api/v1/resumes/${resume.id}/pdf`)} title="Print"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEditClick(resume)} title="Edit"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(resume.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div></CardContent>
                </Card>
              ))}</div>
            ) : (
              <Card className="glass-card"><CardContent className="flex flex-col items-center justify-center py-12 text-center"><FileText className="w-8 h-8 text-muted-foreground mb-3" /><p className="text-sm text-muted-foreground">{searchQuery || filterStatus !== "all" ? "No resumes match your filter." : "No resumes uploaded yet."}</p></CardContent></Card>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => setView("list")}><ArrowLeft className="w-5 h-5" /></Button><div><h1 className="text-2xl font-bold tracking-tight">Edit Resume</h1><p className="text-muted-foreground text-sm mt-0.5">Update resume details.</p></div></div>
          <form onSubmit={handleUpdate} className="space-y-6 max-w-4xl glass-card rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-sm font-semibold">Title *</label><Input required placeholder="Software Engineer Resume" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-background/50" /></div>
              <div className="space-y-2"><label className="text-sm font-semibold">Version</label><Input placeholder="v2.1, Summer 2026" value={version} onChange={(e) => setVersion(e.target.value)} className="bg-background/50" /></div>
              <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold">Description</label><Textarea rows={3} placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} className="bg-background/50" /></div>
              <div className="space-y-2"><label className="text-sm font-semibold">Display Order</label><Input type="number" placeholder="0" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} className="bg-background/50" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => setView("list")} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="glow-sm">{isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}Save Changes</Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
