"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate submission (will connect to API later)
      await new Promise((r) => setTimeout(r, 1500));
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setError("Failed to send message. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-elevated rounded-2xl p-12 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Thank you for reaching out. I&apos;ll get back to you as soon
            as possible.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
          >
            Send another message
          </Button>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 space-y-6 text-left"
        >
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 h-11 bg-background/50"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-11 bg-background/50"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="subject"
                name="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleChange}
                className="pl-10 h-11 bg-background/50"
                required
              />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell me about your project or opportunity..."
              value={formData.message}
              onChange={handleChange}
              className="min-h-[140px] bg-background/50 resize-none"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 glow-sm group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </span>
            )}
          </Button>
        </form>
      )}
    </>
  );
}
