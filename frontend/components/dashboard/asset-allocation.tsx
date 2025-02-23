"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "ETH", value: 45 },
  { name: "USDC", value: 25 },
  { name: "BTC", value: 20 },
  { name: "Other", value: 10 },
];

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#64748b"];

export function AssetAllocation() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
