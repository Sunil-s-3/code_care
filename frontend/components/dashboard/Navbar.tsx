"use client";

import { Menu, Download, Upload } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import type { UserProfile } from "@/lib/types";

interface NavbarProps {
  onMenuClick: () => void;
  user?: UserProfile | null;
  onUpload: (file: File) => void;
  onDownload: () => void;
  uploading?: boolean;
}

export function Navbar({
  onMenuClick,
  user,
  onUpload,
  onDownload,
  uploading,
}: NavbarProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  };

  return (
    <header className="glass-panel m-4 mb-0 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-white/10">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-semibold text-lg">Healthcare Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, {user?.user_name || "User"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <label className="cursor-pointer">
          <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 text-sm hover:bg-primary/10 transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload CSV"}
          </span>
        </label>
        <Button variant="outline" onClick={onDownload} className="!py-2 !px-4 text-sm">
          <Download className="w-4 h-4 inline mr-1" />
          Report
        </Button>
        <ThemeToggle />
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
            {user?.user_name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.user_name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
