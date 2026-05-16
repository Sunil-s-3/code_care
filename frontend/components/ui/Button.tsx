"use client";

import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        variant === "primary" && "btn-primary",
        variant === "ghost" &&
          "px-4 py-2 rounded-xl hover:bg-white/10 transition-colors",
        variant === "outline" &&
          "px-4 py-2 rounded-xl border border-primary/40 text-primary hover:bg-primary/10",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
