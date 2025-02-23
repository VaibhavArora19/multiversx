"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "1D", ETH: 2200, BTC: 43000 },
  { name: "2D", ETH: 2250, BTC: 44000 },
  { name: "3D", ETH: 2180, BTC: 42000 },
  { name: "4D", ETH: 2300, BTC: 45000 },
  { name: "5D", ETH: 2280, BTC: 44500 },
  { name: "6D", ETH: 2350, BTC: 46000 },
  { name: "7D", ETH: 2400, BTC: 47000 },
];

export function MarketOverview() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Track major cryptocurrency prices and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prices" className="space-y-4">
            <TabsList>
              <TabsTrigger value="prices">Prices</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="tvl">TVL</TabsTrigger>
            </TabsList>
            <TabsContent value="prices" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">ETH/USD</CardTitle>
                    <div className="text-2xl font-bold">$2,400.00</div>
                    <p className="text-xs text-green-500">+2.5%</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="ETH" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">BTC/USD</CardTitle>
                    <div className="text-2xl font-bold">$47,000.00</div>
                    <p className="text-xs text-green-500">+3.2%</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="BTC" stroke="#f59e0b" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
