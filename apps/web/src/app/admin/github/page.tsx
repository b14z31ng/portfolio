"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  RefreshCw,
  Check,
  X,
  Star,
  GitFork,
  ExternalLink,
  Search,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  Sparkles,
  PlugZap,
  Code2,
  Layers,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/animations";

// ──────────────────────────────────────
// Types
// ──────────────────────────────────────
interface GitHubStatus {
  connected: boolean;
  username: string | null;
  total_repos: number;
  selected_repos: number;
  last_synced_at: string | null;
}

interface Repository {
  id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[] | null;
  is_fork: boolean;
  is_archived: boolean;
  is_selected: boolean;
  pushed_at: string | null;
  last_synced_at: string | null;
}

// ──────────────────────────────────────
// Language Colors
// ──────────────────────────────────────
const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Lua: "#000080",
  Zig: "#ec915c",
};

// ──────────────────────────────────────
// Repository Card
// ──────────────────────────────────────
function RepoCard({
  repo,
  onToggle,
  isTogglingId,
}: {
  repo: Repository;
  onToggle: (id: string) => void;
  isTogglingId: string | null;
}) {
  const isToggling = isTogglingId === repo.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card rounded-xl p-4 transition-all duration-300 ${
        repo.is_selected
          ? "ring-1 ring-primary/30 glow-sm"
          : "hover:border-border/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Repo name + link */}
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-4 h-4 text-muted-foreground shrink-0" />
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:text-primary transition-colors truncate"
            >
              {repo.name}
            </a>
            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 ml-6">
              {repo.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 ml-6 flex-wrap">
            {repo.language && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      languageColors[repo.language] || "#666",
                  }}
                />
                {repo.language}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3" />
              {repo.stargazers_count}
            </div>
            {repo.forks_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork className="w-3 h-3" />
                {repo.forks_count}
              </div>
            )}
          </div>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 ml-6 flex-wrap">
              {repo.topics.slice(0, 5).map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > 5 && (
                <span className="text-[10px] text-muted-foreground">
                  +{repo.topics.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Select toggle */}
        <Button
          variant={repo.is_selected ? "default" : "outline"}
          size="icon-sm"
          onClick={() => onToggle(repo.id)}
          disabled={isToggling}
          className="shrink-0"
          aria-label={
            repo.is_selected ? "Deselect repository" : "Select repository"
          }
        >
          {isToggling ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : repo.is_selected ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Circle className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────
// GitHub Page
// ──────────────────────────────────────
export default function GitHubPage() {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [search, setSearch] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch status ──
  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.get<GitHubStatus>("/api/v1/github/status");
      setStatus(data);
    } catch (err) {
      setError("Failed to fetch GitHub status");
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  // ── Fetch repos ──
  const fetchRepos = useCallback(async () => {
    setIsLoadingRepos(true);
    try {
      const data = await api.get<{ items: Repository[]; total: number }>(
        "/api/v1/repositories",
        { params: { per_page: "100" } }
      );
      setRepos(data.items);
    } catch {
      // Repos will be empty until synced
    } finally {
      setIsLoadingRepos(false);
    }
  }, []);

  // ── Sync ──
  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    setError(null);
    setSyncResult(null);

    try {
      const result = await api.post<{
        synced: number;
        created: number;
        updated: number;
        message: string;
      }>("/api/v1/github/sync");
      setSyncResult(result.message);
      await fetchRepos();
      await fetchStatus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sync failed. Check your GitHub token."
      );
    } finally {
      setIsSyncing(false);
    }
  }, [fetchRepos, fetchStatus]);

  // ── Toggle selection ──
  const handleToggle = useCallback(async (repoId: string) => {
    setIsTogglingId(repoId);
    try {
      const updated = await api.patch<Repository>(
        `/api/v1/repositories/${repoId}/toggle-select`
      );
      setRepos((prev) =>
        prev.map((r) => (r.id === repoId ? updated : r))
      );
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              selected_repos: updated.is_selected
                ? prev.selected_repos + 1
                : prev.selected_repos - 1,
            }
          : prev
      );
    } catch {
      setError("Failed to update selection");
    } finally {
      setIsTogglingId(null);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStatus();
    fetchRepos();
  }, [fetchStatus, fetchRepos]);

  // Filter repos by search
  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = repos.filter((r) => r.is_selected).length;

  return (
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
            GitHub Integration
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sync repositories and select projects for your portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSync}
            disabled={isSyncing || !status?.connected}
            className="glow-sm shrink-0"
          >
            {isSyncing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {isSyncing ? "Syncing..." : "Sync Repositories"}
          </Button>
          <Link
            href="/admin/projects"
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "glass-card shrink-0")}
          >
            <Layers className="w-4 h-4 mr-2" />
            Manage Projects
          </Link>
        </div>
      </motion.div>

      {/* Status Cards */}
      <motion.div
        variants={staggerItem}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoadingStatus ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <Card className="glass-card">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  {status?.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs text-muted-foreground font-medium">
                    Connection
                  </span>
                </div>
                <p className="text-lg font-bold">
                  {status?.connected ? "Connected" : "Not Connected"}
                </p>
                {status?.username && (
                  <p className="text-xs text-muted-foreground">
                    @{status.username}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Total Repos
                  </span>
                </div>
                <p className="text-lg font-bold">{status?.total_repos || 0}</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Selected
                  </span>
                </div>
                <p className="text-lg font-bold">
                  {status?.selected_repos || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Last Synced
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {status?.last_synced_at
                    ? new Date(status.last_synced_at).toLocaleDateString()
                    : "Never"}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </motion.div>

      {/* Alerts */}
      <AnimatePresence>
        {syncResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{syncResult}</span>
            <button
              onClick={() => setSyncResult(null)}
              className="ml-auto"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not connected state */}
      {!isLoadingStatus && !status?.connected && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-2xl bg-primary/10 mb-4">
              <PlugZap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Connect Your GitHub
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Set <code className="px-1.5 py-0.5 rounded bg-muted text-xs">GITHUB_TOKEN</code> and{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted text-xs">GITHUB_USERNAME</code>{" "}
              in your environment variables to sync repositories.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Repository list */}
      {status?.connected && (
        <motion.div variants={staggerItem}>
          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {selectedCount} of {repos.length} selected
            </span>
          </div>

          {/* Repos grid */}
          {isLoadingRepos ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredRepos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    onToggle={handleToggle}
                    isTogglingId={isTogglingId}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {search
                    ? "No repositories match your search."
                    : "No repositories synced yet. Click 'Sync Repositories' to start."}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
