"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GlassPanel } from "@/components/auth/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { User, Mail, Hash } from "lucide-react";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getMe().then((u) => {
      setUser(u);
      setPhone(u.phone_number);
    }).catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.updateProfile(phone);
      setUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 p-4 lg:p-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <GlassPanel>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your account</p>
              </div>
            </div>
            {user && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow icon={Hash} label="User ID" value={user.user_id} />
                  <InfoRow icon={User} label="Username" value={user.user_name} />
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                </div>
                <form onSubmit={handleSave} className="max-w-md">
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Button type="submit" className="mt-4" loading={loading}>
                    Save Changes
                  </Button>
                </form>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </AuthGuard>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/30 dark:bg-slate-800/30">
      <Icon className="w-5 h-5 text-primary" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
