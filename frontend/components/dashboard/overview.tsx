"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const data = [
//   { name: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split("T")[0], value: 35000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split("T")[0], value: 39000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split("T")[0], value: 37000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString().split("T")[0], value: 42000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString().split("T")[0], value: 40000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split("T")[0], value: 45000 },
//   { name: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0], value: 43000 },
//   { name: new Date().toISOString().split("T")[0], value: 45231 },
// ];

export function Overview({ balance }: { balance: string }) {
  const min = +balance - 13;
  const max = +balance + 5;

  const dataArr = [];

  for (let i = 6; i >= 0; i--) {
    dataArr.push({
      name: new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split("T")[0],
      value: (Math.random() * (max - min) + min).toFixed(2),
    });
  }

  dataArr.push({
    name: new Date().toISOString().split("T")[0],
    value: +balance,
  });

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={dataArr}>
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
