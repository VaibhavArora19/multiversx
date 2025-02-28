"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Check, Copy, Loader2, TrendingUp } from "lucide-react";
import { TokenHoldings } from "@/components/whales/token-holdings";
import { useToast } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWhales } from "@/hooks/whales";

// Mock data for whale accounts
// const whaleAccounts = [
//   {
//     id: "whale1",
//     address: "erd1c579aq6kjkhar6cyx8qm9k9wettxjcf3jncduwe0pllqx0rlczfskg3vk2",
//     name: "Mega Whale",
//     totalValue: "$180,172.75",
//     performance: "+32.5%",
//     tokens: [
//       { symbol: "BBFY-1bb288", name: "Burnify", amount: "962,034.75", value: "$89,593.02", percentage: 49.5 },
//       { symbol: "WEGLD", name: "Wrapped EGLD", amount: "2,795.18", value: "$67,954.04", percentage: 37.54 },
//       { symbol: "MEX", name: "xMEX", amount: "987,249,994.27", value: "$23,294.91", percentage: 12.87 },
//       { symbol: "RIDE", name: "RIDE", amount: "14,279.03", value: "$130.34", percentage: 0.42 },
//       { symbol: "USDC", name: "USDC", amount: "0.375199", value: "$0.37", percentage: 0.39 },
//     ],
//     strategies: [
//       { name: "Liquid Staking", allocation: "30%" },
//       { name: "Yield Farming", allocation: "40%" },
//       { name: "Options Trading", allocation: "20%" },
//       { name: "Lending", allocation: "10%" },
//     ],
//     lastActive: "2 hours ago",
//     avatar: "/placeholder.svg?height=80&width=80",
//   },
//   {
//     id: "whale2",
//     address: "erd1kc7v0lhqu0sclywkgeg4um8ea5nvch9psf2lf8t96j3w622qss8sav2zl8",
//     name: "DeFi Maestro",
//     totalValue: "$220,853.14",
//     performance: "+28.7%",
//     tokens: [
//       { symbol: "XEGLD", name: "xEGLD", amount: "7,166.30", value: "$185,349.27", percentage: 84.43 },
//       { symbol: "ITHEUM", name: "ITHEUM", amount: "60,948.81", value: "$33,692.25", percentage: 15.11 },
//       { symbol: "USDC", name: "USDC", amount: "1,125.67", value: "$1,125.57", percentage: 0.52 },
//       { symbol: "WEGLD", name: "Wrapped EGLD", amount: "12,500", value: "$1,019.87", percentage: 0.48 },
//       { symbol: "HTM", name: "HATOM", amount: "33.07", value: "$134.72", percentage: 0.04 },
//     ],
//     strategies: [
//       { name: "Governance", allocation: "35%" },
//       { name: "Liquidity Providing", allocation: "45%" },
//       { name: "Staking", allocation: "20%" },
//     ],
//     lastActive: "5 hours ago",
//     avatar: "/placeholder.svg?height=80&width=80",
//   },
//   {
//     id: "whale3",
//     address: "erd1tjygwhw5ylmv3v52ucvhmz0q7r0hafz4cfndjaskss5ahz28l3hqdvxqct",
//     name: "Yield Hunter",
//     totalValue: "$647,461.46",
//     performance: "+41.2%",
//     tokens: [
//       { symbol: "XEGLD", name: "xEGLD", amount: "4,200.97", value: "$647,461.48", percentage: 90.43 },
//       { symbol: "USDC", name: "USDC", amount: "38,816.70", value: "$38,802.14", percentage: 4.21 },
//       { symbol: "LEGLD", name: "Liquid EGLD", amount: "203.28", value: "$25,527.01", percentage: 3.49 },
//       { symbol: "WEGLD", name: "Wrapped EGLD", amount: "98", value: "$24.30", percentage: 0.12 },
//       { symbol: "ASH", name: "ASH", amount: "1243.44", value: "$23.33", percentage: 0.11 },
//     ],
//     strategies: [
//       { name: "Yield Farming", allocation: "60%" },
//       { name: "Staking", allocation: "25%" },
//       { name: "Lending", allocation: "15%" },
//     ],
//     lastActive: "1 day ago",
//     avatar: "/placeholder.svg?height=80&width=80",
//   },
// ];

export function WhaleAccounts() {
  const { data: whaleAccounts } = useGetWhales();

  const { toast } = useToast();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCopyStrategy = (whaleId: string) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setCopiedStates({ ...copiedStates, [whaleId]: true });
    }, 3000);
    // Set copied state for animation

    // Show toast notification
    toast({
      title: "Strategy copied!",
      description: "You've successfully copied this whale's strategy.",
      duration: 5000,
    });

    // Reset copied state after animation
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [whaleId]: false });
    }, 7000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {whaleAccounts?.map((whale) => (
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
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="tokens">Top Tokens</TabsTrigger>
                </TabsList>
                <TabsContent value="tokens" className="space-y-4 pt-3">
                  <TokenHoldings tokens={whale.tokens} />
                </TabsContent>
              </Tabs>

              <div className="text-xs text-muted-foreground">Last active: {whale.lastActive}</div>
            </CardContent>
            <CardFooter>
              <Button className="w-full relative" onClick={() => handleCopyStrategy(whale.id)}>
                {isLoading ? (
                  <span className="flex items-center">
                    {" "}
                    <Loader2 className="animate-spin" />{" "}
                  </span>
                ) : copiedStates[whale.id] ? (
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
