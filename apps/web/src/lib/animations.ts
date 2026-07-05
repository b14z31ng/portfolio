/**
 * Reusable Framer Motion animation variants.
 * Supports reduced motion preferences.
 */
import type { Variants, Transition } from "framer-motion";

// ──────────────────────────────────────
// Transitions
// ──────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 0.8,
};

export const smooth: Transition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.5,
};

export const gentle: Transition = {
  type: "tween",
  ease: [0.4, 0, 0.2, 1],
  duration: 0.6,
};

// ──────────────────────────────────────
// Fade Variants
// ──────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ──────────────────────────────────────
// Scale Variants
// ──────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ──────────────────────────────────────
// Stagger Children
// ──────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ──────────────────────────────────────
// Hover Effects
// ──────────────────────────────────────
export const hoverLift = {
  y: -4,
  transition: { duration: 0.2, ease: "easeOut" },
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeOut" },
};

export const tapScale = {
  scale: 0.98,
};

// ──────────────────────────────────────
// Page Transition
// ──────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// ──────────────────────────────────────
// Reveal (for scroll-triggered)
// ──────────────────────────────────────
export const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};
