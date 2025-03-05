import { ethers } from "ethers";

export async function GET() {
  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  const data = await fetch(`https://devnet-api.multiversx.com/address/${address}/esdt`, {
    cache: "no-store",
  });

  const response = await data.json();

  const stakedTokens = response.data.esdts["SHTM-f9301a-03b6"];

  if (!stakedTokens) {
    return Response.json({
      status: 200,
      data: [],
    });
  }

  console.log("response: ", response);

  return Response.json({
    status: 200,
    data: [
      {
        token: "HTM",
        amount: ethers.formatUnits(stakedTokens.balance, 18),
        value: +ethers.formatUnits(stakedTokens.balance, 18) * 4.2,
        apy: 1.61,
        color: "bg-green-500",
      },
    ],
  });
}
