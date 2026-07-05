"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  FileText,
  Microscope,
  FolderGit2,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ──────────────────────────────────────
// Stats Card
// ──────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="glass-card hover:glow-sm transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <span className="text-xs text-emerald-500 font-medium">
              {trend}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────
// Quick Action
// ──────────────────────────────────────
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function QuickAction({ title, description, icon, href }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-4 rounded-xl glass-card hover:glow-sm transition-all duration-300 cursor-pointer group"
    >
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-0.5">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

// ──────────────────────────────────────
// Dashboard Page
// ──────────────────────────────────────
export default function AdminDashboard() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your portfolio.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Projects"
          value={0}
          description="published projects"
          icon={<Layers className="w-4 h-4" />}
        />
        <StatCard
          title="Blog Posts"
          value={0}
          description="articles published"
          icon={<FileText className="w-4 h-4" />}
        />
        <StatCard
          title="Page Views"
          value="—"
          description="last 30 days"
          icon={<Eye className="w-4 h-4" />}
        />
        <StatCard
          title="Repositories"
          value={0}
          description="synced from GitHub"
          icon={<FolderGit2 className="w-4 h-4" />}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            title="Connect GitHub"
            description="Sync your repositories to generate projects"
            icon={<FolderGit2 className="w-4 h-4" />}
            href="/admin/github"
          />
          <QuickAction
            title="Create Blog Post"
            description="Write and publish a new article"
            icon={<FileText className="w-4 h-4" />}
            href="/admin/blog"
          />
          <QuickAction
            title="Add Research"
            description="Publish a research paper or study"
            icon={<Microscope className="w-4 h-4" />}
            href="/admin/research"
          />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={staggerItem}>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-2xl bg-muted/50 mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No activity yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Start by connecting your GitHub account and syncing repositories to
              generate your first project pages.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
