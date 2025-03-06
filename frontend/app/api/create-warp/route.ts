import { ApiNetworkProvider, TransactionComputer, TransactionWatcher, UserSecretKey, UserSigner } from "@multiversx/sdk-core/out";
import { Warp, WarpBuilder, WarpRegistry } from "@vleap/warps";
import { NextRequest } from "next/server";

// const warpSchema = {
//   protocol: "warp:0.1.0",
//   name: "Staking Warp",
//   title: "Allow people to stake HTM token",
//   description: `Stake HTM to hatom using warps`,
//   preview: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpDvm_5mQcbME-E42u3W1X9yT55jfUPa9hdQ&s",
//   actions: [
//     {
//       type: "contract",
//       label: "Stake",
//       address: "erd1qqqqqqqqqqqqqpgqvyhjh8623r3v7n267fa3g3f62vlekhqe0n4s6fp752",
//       func: "stakeFarm",
//       args: [],
//       value: "0",
//       gasLimit: 300000000,
//     },
//   ],
// };
export async function GET(req: NextRequest) {
  const { name, title, descripton, preview, contractAddress, abi } = await req?.json();

  const actions: Warp["actions"] = abi.endpoints.map((endpoint) => {
    const action: any = {
      type: endpoint.mutability === "mutable" ? "contract" : "query",
      label: endpoint.name + endpoint.mutability === "readonly" ? " (read-only)" : "",
      address: contractAddress,
      func: endpoint.name,
      args: [],
      gasLimit: 500000000,
      inputs: [],
    };

    if (endpoint?.payableInTokens && endpoint.payableInTokens[0] == "*") {
      action.inputs.push({
        name: "amount",
        type: "esdt",
        position: "transfer",
        source: "field",
        required: true,
        options: ["UTK-2f80e9", "USDC-350c4e", "WTAO-f94e58"],
      });
    } else if (endpoint.payableInTokens[0] == "EGLD") {
      action.inputs.push({
        name: "amount",
        type: "biguint",
        position: "value",
        source: "field",
        required: true,
      });
    }

    if (endpoint.inputs.length > 0) {
      let count = 1;
      //@ts-ignore
      endpoint.inputs.forEach((input) => {
        action.inputs.push({
          name: input.name,
          description: input.name,
          type: input.type.includes("optional") ? input.type.match(/<(.+?)>/)[1] : input.type.toLowerCase(),
          position: `arg:${count}`,
          source: "field",
          required: input.type.includes("optional") ? false : true,
        });

        count++;
      });
    }
  });

  console.log("actions: ", actions);

  const warpSchema: Warp = {
    protocol: "warp:0.1.0",
    name: name,
    title: title,
    description: descripton,
    preview: preview,
    actions,
  };

  // ================================================================================================

  const secretKey = UserSecretKey.fromString(process.env.PRIVATE_KEY as string);
  const signer = new UserSigner(secretKey);

  const address = signer.getAddress();

  const builder = new WarpBuilder({ env: "devnet", userAddress: address.toBech32() });

  const warp = await builder.createFromRaw(JSON.stringify(warpSchema));

  const transaction = builder.createInscriptionTransaction(warp);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const nonce = (await apiProv.getAccount(address)).nonce;

  transaction.nonce = BigInt(nonce);

  const computer = new TransactionComputer();
  const serializedTx = computer.computeBytesForSigning(transaction); // Prepare transaction for signing

  const signature = await signer.sign(serializedTx);

  transaction.signature = signature;

  const txHash = await apiProv.sendTransaction(transaction);

  await new TransactionWatcher(apiProv).awaitCompleted(txHash);

  const registry = new WarpRegistry({ env: "devnet", userAddress: address.toBech32() });

  await registry.init();

  const transaction2 = registry.createWarpRegisterTransaction(txHash);

  const nonce2 = (await apiProv.getAccount(address)).nonce;

  transaction2.nonce = BigInt(nonce2);

  const computer2 = new TransactionComputer();
  const serializedTx2 = computer2.computeBytesForSigning(transaction2); // Prepare transaction for signing

  const signature2 = await signer.sign(serializedTx2);

  transaction2.signature = signature2;

  const txHash2 = await apiProv.sendTransaction(transaction2);

  return {
    status: 200,
    data: `https://devnet.usewarp.to/hash%3A${txHash}`,
  };
}
