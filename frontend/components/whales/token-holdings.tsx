"use client";

import { Progress } from "@/components/ui/progress";

interface Token {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  percentage: number;
}

interface TokenHoldingsProps {
  tokens: Token[];
}

export function TokenHoldings({ tokens }: TokenHoldingsProps) {
  // Color mapping for tokens
  const getTokenColor = (symbol: string) => {
    const colors: Record<string, string> = {
      ETH: "bg-blue-500",
      USDC: "bg-blue-400",
      WBTC: "bg-orange-500",
      ARB: "bg-blue-600",
      OP: "bg-red-500",
      MKR: "bg-green-500",
      AAVE: "bg-purple-500",
      CRV: "bg-red-400",
      SNX: "bg-blue-300",
      COMP: "bg-green-400",
      UNI: "bg-pink-500",
      LINK: "bg-blue-400",
      MATIC: "bg-purple-400",
    };

    return colors[symbol] || "bg-gray-500";
  };

  return (
    <div className="space-y-3">
      {tokens.map((token, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${getTokenColor(token.symbol)}`}>
                {token.symbol.substring(0, 1)}
              </div>
              <span className="text-sm font-medium">{token.symbol}</span>
            </div>
            <span className="text-sm">{token.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={token.percentage} className="h-2" />
            <span className="text-xs text-muted-foreground">{token.percentage}%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {token.amount} {token.name}
          </p>
        </div>
      ))}
    </div>
  );
}
