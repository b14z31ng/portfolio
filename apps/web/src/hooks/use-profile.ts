"use client";

/**
 * Hook to fetch the public profile from the API.
 * Used by Hero, Footer, Contact, and other components
 * that need profile data like name, social links, resume, etc.
 */
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export interface PublicProfile {
  full_name: string;
  headline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_description: string;
  email: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  availability_status: string;
  profile_image_url: string | null;
  resume_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  favicon_url: string | null;
}

interface UseProfileReturn {
  profile: PublicProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get<PublicProfile>("/api/v1/profile/public");
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { profile, isLoading, error };
}
