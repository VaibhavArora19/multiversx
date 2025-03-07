"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { CreateWarpForm } from "@/components/warp/create-warp-form";
import { Navbar } from "@/components/(ui)/navbar";

export default function CreateWarpPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SidebarInset>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col flex-1">
            <Navbar title="Create Warp from smart contract" />
            <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Create Warp</h2>
                  <p className="text-muted-foreground">Fill in the details to create a new DeFi warp</p>
                </div>
              </div>
              <CreateWarpForm />
            </main>
          </motion.div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
