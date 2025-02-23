"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 35000 },
  { name: "Feb", value: 39000 },
  { name: "Mar", value: 37000 },
  { name: "Apr", value: 42000 },
  { name: "May", value: 40000 },
  { name: "Jun", value: 45000 },
  { name: "Jul", value: 43000 },
  { name: "Aug", value: 45231 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-sm" />
        <YAxis className="text-sm" />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                      <span className="font-bold text-muted-foreground">${payload[0].value.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          strokeWidth={2}
          activeDot={{
            r: 6,
            className: "fill-primary",
          }}
          className="stroke-primary"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
