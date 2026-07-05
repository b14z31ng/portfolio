"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  FileText,
  Microscope,
  Briefcase,
  GraduationCap,
  Award,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────
// Navigation Items
// ──────────────────────────────────────
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "GitHub", href: "/admin/github", icon: FolderGit2 },
  { label: "Projects", href: "/admin/projects", icon: Layers },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Research", href: "/admin/research", icon: Microscope },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggle,
  onLogout,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold tracking-tight truncate"
          >
            Portfolio CMS
          </motion.span>
        )}

        {/* Desktop toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="hidden lg:flex shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>

        {/* Mobile close */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onMobileClose}
          className="lg:hidden shrink-0"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-accent/50 hover:text-foreground",
                isActive
                  ? "bg-primary/10 text-primary glow-sm"
                  : "text-muted-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive && "text-primary"
                )}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border/50">
        <button
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: mobileOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 left-0 z-50 h-dvh w-[260px]",
          "glass-card-elevated border-r border-border/50",
          "lg:hidden"
        )}
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-dvh glass-card border-r border-border/50 transition-all duration-300",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
