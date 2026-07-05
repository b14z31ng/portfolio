"use client";

/**
 * Authentication hook for managing auth state.
 * Provides user data, loading state, login/logout functions.
 */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated,
  clearTokens,
} from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
}

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check auth state on mount
  useEffect(() => {
    async function checkAuth() {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getCurrentUser();
        setUser(profile);
      } catch {
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setIsLoading(true);

      try {
        await authLogin({ email, password });
        const profile = await getCurrentUser();
        setUser(profile);
        router.push("/admin");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    router.push("/admin/login");
  }, [router]);

  return {
    user,
    isLoading,
    isLoggedIn: user !== null,
    login,
    logout,
    error,
  };
}
