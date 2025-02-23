"use client";

import { ModeToggle } from "@/components/(ui)/mode-toggle";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { OnProviderLoginType } from "@multiversx/sdk-dapp/types";
import * as DappUI from "@multiversx/sdk-dapp/UI";
import { logout } from "@multiversx/sdk-dapp/utils";
import {
  useGetAccount, // if you only need the account as on network
} from "@multiversx/sdk-dapp/hooks/account";

export function Navbar({ title }: { title: string }) {
  const account = useGetAccount();

  console.log("acc is", account);

  const pathName = usePathname();

  const commonProps: OnProviderLoginType = {
    callbackRoute: pathName,
    nativeAuth: true,
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <ModeToggle />
        {!account.address ? (
          <>
            <DappUI.CrossWindowLoginButton loginButtonText="Login" {...commonProps} />
          </>
        ) : (
          <Button onClick={() => logout(pathName)}>
            {account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5)}
          </Button>
        )}
      </div>
    </header>
  );
}
