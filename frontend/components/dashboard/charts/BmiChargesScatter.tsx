"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";

export function BmiChargesScatter({
  data,
}: {
  data: { bmi: number; charges: number }[];
}) {
  return (
    <ChartCard title="BMI vs Charges" subtitle="Body mass index impact on costs">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="bmi" name="BMI" />
          <YAxis type="number" dataKey="charges" name="Charges" unit="$" />
          <ZAxis range={[40, 40]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Patients" data={data} fill="#06B6D4" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
