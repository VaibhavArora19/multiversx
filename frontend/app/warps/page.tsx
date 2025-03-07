"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { WarpGrid } from "@/components/warp/warp-grid";
import { Navbar } from "@/components/(ui)/navbar";
import { useGetWarps } from "@/hooks/warp";
import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function WarpsPage() {
  const { data } = useGetWarps();
  const router = useRouter();

  return (
    <SidebarProvider defaultOpen={true}>
      {data && (
        <div className="flex min-h-screen w-full">
          <SidebarInset>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col flex-1"
            >
              <Navbar title="Warps" />
              <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Warps</h2>
                    <p className="text-muted-foreground">Discover and create DeFi warps for various purposes</p>
                  </div>
                  <div>
                    <Button onClick={() => router.push("/warps/create")}>
                      <LuPlus />
                      Warp for smart contracts
                    </Button>
                  </div>
                </div>
                <WarpGrid warps={data} />
              </main>
            </motion.div>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
