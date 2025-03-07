"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { WarpDetails } from "@/components/warp/warp-details";
import { Navbar } from "@/components/(ui)/navbar";

export default function WarpDetailsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <SidebarInset>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col flex-1">
            <Navbar title="Warp Details" />
            <main className="flex-1 p-4 md:p-8 pt-2">
              <WarpDetails />
            </main>
          </motion.div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
