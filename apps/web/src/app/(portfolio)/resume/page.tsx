"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Download, Eye, Printer, Star, Clock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Resume {
  id: string; title: string; description: string | null; version: string | null;
  file_url: string; file_name: string; file_size: number; is_active: boolean;
  is_featured: boolean; display_order: number; created_at: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResumes() {
      try {
        const data = await api.get<{ items: Resume[]; total: number }>("/api/v1/resumes/public");
        setResumes(data.items);
      } catch (err) { console.error("Failed to fetch resumes:", err); }
      finally { setIsLoading(false); }
    }
    fetchResumes();
  }, []);

  const handlePrint = (url: string) => {
    const w = window.open(url, "_blank");
    if (w) w.addEventListener("load", () => w.print());
  };

  return (
    <main className="relative flex-1 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Resume / CV</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Download or preview my latest resume. Always up to date.</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">{Array.from({ length: 2 }).map((_, i) => (<Skeleton key={i} className="h-32 rounded-xl" />))}</div>
        ) : resumes.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resume Coming Soon</h3>
            <p className="text-muted-foreground text-sm">My resume is being updated. Check back soon!</p>
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            {resumes.map((resume) => (
              <motion.div key={resume.id} variants={staggerItem}>
                <Card className="glass-card hover:glow-sm transition-all duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h2 className="text-lg font-bold">{resume.title}</h2>
                            {resume.is_featured && (<Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">★ Featured</Badge>)}
                          </div>
                          {resume.version && (<p className="text-sm text-primary font-medium mb-1">{resume.version}</p>)}
                          {resume.description && (<p className="text-sm text-muted-foreground mb-3">{resume.description}</p>)}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" />{formatFileSize(resume.file_size)}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(resume.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/resume/${resume.id}`}>
                          <Button variant="outline" className="glass-card gap-2"><Eye className="w-4 h-4" />Preview</Button>
                        </Link>
                        <a href={resume.file_url} download>
                          <Button className="glow-sm gap-2"><Download className="w-4 h-4" />Download</Button>
                        </a>
                        <Button variant="outline" className="glass-card gap-2" onClick={() => handlePrint(resume.file_url)}>
                          <Printer className="w-4 h-4" />Print
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
