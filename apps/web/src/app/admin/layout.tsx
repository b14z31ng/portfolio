"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isLoggedIn, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Allow the login page to be accessed without auth
  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated (except login page)
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isLoggedIn, isLoginPage, router]);

  // If on login page, render just the children (login form)
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-dvh">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col w-[240px] glass-card border-r border-border/50 p-4 gap-4">
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="space-y-2 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated → will redirect
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={logout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b border-border/50 glass-card shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-sm font-medium text-muted-foreground hidden sm:block">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
