"use client";

import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/(ui)/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { EnvironmentsEnum } from "@multiversx/sdk-dapp/types";
import { AxiosInterceptorContext } from "@multiversx/sdk-dapp/wrappers/AxiosInterceptorContext";
import { DappProvider } from "@multiversx/sdk-dapp/wrappers/DappProvider/DappProvider";
import QueryProvider from "@/context/queryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <DappProvider environment={EnvironmentsEnum.mainnet} customNetworkConfig={{ walletConnectV2ProjectId: "f55bca5d6156779b877eaea025ef7a54" }}>
          <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem disableTransitionOnChange>
            <AxiosInterceptorContext.Provider>
              <AxiosInterceptorContext.Interceptor authenticatedDomains={["https://tools.elrond.com", "http://localhost:3000"]}>
                <SidebarProvider>
                  <AppSidebar />
                  <SidebarTrigger />
                  <QueryProvider>{children}</QueryProvider>
                </SidebarProvider>
              </AxiosInterceptorContext.Interceptor>
            </AxiosInterceptorContext.Provider>
          </ThemeProvider>
        </DappProvider>
      </body>
    </html>
  );
}
