"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "ETH", value: 45 },
  { name: "USDC", value: 25 },
  { name: "BTC", value: 20 },
  { name: "Other", value: 10 },
];

export type TData = {
  name: string;
  valueUsd: number;
}[];

const COLORS = ["#3b82f6", "#22c55e", "#DE3163", "#64748b", "#FFB200", "#0D4715", "#56021F", "#DE3163"];

export function AssetAllocation({ data }: { data: TData }) {
  console.log("data is", data);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="valueUsd">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
