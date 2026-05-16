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

export function AgeChargesScatter({
  data,
}: {
  data: { age: number; charges: number }[];
}) {
  return (
    <ChartCard title="Age vs Charges" subtitle="Insurance cost by patient age">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" dataKey="age" name="Age" unit=" yrs" />
          <YAxis type="number" dataKey="charges" name="Charges" unit="$" />
          <ZAxis range={[40, 40]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Patients" data={data} fill="#0D9488" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
