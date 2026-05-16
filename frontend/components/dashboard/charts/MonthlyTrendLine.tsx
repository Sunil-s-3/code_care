"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { ChartCard } from "./ChartCard";

export function MonthlyTrendLine({
  data,
}: {
  data: { month: string; avgCharges: number; totalCharges: number; patients: number }[];
}) {
  return (
    <ChartCard
      title="Monthly Trends"
      subtitle="Simulated monthly distribution from dataset buckets"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <defs>
            <linearGradient id="colorCharges" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="avgCharges"
            name="Avg Charges"
            stroke="#0D9488"
            fill="url(#colorCharges)"
          />
          <Line type="monotone" dataKey="totalCharges" name="Total" stroke="#06B6D4" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
