/**
 * Authentication utilities for the frontend.
 * Manages JWT tokens in localStorage and provides auth state.
 */

import { api, ApiError } from "./api";

// ──────────────────────────────────────
// Types
// ──────────────────────────────────────
interface LoginCredentials {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
}

// ──────────────────────────────────────
// Token Storage
// ──────────────────────────────────────
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setTokens(tokens: TokenResponse): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

// ──────────────────────────────────────
// Auth API calls
// ──────────────────────────────────────
export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/api/v1/auth/login", credentials);
  setTokens(response);
  return response;
}

export async function refreshAccessToken(): Promise<TokenResponse> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await api.post<TokenResponse>("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
    setTokens(response);
    return response;
  } catch (error) {
    clearTokens();
    throw error;
  }
}

export async function getCurrentUser(): Promise<UserProfile> {
  return api.get<UserProfile>("/api/v1/auth/me");
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/v1/auth/logout");
  } catch {
    // Logout endpoint is best-effort
  } finally {
    clearTokens();
  }
}
