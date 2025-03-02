"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AssetAllocation, TData } from "@/components/dashboard/asset-allocation";
import { motion } from "framer-motion";
import { useGetBalance } from "@/hooks/balance";
import { use, useEffect, useState } from "react";
import { useGetTransactions } from "@/hooks/transactions";
import { ethers } from "ethers";
import { LendingOverview } from "../lend/lending-overview";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useGetLendingData } from "@/hooks/lend-data";

export function PortfolioOverview() {
  const [balance, setBalance] = useState("0");
  const { data, isFetched } = useGetBalance();
  const { data: transactions, isFetched: isFetchedTransactions } = useGetTransactions();
  const [chartData, setChartData] = useState<any[]>([]);
  const [txData, setTxData] = useState<any[]>([]);
  const { data: lendingData, isFetched: isFetchedLendingData } = useGetLendingData();

  useEffect(() => {
    if (isFetched && data) {
      let sum = 0;
      const chart: TData = [];

      data.forEach((d) => {
        sum = sum + (d?.valueUsd ? d?.valueUsd : 0);
        chart.push({
          name: d?.ticker,
          valueUsd: d?.valueUsd ?? 0,
        });
      });

      setBalance(sum.toFixed(4));
      setChartData(chart as TData);
    }
  }, [isFetched]);

  useEffect(() => {
    if (isFetchedTransactions && transactions) {
      const txDataa: any[] = [];

      console.log("txxx", transactions);

      transactions[0].forEach((d) => {
        txDataa.push({
          id: d.txHash,
          type: d.function,
          amount: (+ethers.formatEther(d?.value ?? 0)).toFixed(4) + " EGLD",
          value: (+ethers.formatEther(d?.value ?? 0) * 22).toFixed(4) + "$",
          timestamp: new Date(d.timestamp * 1000).toDateString(),
        });
      });

      console.log("transactions: ", txDataa);

      setTxData(txDataa.slice(0, 8));
    }
  }, [isFetchedTransactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-12">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance && balance}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">+$27.56</div>
            <p className="text-xs text-muted-foreground">+15.2% from yesterday</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">4% up from yesterday</p>
          </CardContent>
        </Card>
      </motion.div>

      {isFetchedLendingData && (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Health Factor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current: {lendingData && lendingData.isRisky == 1 ? 0.78 : 1.7}</span>
                  <span className={`text-sm ${false ? "text-red-500" : "text-green-500"}`}>{lendingData.isRisky == 1 ? "At Risk" : "Safe"}</span>
                </div>
                <Progress
                  value={Math.min((lendingData && lendingData.isRisky == 1 ? 0.78 : 1.8 / 2) * 100, 100)}
                  className="h-2"
                  indicatorClassName={lendingData.isRisky == 1 ? "bg-red-500" : "bg-green-500"}
                />
                {lendingData && lendingData.isRisky && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your health factor is low. Consider repaying some debt or adding more collateral to avoid liquidation.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="md:col-span-2">
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your portfolio value over time</CardDescription>
          </CardHeader>
          <CardContent>{balance && <Overview balance={balance} />}</CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current portfolio distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetAllocation data={chartData && chartData} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest DeFi activities</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={txData} />
          </CardContent>
        </Card>
      </motion.div>
      {isFetchedLendingData && (
        <LendingOverview suppliedPositions={lendingData.suppliedPositions} borrowedPositions={lendingData.borrowedPositions} />
      )}
    </div>
  );
}
