"use client";

import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input className={clsx("glass-input", error && "border-rose-500", className)} {...props} />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
