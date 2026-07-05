"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass-card overflow-hidden relative border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Settings className="w-6 h-6" />
              </div>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
                System Module
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold">CMS Settings</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Settings dashboard handles authentication profiles, API tokens (such as GitHub/Render webhooks), 
              site-wide SEO description overwriting, and theme styling default selection.
            </p>

            <div className="border-t border-border/50 pt-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Planned Capabilities
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li>Admin user profile updates (name, password reset, profile photo).</li>
                <li>GitHub fine-grained personal access token storage configuration.</li>
                <li>System-wide default theme preference selection (Light, Dark, Abyss).</li>
                <li>Render webhook redeployment triggering.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
