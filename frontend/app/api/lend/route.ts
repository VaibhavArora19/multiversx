// import { UserSecretKey, UserSigner } from "@multiversx/sdk-core/out";

import { controllerAddress, egldMoneyMarketAddress } from "@/constants";
import { Address, AddressValue, ApiNetworkProvider, QueryRunnerAdapter, SmartContractQueriesController } from "@multiversx/sdk-core/out";

const getLendingPositions = async () => {
  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

  const egldAddress = Address.fromBech32(egldMoneyMarketAddress);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const queryRunner = new QueryRunnerAdapter({
    networkProvider: apiProv,
  });

  const controller = new SmartContractQueriesController({
    queryRunner,
  });

  const query = controller.createQuery({
    contract: controllerAddress,
    function: "getAccountTokens",
    arguments: [new AddressValue(egldAddress), new AddressValue(unformattedAddress)],
  });

  const response = await controller.runQuery(query);

  console.log("response is: ", response);

  const [tokens] = controller.parseQueryResponse(response);

  console.log("getaccounttokens: ", parseInt(Buffer.from(tokens).toString("hex"), 16)); //!the amount of hegld tokens you have deposited, divide it by 46.66 after parsing it with 8 decimals and you will get the amount of egld

  return parseInt(Buffer.from(tokens).toString("hex"), 16);
};

const getBorrowingPositions = async () => {
  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

  const egldAddress = Address.fromBech32(egldMoneyMarketAddress);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const queryRunner = new QueryRunnerAdapter({
    networkProvider: apiProv,
  });

  const controller = new SmartContractQueriesController({
    queryRunner,
  });

  const query = controller.createQuery({
    contract: egldMoneyMarketAddress, //!this should be dynamic for different contracts
    function: "getStoredAccountBorrowAmount",
    arguments: [new AddressValue(unformattedAddress)],
  });

  const response = await controller.runQuery(query);

  console.log("response is: ", response);

  const [tokens] = controller.parseQueryResponse(response);

  console.log("getaccounttokens: ", parseInt(Buffer.from(tokens).toString("hex"), 16)); //!the amount of hegld tokens you have deposited, divide it by 46.66 after parsing it with 8 decimals and you will get the amount of egld

  return parseInt(Buffer.from(tokens).toString("hex"), 16);
};

const getIsRisky = async () => {
  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

  //   const egldAddress = Address.fromBech32(controllerAddress);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const queryRunner = new QueryRunnerAdapter({
    networkProvider: apiProv,
  });

  const controller = new SmartContractQueriesController({
    queryRunner,
  });

  const query = controller.createQuery({
    contract: controllerAddress, //!this should be dynamic for different contracts
    function: "isRisky",
    arguments: [new AddressValue(unformattedAddress)],
  });

  const response = await controller.runQuery(query);

  console.log("response is: ", response);

  const [isRisky] = controller.parseQueryResponse(response);

  console.log("is risky", +Buffer.from(isRisky).toString("hex"));

  return +Buffer.from(isRisky).toString("hex");
  //   console.log("getaccounttokens: ", parseInt(Buffer.from(tokens).toString(""), 16)); //!the amount of hegld tokens you have deposited, divide it by 46.66 after parsing it with 8 decimals and you will get the amount of egld

  //   return parseInt(Buffer.from(tokens).toString("hex"), 16);
};

export async function GET() {
  const lendingPositionAmount = await getLendingPositions();

  const borrowingPositionAmount = await getBorrowingPositions();

  const isRisky = await getIsRisky();

  return Response.json({
    status: 200,
    data: {
      lendingPositionAmount,
      borrowingPositionAmount,
      isRisky,
    },
  });
}
