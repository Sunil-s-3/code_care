"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "./ChartCard";

export function GenderBarChart({
  data,
}: {
  data: { gender: string; avgCharges: number; minCharges: number; maxCharges: number }[];
}) {
  return (
    <ChartCard title="Gender-based Analysis" subtitle="Healthcare cost by gender">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="gender" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgCharges" name="Avg" fill="#0D9488" radius={[4, 4, 0, 0]} />
          <Bar dataKey="minCharges" name="Min" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="maxCharges" name="Max" fill="#F43F5E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
