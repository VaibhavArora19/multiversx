export async function GET() {
  //   const secretKey = UserSecretKey.fromString(process.env.PRIVATE_KEY as string);
  //   const signer = new UserSigner(secretKey);

  //   const address = signer.getAddress().bech32();

  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  //   const unformattedAddress = Address.fromBech32(address);

  //   const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  //   const acc = await apiProv.getAccount(unformattedAddress);

  const data = await fetch(`https://devnet-api.multiversx.com/accounts/${address}/transactions`, { cache: "no-store" });

  const response = await data.json();

  console.log("response: ", response);

  return Response.json({
    status: 200,
    data: [response],
  });
}
