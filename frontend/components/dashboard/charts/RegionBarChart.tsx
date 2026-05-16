"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./ChartCard";

export function RegionBarChart({
  data,
}: {
  data: { region: string; avgCharges: number; totalCharges: number }[];
}) {
  return (
    <ChartCard title="Region-wise Healthcare Cost" subtitle="Average charges by region">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgCharges" name="Avg Charges ($)" fill="#06B6D4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
