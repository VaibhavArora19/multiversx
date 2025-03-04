// import { UserSecretKey, UserSigner } from "@multiversx/sdk-core/out";

import { Address, ApiNetworkProvider } from "@multiversx/sdk-core/out";
import { ethers } from "ethers";

export async function GET() {
  //   const secretKey = UserSecretKey.fromString(process.env.PRIVATE_KEY as string);
  //   const signer = new UserSigner(secretKey);

  //   const address = signer.getAddress().bech32();

  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  const unformattedAddress = Address.fromBech32(address);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const acc = await apiProv.getAccount(unformattedAddress);

  const balance = acc.balance.toString();

  console.log("balance", balance);

  return Response.json({
    status: 200,
    data: balance,
  });
}
