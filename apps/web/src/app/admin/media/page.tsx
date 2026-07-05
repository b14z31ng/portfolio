"use client";

import { motion } from "framer-motion";
import { Image, HardDrive, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminMediaPage() {
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
                <Image className="w-6 h-6" />
              </div>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
                Phase 2 Optimization Module
              </Badge>
            </div>
            <CardTitle className="text-2xl font-bold">Media Library</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              The Media Library is a unified asset manager designed to host banner pictures, project screenshots, 
              PDF resumes, and custom icons. This module will integrate directly with Cloudinary storage.
            </p>

            <div className="border-t border-border/50 pt-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Planned Capabilities
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                <li>Direct integration with Cloudinary API for quick asset uploads.</li>
                <li>Image cropper, compressor, and optimization for Next.js Image component loading.</li>
                <li>Global copy-to-clipboard markdown reference generator.</li>
                <li>Drag-and-drop file organization.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
