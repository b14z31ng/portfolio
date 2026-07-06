"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  Copy,
  Check,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
}

export default function PublicationDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  useEffect(() => {
    async function fetchPublication() {
      try {
        const data = await api.get<Publication>(`/api/v1/publications/public/${params.slug}`);
        setPublication(data);
      } catch (err) {
        console.error("Failed to fetch publication detail:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPublication();
  }, [params.slug]);

  const copyToClipboard = async (text: string, type: "bib" | "cite") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "bib") {
        setCopiedBibtex(true);
        setTimeout(() => setCopiedBibtex(false), 2000);
      } else {
        setCopiedCitation(true);
        setTimeout(() => setCopiedCitation(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  if (isLoading) {
    return (
      <main className="pt-28 pb-20 min-h-dvh">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <Skeleton className="h-6 w-20 rounded" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!publication) {
    return (
      <main className="pt-28 pb-20 min-h-dvh flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Publication Not Found</h2>
          <p className="text-muted-foreground">The publication you are looking for does not exist or has been unpublished.</p>
          <Link href="/publications">
            <Button variant="outline" className="glass-card gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Publications
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Back Button */}
          <motion.div variants={staggerItem}>
            <Link href="/publications" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Publications
            </Link>
          </motion.div>

          {/* Title & Header */}
          <motion.div variants={staggerItem} className="space-y-4 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              {publication.year && (
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none font-bold uppercase text-[10px]">
                  {publication.year}
                </Badge>
              )}
              {publication.conference && (
                <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-none font-semibold text-[10px]">
                  {publication.conference}
                </Badge>
              )}
              {publication.journal && (
                <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none font-semibold text-[10px]">
                  {publication.journal}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {publication.title}
            </h1>

            {publication.subtitle && (
              <p className="text-lg text-muted-foreground italic leading-normal">
                {publication.subtitle}
              </p>
            )}

            <p className="text-base text-primary/90 font-medium leading-relaxed">
              {publication.authors}
            </p>

            {/* Links and Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/10">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {publication.publisher && (
                  <>
                    <span>Publisher: <span className="font-semibold text-foreground/80">{publication.publisher}</span></span>
                    <span>•</span>
                  </>
                )}
                {publication.publication_date && (
                  <>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {publication.publication_date}
                    </span>
                    <span>•</span>
                  </>
                )}
                {publication.doi && (
                  <span className="font-mono">DOI: {publication.doi}</span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {publication.pdf_url && (
                  <a
                    href={publication.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Download PDF
                  </a>
                )}
                {publication.url && (
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Publisher Page
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Abstract */}
          {publication.abstract && (
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 space-y-3 text-left">
              <h3 className="text-lg font-bold text-foreground">Abstract</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {publication.abstract}
              </p>
            </motion.div>
          )}

          {/* Citation */}
          {publication.citation && (
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 space-y-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground">How to Cite</h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copyToClipboard(publication.citation || "", "cite")}
                  className="rounded-lg text-muted-foreground hover:text-foreground"
                >
                  {copiedCitation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm leading-normal font-medium bg-muted/20 p-4 rounded-xl border border-border/20">
                {publication.citation}
              </p>
            </motion.div>
          )}

          {/* BibTeX */}
          {publication.bibtex && (
            <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 space-y-3 text-left">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-foreground">BibTeX Citation</h3>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copyToClipboard(publication.bibtex || "", "bib")}
                  className="rounded-lg text-muted-foreground hover:text-foreground"
                >
                  {copiedBibtex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="text-xs text-muted-foreground font-mono bg-muted/20 p-4 rounded-xl border border-border/20 overflow-x-auto whitespace-pre">
                {publication.bibtex}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
