"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, TrendingUp, ArrowDownRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

// Mock data - replace with real data from your API
const lendingData = {
  healthFactor: 1.8,
  totalSupplied: "50,000.00",
  totalBorrowed: "25,000.00",
  suppliedPositions: [
    {
      token: "ETH",
      amount: "15.5",
      value: "31,000.00",
      apy: 3.2,
      color: "bg-blue-500",
    },
    {
      token: "USDC",
      amount: "15,000",
      value: "15,000.00",
      apy: 4.5,
      color: "bg-green-500",
    },
    {
      token: "WBTC",
      amount: "0.15",
      value: "4,000.00",
      apy: 2.8,
      color: "bg-orange-500",
    },
  ],
  borrowedPositions: [
    {
      token: "USDC",
      amount: "20,000",
      value: "20,000.00",
      apy: 5.8,
      color: "bg-green-500",
    },
    {
      token: "ETH",
      amount: "2.5",
      value: "5,000.00",
      apy: 4.2,
      color: "bg-blue-500",
    },
  ],
};

export function LendingOverview() {
  const isHealthFactorLow = lendingData.healthFactor < 1.5;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Supplied Assets</CardTitle>
            <CardDescription>Assets supplied as collateral</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">${lendingData.totalSupplied}</span>
                <Badge variant="secondary" className="font-medium">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Earning Interest
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {lendingData.suppliedPositions.map((position) => (
                <div key={position.token} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${position.color}`} />
                      <span className="font-medium">{position.token}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {position.amount} {position.token}
                      </p>
                      <p className="text-sm text-muted-foreground">${position.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Supply APY</span>
                    <span className="text-green-500">+{position.apy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Borrowed Assets</CardTitle>
            <CardDescription>Your current borrowings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">${lendingData.totalBorrowed}</span>
                <Badge variant="secondary" className="font-medium">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  Paying Interest
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {lendingData.borrowedPositions.map((position) => (
                <div key={position.token} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${position.color}`} />
                      <span className="font-medium">{position.token}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {position.amount} {position.token}
                      </p>
                      <p className="text-sm text-muted-foreground">${position.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Borrow APY</span>
                    <span className="text-red-500">-{position.apy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
