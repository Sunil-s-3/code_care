"use client";

import { motion } from "framer-motion";

export function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel p-8 md:p-10 w-full max-w-md"
    >
      {children}
    </motion.div>
  );
}
