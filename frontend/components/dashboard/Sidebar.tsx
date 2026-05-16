"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Activity, LayoutDashboard, User, LogOut, X } from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-panel m-0 lg:m-4 lg:rounded-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Cost Care</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                pathname === href
                  ? "bg-primary/20 text-primary font-semibold"
                  : "hover:bg-white/10 dark:hover:bg-slate-700/50"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
