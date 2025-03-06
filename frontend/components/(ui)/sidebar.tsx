"use client";

import { LayoutDashboard, MessageSquare, LineChart, Wallet, Settings, HelpCircle, DollarSign } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4 cursor-pointer" onClick={() => router.push("/")}>
        <h2 className="text-lg font-semibold">DeFiVerse</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/"}>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/warps">
                <Wallet className="h-4 w-4" />
                <span>Warps</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/chat">
                <MessageSquare className="h-4 w-4" />
                <span>AI Chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/whales">
                <Wallet className="h-4 w-4" />
                <span>Top Wallets</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/invest">
                <DollarSign className="h-4 w-4" />
                <span>Invest</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="https://vaibhavcodes.vercel.app/about" target="_blank">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
