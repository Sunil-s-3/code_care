"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  DollarSign,
  Shield,
  AlertTriangle,
  Scale,
  Cigarette,
} from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { api } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { AgeChargesScatter } from "@/components/dashboard/charts/AgeChargesScatter";
import { BmiChargesScatter } from "@/components/dashboard/charts/BmiChargesScatter";
import { SmokerBarChart } from "@/components/dashboard/charts/SmokerBarChart";
import { RegionBarChart } from "@/components/dashboard/charts/RegionBarChart";
import { GenderBarChart } from "@/components/dashboard/charts/GenderBarChart";
import { MonthlyTrendLine } from "@/components/dashboard/charts/MonthlyTrendLine";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data, loading, error, refetch } = useDashboardData();

  useEffect(() => {
    api.getMe().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await api.uploadCsv(file);
      toast.success(`Dataset updated: ${res.rows} rows`);
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await api.downloadReport();
      toast.success("Report downloaded");
    } catch {
      toast.error("Failed to download report");
    }
  };

  const stats = data?.stats;

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-gradient-to-br from-teal-50/50 via-white to-cyan-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            user={user}
            onUpload={handleUpload}
            onDownload={handleDownload}
            uploading={uploading}
          />
          <main className="flex-1 p-4 overflow-auto">
            {data && (
              <p className="text-xs text-slate-500 mb-4 px-2">
                Analyzing {data.total_records.toLocaleString()} patient records
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : stats ? (
                <>
                  <StatCard
                    index={0}
                    title="Total Healthcare Spending"
                    value={formatCurrency(stats.total_spending)}
                    icon={DollarSign}
                  />
                  <StatCard
                    index={1}
                    title="Avg Insurance Cost"
                    value={formatCurrency(stats.average_insurance_cost)}
                    icon={Shield}
                  />
                  <StatCard
                    index={2}
                    title="High-Risk Patients"
                    value={stats.high_risk_patients.toLocaleString()}
                    subtitle="BMI ≥ 30 or smokers"
                    icon={AlertTriangle}
                  />
                  <StatCard
                    index={3}
                    title="BMI Average"
                    value={stats.bmi_average.toFixed(1)}
                    icon={Scale}
                  />
                  <StatCard
                    index={4}
                    title="Smoking Impact"
                    value={`${stats.smoking_impact_score.toFixed(1)}%`}
                    subtitle="Cost increase vs non-smokers"
                    icon={Cigarette}
                  />
                </>
              ) : null}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <ChartSkeleton key={i} />)
              ) : data ? (
                <>
                  <AgeChargesScatter data={data.age_vs_charges} />
                  <BmiChargesScatter data={data.bmi_vs_charges} />
                  <SmokerBarChart data={data.smoker_comparison} />
                  <RegionBarChart data={data.region_costs} />
                  <GenderBarChart data={data.gender_analysis} />
                  <MonthlyTrendLine data={data.monthly_trends} />
                </>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
