"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Cost Care
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
        </motion.div>
        {children}
      </div>
    </div>
  );
}
