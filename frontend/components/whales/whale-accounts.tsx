"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Check, Copy, TrendingUp } from "lucide-react";
import { TokenHoldings } from "@/components/whales/token-holdings";
import { useToast } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for whale accounts
const whaleAccounts = [
  {
    id: "whale1",
    address: "0x1234...5678",
    name: "Mega Whale",
    totalValue: "$12,450,000",
    performance: "+32.5%",
    tokens: [
      { symbol: "ETH", name: "Ethereum", amount: "1,245", value: "$2,980,000", percentage: 24 },
      { symbol: "USDC", name: "USD Coin", amount: "2,500,000", value: "$2,500,000", percentage: 20 },
      { symbol: "WBTC", name: "Wrapped Bitcoin", amount: "28.5", value: "$1,710,000", percentage: 14 },
      { symbol: "ARB", name: "Arbitrum", amount: "850,000", value: "$1,020,000", percentage: 8 },
      { symbol: "OP", name: "Optimism", amount: "750,000", value: "$975,000", percentage: 8 },
    ],
    strategies: [
      { name: "Liquid Staking", allocation: "30%" },
      { name: "Yield Farming", allocation: "40%" },
      { name: "Options Trading", allocation: "20%" },
      { name: "Lending", allocation: "10%" },
    ],
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "whale2",
    address: "0xabcd...ef12",
    name: "DeFi Maestro",
    totalValue: "$8,750,000",
    performance: "+28.7%",
    tokens: [
      { symbol: "ETH", name: "Ethereum", amount: "980", value: "$2,352,000", percentage: 27 },
      { symbol: "MKR", name: "Maker", amount: "1,200", value: "$1,680,000", percentage: 19 },
      { symbol: "AAVE", name: "Aave", amount: "12,500", value: "$1,125,000", percentage: 13 },
      { symbol: "CRV", name: "Curve", amount: "1,500,000", value: "$750,000", percentage: 9 },
      { symbol: "SNX", name: "Synthetix", amount: "350,000", value: "$700,000", percentage: 8 },
    ],
    strategies: [
      { name: "Governance", allocation: "35%" },
      { name: "Liquidity Providing", allocation: "45%" },
      { name: "Staking", allocation: "20%" },
    ],
    lastActive: "5 hours ago",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "whale3",
    address: "0x7890...1234",
    name: "Yield Hunter",
    totalValue: "$5,250,000",
    performance: "+41.2%",
    tokens: [
      { symbol: "ETH", name: "Ethereum", amount: "450", value: "$1,080,000", percentage: 21 },
      { symbol: "COMP", name: "Compound", amount: "15,000", value: "$975,000", percentage: 19 },
      { symbol: "UNI", name: "Uniswap", amount: "120,000", value: "$840,000", percentage: 16 },
      { symbol: "LINK", name: "Chainlink", amount: "65,000", value: "$780,000", percentage: 15 },
      { symbol: "MATIC", name: "Polygon", amount: "950,000", value: "$665,000", percentage: 13 },
    ],
    strategies: [
      { name: "Yield Farming", allocation: "60%" },
      { name: "Staking", allocation: "25%" },
      { name: "Lending", allocation: "15%" },
    ],
    lastActive: "1 day ago",
    avatar: "/placeholder.svg?height=80&width=80",
  },
];

export function WhaleAccounts() {
  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopyStrategy = (whaleId: string) => {
    // Set copied state for animation
    setCopiedStates({ ...copiedStates, [whaleId]: true });

    // Show toast notification
    toast({
      title: "Strategy copied!",
      description: "You've successfully copied this whale's strategy.",
      duration: 3000,
    });

    // Reset copied state after animation
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [whaleId]: false });
    }, 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {whaleAccounts.map((whale) => (
        <motion.div
          key={whale.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ y: -5 }}
          className="transition-all"
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={whale.avatar} alt={whale.name} />
                    <AvatarFallback>{whale.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{whale.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      {whale.address}
                      <Button variant="ghost" size="icon" className="h-4 w-4">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                  <TrendingUp className="h-3 w-3" />
                  {whale.performance}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Value</p>
                <p className="text-2xl font-bold">{whale.totalValue}</p>
              </div>

              <Tabs defaultValue="tokens">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tokens">Top Tokens</TabsTrigger>
                  <TabsTrigger value="strategies">Strategies</TabsTrigger>
                </TabsList>
                <TabsContent value="tokens" className="space-y-4 pt-3">
                  <TokenHoldings tokens={whale.tokens} />
                </TabsContent>
                <TabsContent value="strategies" className="pt-3">
                  <div className="space-y-3">
                    {whale.strategies.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className="text-sm font-medium">{strategy.name}</p>
                        <Badge variant="secondary">{strategy.allocation}</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-xs text-muted-foreground">Last active: {whale.lastActive}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full relative" onClick={() => handleCopyStrategy(whale.id)}>
                {copiedStates[whale.id] ? (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                    <Check className="mr-2 h-4 w-4" /> Copied!
                  </motion.span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="mr-2 h-4 w-4" /> Copy Strategy
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
