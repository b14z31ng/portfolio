"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CalendarDays,
  MapPin,
  GraduationCap,
  Sparkles,
  Link2,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

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
}

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
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [expData, eduData] = await Promise.all([
          api.get<{ items: Experience[] }>("/api/v1/experience/public"),
          api.get<{ items: Education[] }>("/api/v1/education/public"),
        ]);
        setExperiences(expData.items);
        setEducations(eduData.items);
      } catch (err) {
        console.error("Failed to load timeline details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={staggerItem}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Career & Education
            </h1>
            <p className="text-muted-foreground text-lg">
              My professional journey, roles, and academic milestones.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-10 w-48 rounded-lg" />
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Work Experience Section */}
              <div className="space-y-8">
                <motion.h2
                  variants={staggerItem}
                  className="text-xl sm:text-2xl font-bold flex items-center gap-2"
                >
                  <Briefcase className="w-5 h-5 text-primary" />
                  Professional Journey
                </motion.h2>

                {experiences.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden sm:block" />

                    <div className="space-y-8">
                      {experiences.map((exp) => (
                        <motion.div
                          key={exp.id}
                          variants={staggerItem}
                          className="relative flex gap-6"
                        >
                          {/* Dot */}
                          <div className="hidden sm:flex shrink-0 w-10 pt-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                exp.is_current
                                  ? "bg-primary/20 ring-2 ring-primary glow-sm"
                                  : "bg-muted"
                              }`}
                            >
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                          </div>

                          {/* Card */}
                          <div className="flex-1 glass-card rounded-xl p-6 hover:glow-sm transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold">{exp.role}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <Building2 className="w-3.5 h-3.5" />
                                  {exp.company_url ? (
                                    <a
                                      href={exp.company_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline flex items-center gap-0.5 text-primary"
                                    >
                                      {exp.company}
                                      <Link2 className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    exp.company
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 mt-1 sm:mt-0">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                                {exp.location && (
                                  <>
                                    <span className="mx-1">•</span>
                                    <MapPin className="w-3 h-3" />
                                    {exp.location}
                                  </>
                                )}
                              </div>
                            </div>

                            {exp.description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {exp.description}
                              </p>
                            )}

                            {/* Achievements */}
                            {exp.achievements.length > 0 && (
                              <ul className="space-y-1.5 mb-4">
                                {exp.achievements.map((a, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <span className="text-primary mt-1.5">•</span>
                                    {a}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Technologies */}
                            {exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {exp.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-0.5 text-[10px] rounded-md bg-secondary text-secondary-foreground font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.p variants={staggerItem} className="text-sm text-muted-foreground pl-4">
                    No experience records published yet.
                  </motion.p>
                )}
              </div>

              {/* Education Section */}
              <div className="space-y-8 pt-6">
                <motion.h2
                  variants={staggerItem}
                  className="text-xl sm:text-2xl font-bold flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Academic Milestones
                </motion.h2>

                {educations.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border hidden sm:block" />

                    <div className="space-y-8">
                      {educations.map((edu) => (
                        <motion.div
                          key={edu.id}
                          variants={staggerItem}
                          className="relative flex gap-6"
                        >
                          {/* Dot */}
                          <div className="hidden sm:flex shrink-0 w-10 pt-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                edu.is_current
                                  ? "bg-primary/20 ring-2 ring-primary glow-sm"
                                  : "bg-muted"
                              }`}
                            >
                              <GraduationCap className="w-4 h-4 text-primary" />
                            </div>
                          </div>

                          {/* Card */}
                          <div className="flex-1 glass-card rounded-xl p-6 hover:glow-sm transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {edu.degree}
                                  {edu.field_of_study && ` in ${edu.field_of_study}`}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <GraduationCap className="w-3.5 h-3.5" />
                                  {edu.institution}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 mt-1 sm:mt-0">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {edu.start_date} — {edu.is_current ? "Present" : edu.end_date}
                              </div>
                            </div>

                            {edu.description && (
                              <p className="text-sm text-muted-foreground">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.p variants={staggerItem} className="text-sm text-muted-foreground pl-4">
                    No academic milestones published yet.
                  </motion.p>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
