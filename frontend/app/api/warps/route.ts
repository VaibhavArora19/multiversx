import { Address } from "@multiversx/sdk-core/out";
import { WarpRegistry, WarpBuilder, WarpActionExecutor } from "@vleap/warps";
import { NextRequest } from "next/server";
import JSONbig from "json-bigint";

export async function GET() {
  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  const w = new WarpRegistry({
    env: "devnet",
    userAddress: address,
  });

  const b = new WarpBuilder({
    env: "devnet",
    userAddress: address,
  });

  const data = await w.getUserWarpRegistryInfos(address);

  const unformattedAddress = Address.fromBech32(address);

  const queryArr = data.map((wData) => {
    return b.createFromTransactionHash(wData.hash);
  });

  const dataArr = await Promise.all(queryArr);

  console.log("dataArr", dataArr);

  return Response.json({
    status: 200,
    data: dataArr.filter((d) => d !== null),
  });
}

export async function POST(req: NextRequest) {
  const { action } = await req?.json();

  const ex = new WarpActionExecutor({
    env: "devnet",
    userAddress: "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger",
    currentUrl: "https://devnet-api.multiversx.com",
  });

  console.log("action is", action);

  const tx = await ex.createTransactionForExecute(action[0], []);

  console.log("tx is", tx);

  return Response.json({
    status: 200,
    data: JSONbig.stringify(tx),
  });
}
