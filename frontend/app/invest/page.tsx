"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { InvestmentProfileForm } from "@/components/investment/investment-profile-form";
import { Navbar } from "@/components/(ui)/navbar";
import { useGetNativeBalance } from "@/hooks/native-balance";
import { ethers } from "ethers";
import { useGetBalance } from "@/hooks/balance";

export default function ProfilePage() {
  const { data } = useGetNativeBalance();

  return (
    <>
      {data !== undefined && (
        <div className="flex min-h-screen w-full">
          {/* <AppSidebar /> */}
          <SidebarInset>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col flex-1 w-full"
            >
              <Navbar title="Invest smartly" />
              <main className="flex-1 space-y-4 p-4 md:p-8 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Investment Profile</h2>
                    <p className="text-muted-foreground">Let us understand your investment preferences to suggest the best strategies</p>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Your balance</h2>
                    <p className="text-muted-foreground text-right text-xl font-semibold">
                      <span className="text-green-500">$</span>
                      {Number(ethers.formatEther(data && data)).toFixed(4)} EGLD
                      {/* abcd */}
                    </p>
                  </div>
                </div>
                <InvestmentProfileForm />
              </main>
            </motion.div>
          </SidebarInset>
        </div>
      )}
    </>
  );
}
