"use client";

import { motion } from "framer-motion";

export function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{subtitle}</p>
      )}
      {!subtitle && <div className="mb-4" />}
      <div className="h-72 w-full">{children}</div>
    </motion.div>
  );
}
