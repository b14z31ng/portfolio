"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/layout/contact-form";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function ContactPage() {
  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={staggerItem}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-muted-foreground text-lg">
              Have a project in mind or want to discuss opportunities? I&apos;d
              love to hear from you.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div variants={staggerItem}>
            <ContactForm />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
