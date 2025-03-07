"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sendTransactions } from "@multiversx/sdk-dapp/services";
import { WarpActionExecutor } from "@vleap/warps";
import {
  useGetAccount, // if you only need the account as on network
} from "@multiversx/sdk-dapp/hooks/account";
import { useSignTransactions } from "@multiversx/sdk-dapp/hooks/transactions";
import { useRouter } from "next/navigation";

export type TWarp = {
  protocol: string;
  title: string;
  description: string;
  preview: string;
  actions: any;
  meta: {
    hash: string;
    crator: string;
    createdAt: string;
  };
};

export function WarpGrid({ warps }: { warps: TWarp[] }) {
  const router = useRouter();
  const account = useGetAccount();
  const signTransaction = useSignTransactions();
  console.log("warps", warps);

  const sendWarpTransaction = async (action: any) => {
    const ex = new WarpActionExecutor({
      env: "devnet",
      userAddress: account.address,
      currentUrl: "https://devnet-api.multiversx.com",
    });

    console.log("action is", action);

    const tx = await ex.createTransactionForExecute(action, []);

    console.log("tx is", tx);

    const { error } = await sendTransactions({
      transactions: [
        {
          value: 0,
          data: action.func,
          receiver: tx.receiver,
        },
      ],
      transactionsDisplayInfo: {
        processingMessage: "Processing distribute funds transaction",
        errorMessage: "An error has occurred during distribute funds",
        successMessage: "Distribute funds transaction successful",
      },
      redirectAfterSign: false,
    });

    console.log("error is", error);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
      {warps.map((warp, i) => (
        <motion.div
          key={warp.meta.hash}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <Card className="overflow-hidden border-2 border-transparent transition-all hover:border-primary/50">
            <CardHeader className="relative p-0">
              <div className="absolute right-2 top-2 z-10 flex gap-2">
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative aspect-[2/1] overflow-hidden">
                <Image
                  src={warp.preview || "/placeholder.svg"}
                  alt={warp.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="mb-2">{warp.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{warp.description}</p>
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary">
                  {warp.meta.createdAt}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className="flex w-full gap-4 justify-between">
                <Button className="flex-1" onClick={() => sendWarpTransaction(warp.actions[0])}>
                  {/* <Link href={`https://devnet.usewarp.to/hash%3A${warp.meta.hash}`} target="_blank"> */}
                  {warp.actions[0].label}
                  {/* </Link> */}
                </Button>
                {warp.actions.length > 1 && <Button onClick={() => router.push(`/warps/${warp.meta.hash}`)}>See all actions</Button>}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
