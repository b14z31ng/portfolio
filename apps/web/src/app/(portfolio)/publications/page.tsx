"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CalendarDays,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
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
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openPubId, setOpenPubId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPublications() {
      try {
        const data = await api.get<{ items: Publication[] }>("/api/v1/publications/public");
        setPublications(data.items);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPublications();
  }, []);

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pub.conference && pub.conference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pub.journal && pub.journal.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={staggerItem} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Publications
              </h1>
              <p className="text-muted-foreground text-lg">
                My scientific contributions, conference articles, and papers.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : filteredPublications.length === 0 ? (
            <motion.div variants={staggerItem} className="text-center py-16 glass-card rounded-2xl p-8 max-w-lg mx-auto">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No publications found</h3>
              <p className="text-muted-foreground text-sm">
                Try refining your search query or check back later.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredPublications.map((pub) => (
                <motion.div
                  key={pub.id}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300 text-left relative overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {pub.year && (
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none font-bold uppercase text-[10px]">
                            {pub.year}
                          </Badge>
                        )}
                        {pub.conference && (
                          <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-none font-semibold text-[10px]">
                            {pub.conference}
                          </Badge>
                        )}
                        {pub.journal && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-none font-semibold text-[10px]">
                            {pub.journal}
                          </Badge>
                        )}
                        {pub.is_featured && (
                          <Badge className="bg-amber-500/10 text-amber-400 border-none font-semibold text-[10px]">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <Link href={`/publications/${pub.slug}`} className="block group/title">
                        <h3 className="text-xl font-bold text-foreground leading-snug group-hover/title:text-primary transition-colors flex items-center gap-1.5">
                          {pub.title}
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover/title:text-primary group-hover/title:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                        </h3>
                      </Link>

                      {pub.subtitle && <p className="text-sm text-muted-foreground italic">{pub.subtitle}</p>}
                      <p className="text-sm text-primary/80 font-medium">{pub.authors}</p>
                      
                      {pub.publisher && (
                        <span className="text-xs text-muted-foreground block mt-1">
                          Publisher: <span className="font-semibold text-muted-foreground/80">{pub.publisher}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start flex-wrap">
                      {pub.pdf_url && (
                        <a
                          href={pub.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-colors"
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                      )}
                      {pub.abstract && (
                        <button
                          onClick={() => setOpenPubId(openPubId === pub.id ? null : pub.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 font-semibold transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {openPubId === pub.id ? "Hide Abstract" : "Read Abstract"}
                          {openPubId === pub.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {pub.abstract && openPubId === pub.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-border/10 text-sm text-muted-foreground leading-relaxed overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="font-semibold text-foreground mb-1">Abstract</h4>
                        <p>{pub.abstract}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
