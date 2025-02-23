import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const transactions = [
  {
    id: 1,
    type: "Swap",
    amount: "1.5 ETH",
    value: "$2,832.15",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "Deposit",
    amount: "500 USDC",
    value: "$500.00",
    timestamp: "5 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "Withdraw",
    amount: "0.5 ETH",
    value: "$944.05",
    timestamp: "1 day ago",
    status: "completed",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center gap-4">
          <div className={`rounded-full p-2 ${tx.type === "Withdraw" ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"}`}>
            {tx.type === "Withdraw" ? (
              <ArrowUpIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{tx.type}</p>
            <p className="text-xs text-muted-foreground">{tx.timestamp}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{tx.amount}</p>
            <p className="text-xs text-muted-foreground">{tx.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
