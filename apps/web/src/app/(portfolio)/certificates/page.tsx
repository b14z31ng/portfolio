"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  Award,
  Search,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

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
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const data = await api.get<{ items: Certificate[] }>("/api/v1/certificates/public");
        setCertificates(data.items);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.credential_id && cert.credential_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-6xl mx-auto px-6">
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
                Certifications
              </h1>
              <p className="text-muted-foreground text-lg">
                My certified engineering credentials, professional courses, and skill validations.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
              />
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 space-y-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCertificates.length === 0 ? (
            <motion.div variants={staggerItem} className="text-center py-16 glass-card rounded-2xl p-8 max-w-lg mx-auto">
              <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No certificates found</h3>
              <p className="text-muted-foreground text-sm">
                Try refining your search query or check back later.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:glow-sm transition-all duration-300 text-left"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-snug">{cert.title}</h3>
                      <p className="text-sm text-primary font-semibold mt-1">{cert.provider}</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p className="flex items-center gap-1.5 font-medium">
                        <CalendarDays className="w-3.5 h-3.5" />
                        Issued: {cert.issue_date}
                      </p>
                      {cert.expiration_date && (
                        <p className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          Expires: {cert.expiration_date}
                        </p>
                      )}
                      {cert.credential_id && (
                        <p className="font-mono bg-muted/30 px-2 py-0.5 rounded inline-block">
                          ID: {cert.credential_id}
                        </p>
                      )}
                    </div>
                  </div>

                  {cert.credential_url && (
                    <div className="mt-6 border-t border-border/10 pt-4">
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        Verify Credential
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
