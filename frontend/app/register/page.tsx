"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassPanel } from "@/components/auth/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    user_id: "",
    user_name: "",
    password: "",
    email: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.user_id.length < 3) e.user_id = "User ID must be at least 3 characters";
    if (form.user_name.length < 3) e.user_name = "Username must be at least 3 characters";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!EMAIL_REGEX.test(form.email)) e.email = "Invalid email format";
    if (form.phone_number.length < 7) e.phone_number = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.register(form);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join Cost Care healthcare analytics">
      <GlassPanel>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="User ID"
            value={form.user_id}
            onChange={(e) => update("user_id", e.target.value)}
            error={errors.user_id}
            required
            placeholder="e.g. CC001"
          />
          <Input
            label="Username"
            value={form.user_name}
            onChange={(e) => update("user_name", e.target.value)}
            error={errors.user_name}
            required
            placeholder="Choose a username"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Phone Number"
            value={form.phone_number}
            onChange={(e) => update("phone_number", e.target.value)}
            error={errors.phone_number}
            required
            placeholder="+1 234 567 8900"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            error={errors.password}
            required
            placeholder="Min. 6 characters"
          />
          <Button type="submit" className="w-full" loading={loading}>
            Create Account
          </Button>
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </GlassPanel>
    </AuthLayout>
  );
}
