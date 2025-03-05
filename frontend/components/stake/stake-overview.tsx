"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type TPosition = {
  token: string;
  amount: string;
  value: string;
  apy: number;
  color: string;
};

export function StakingOverview({ stakedPositions }: { stakedPositions: TPosition[] }) {
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
                <span className="text-2xl font-bold">${stakedPositions[0].value}</span>
                <Badge variant="secondary" className="font-medium">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Earning Interest
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {stakedPositions.length > 0 &&
                stakedPositions.map((position) => (
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
    </>
  );
}
