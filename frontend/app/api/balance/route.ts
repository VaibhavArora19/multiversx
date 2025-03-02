// import { UserSecretKey, UserSigner } from "@multiversx/sdk-core/out";

import { Address, ApiNetworkProvider } from "@multiversx/sdk-core/out";
import { ethers } from "ethers";

export async function GET() {
  //   const secretKey = UserSecretKey.fromString(process.env.PRIVATE_KEY as string);
  //   const signer = new UserSigner(secretKey);

  //   const address = signer.getAddress().bech32();

  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const acc = await apiProv.getAccount(unformattedAddress);

  const balance = acc.balance.toString();

  const data = await fetch(`https://devnet-api.multiversx.com/accounts/${address}/tokens`, { cache: "no-store" });

  const response = await data.json();

  console.log("response: ", response);

  return Response.json({
    status: 200,
    data: [...response, { identifier: "EGLD", ticker: "EGLD", valueUsd: Number(ethers.formatEther(balance)) * 22 }],
  });
}
