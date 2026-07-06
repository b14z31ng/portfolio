"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Shield,
  Sparkles,
  FileText,
  Upload,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Profile {
  id: string;
  full_name: string;
  headline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_description: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  availability_status: string;
  profile_image_url: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  resume_uploaded_at: string | null;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "cv">("profile");

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");

  // CV State
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get<Profile>("/api/v1/profile");
        setProfile(data);
        setFullName(data.full_name || "");
        setHeadline(data.headline || "");
        setHeroTitle(data.hero_title || "");
        setHeroSubtitle(data.hero_subtitle || "");
        setHeroDescription(data.hero_description || "");
        setAboutDescription(data.about_description || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setGithubUrl(data.github_url || "");
        setLinkedinUrl(data.linkedin_url || "");
        setWebsiteUrl(data.website_url || "");
        setAvailabilityStatus(data.availability_status || "available");
      } catch (err) {
        console.error("Failed to fetch profile settings:", err);
        setError("Failed to fetch profile settings.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      full_name: fullName.trim(),
      headline: headline.trim(),
      hero_title: heroTitle.trim(),
      hero_subtitle: heroSubtitle.trim(),
      hero_description: heroDescription.trim(),
      about_description: aboutDescription.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      location: location.trim() || null,
      github_url: githubUrl.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      website_url: websiteUrl.trim() || null,
      availability_status: availabilityStatus,
    };

    try {
      const updated = await api.patch<Profile>("/api/v1/profile", payload);
      setProfile(updated);
      setSuccess("Profile settings updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const updated = await api.post<Profile>("/api/v1/profile/resume", formData);
      setProfile(updated);
      setCvFile(null);
      setSuccess("Resume/CV uploaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload Resume/CV.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCvDelete = async () => {
    if (!confirm("Are you sure you want to delete your current Resume/CV?")) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await api.delete<Profile>("/api/v1/profile/resume");
      setProfile(updated);
      setSuccess("Resume/CV deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete Resume/CV.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-6">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">CMS Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your personal introduction, social links, contact info, and recruiters CV.
          </p>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Menu */}
      <div className="flex border-b border-border/40 gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "profile" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("cv")}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "cv" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Resume / CV Upload
        </button>
      </div>

      {activeTab === "profile" && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <form onSubmit={handleProfileSubmit} className="space-y-6 glass-card rounded-2xl p-6 sm:p-8">
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/10 pb-2">
                <User className="w-5 h-5 text-primary" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Name</label>
                  <Input
                    required
                    placeholder="Reshad Romim"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Headline</label>
                  <Input
                    required
                    placeholder="Backend Engineer & AI Developer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Hero Introduction */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/10 pb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Hero Section Text
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Hero Title</label>
                  <Input
                    required
                    placeholder="Reshad Romim"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Hero Subtitle</label>
                  <Input
                    required
                    placeholder="Backend Engineer & AI Developer"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold">Hero Description</label>
                  <Textarea
                    rows={3}
                    placeholder="A brief greeting/elevator pitch showing at the top of your portfolio."
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Socials */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/10 pb-2">
                <Share2 className="w-5 h-5 text-primary" />
                Contact & Social Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    placeholder="reshad@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    Phone
                  </label>
                  <Input
                    placeholder="+880123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Location
                  </label>
                  <Input
                    placeholder="Dhaka, Bangladesh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                    Availability Status
                  </label>
                  <select
                    value={availabilityStatus}
                    onChange={(e) => setAvailabilityStatus(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-sm rounded-md bg-background/50 border border-input focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="available">Available for opportunities</option>
                    <option value="busy">Busy / Not looking</option>
                    <option value="open_to_work">Open to Work</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">GitHub Profile URL</label>
                  <Input
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">LinkedIn Profile URL</label>
                  <Input
                    placeholder="https://linkedin.com/in/..."
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            {/* About Description */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/10 pb-2">
                <FileText className="w-5 h-5 text-primary" />
                About Description
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Biography Details</label>
                <Textarea
                  rows={4}
                  placeholder="Tell your professional story..."
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
              <Button type="submit" disabled={isSubmitting} className="glow-sm">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Save Settings
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === "cv" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Resume / CV Manager
              </CardTitle>
              <CardDescription>
                We have upgraded the Resume system! You can now manage multiple versions, activation states, featured flags, and display orders.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl border border-border/40 bg-muted/10 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-primary mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Premium Resume System</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Manage all your resume versions in one central place. Set active, featured status, edit custom descriptions, and more.
                  </p>
                </div>
                <div className="pt-2">
                  <a href="/admin/resumes">
                    <Button className="glow-sm gap-2">
                      <FileText className="w-4 h-4" />
                      Go to Resume Management
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
