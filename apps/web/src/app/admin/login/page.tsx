"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/auth";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 abyss-gradient pointer-events-none" />

      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/3 -left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.15 270) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass-card-elevated glow-sm mb-6">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to manage your portfolio
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div variants={staggerItem}>
          <form
            onSubmit={handleSubmit}
            className="glass-card-elevated rounded-2xl p-8 space-y-6"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@portfolio.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-background/50"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-background/50"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 glow-sm group"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={staggerItem}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Protected area · Portfolio CMS
        </motion.p>
      </motion.div>
    </main>
  );
}
