"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Research {
  id: string;
  title: string;
  authors: string;
  journal: string;
  doi: string | null;
  url: string | null;
  published_date: string;
  abstract: string | null;
  is_published: boolean;
  sort_order: number;
}

export default function ResearchPage() {
  const [researchList, setResearchList] = useState<Research[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openResearchId, setOpenResearchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchResearch() {
      try {
        const data = await api.get<{ items: Research[] }>("/api/v1/research/public");
        setResearchList(data.items);
      } catch (err) {
        console.error("Failed to fetch research:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResearch();
  }, []);

  const filteredResearch = researchList.filter(
    (res) =>
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.journal.toLowerCase().includes(searchQuery.toLowerCase())
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
                Research & Innovations
              </h1>
              <p className="text-muted-foreground text-lg">
                My contributions to scientific and technical research papers.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search research..."
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
          ) : filteredResearch.length === 0 ? (
            <motion.div variants={staggerItem} className="text-center py-16 glass-card rounded-2xl p-8 max-w-lg mx-auto">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No research found</h3>
              <p className="text-muted-foreground text-sm">
                Try refining your search query or check back later.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredResearch.map((res) => (
                <motion.div
                  key={res.id}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 hover:glow-sm transition-all duration-300 text-left"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground leading-snug">{res.title}</h3>
                      <p className="text-sm text-primary font-medium">{res.authors}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-semibold text-muted-foreground/80">{res.journal}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {res.published_date}
                        </span>
                        {res.doi && (
                          <>
                            <span>•</span>
                            <span className="font-mono">DOI: {res.doi}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start">
                      {res.url && (
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Paper
                        </a>
                      )}
                      {res.abstract && (
                        <button
                          onClick={() => setOpenResearchId(openResearchId === res.id ? null : res.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 font-semibold transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {openResearchId === res.id ? "Hide Abstract" : "Read Abstract"}
                          {openResearchId === res.id ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {res.abstract && openResearchId === res.id && (
                      <motion.div
                        className="mt-4 pt-4 border-t border-border/10 text-sm text-muted-foreground leading-relaxed overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <h4 className="font-semibold text-foreground mb-1">Abstract</h4>
                        <p>{res.abstract}</p>
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
