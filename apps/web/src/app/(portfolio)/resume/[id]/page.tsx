"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download, Printer, FileText, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, getApiBaseUrl } from "@/lib/api";

interface Resume {
  id: string; title: string; description: string | null; version: string | null;
  file_url: string; file_name: string; file_size: number; is_active: boolean;
  is_featured: boolean; created_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ResumeViewPage() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const data = await api.get<Resume>(`/api/v1/resumes/${params.id}`);
        setResume(data);
      } catch { setError("Resume not found."); }
      finally { setIsLoading(false); }
    }
    if (params.id) fetchResume();
  }, [params.id]);

  const apiBase = getApiBaseUrl();

  const handlePrint = () => {
    if (!resume) return;
    const w = window.open(`${apiBase}/api/v1/resumes/${resume.id}/pdf`, "_blank");
    if (w) w.addEventListener("load", () => w.print());
  };

  if (isLoading) {
    return (
      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        <Skeleton className="h-10 w-48 mb-6 rounded-lg" />
        <Skeleton className="h-[70vh] rounded-xl" />
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6 text-center">
        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Resume Not Found</h2>
        <p className="text-muted-foreground mb-6">The resume you're looking for doesn't exist or has been removed.</p>
        <Link href="/resume"><Button variant="outline" className="glass-card gap-2"><ArrowLeft className="w-4 h-4" />Back to Resumes</Button></Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href="/resume"><Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="w-5 h-5" /></Button></Link>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{resume.title}</h1>
                  {resume.is_featured && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">★ Featured</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                  {resume.version && <span className="text-primary font-medium">{resume.version}</span>}
                  <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{formatFileSize(resume.file_size)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(resume.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`${apiBase}/api/v1/resumes/${resume.id}/pdf?download=true`} download><Button className="glow-sm gap-2"><Download className="w-4 h-4" />Download</Button></a>
              <Button variant="outline" className="glass-card gap-2" onClick={handlePrint}><Printer className="w-4 h-4" />Print</Button>
            </div>
          </div>

          {resume.description && <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{resume.description}</p>}

          {/* Embedded PDF Viewer */}
          <div className="glass-card rounded-2xl overflow-hidden border border-border/50" style={{ height: "80vh" }}>
            <iframe src={`${apiBase}/api/v1/resumes/${resume.id}/pdf`} className="w-full h-full" title={resume.title} />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
