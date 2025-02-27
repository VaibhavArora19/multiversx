"use client";

// import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/(ui)/navbar";
import { SidebarInset } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { WhaleAccounts } from "@/components/whales/whale-accounts";

export default function WhalesPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* <AppSidebar /> */}
      <SidebarInset>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col flex-1">
          <Navbar title={"Top Accounts"} />
          <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Whale Accounts</h2>
              <p className="text-muted-foreground">Track and copy strategies from top DeFi users</p>
            </div>
            <WhaleAccounts />
          </main>
        </motion.div>
      </SidebarInset>
    </div>
  );
}
