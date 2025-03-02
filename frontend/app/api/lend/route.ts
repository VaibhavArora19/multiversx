import { controllerAddress, egldMoneyMarketAddress, taoMoneyMarketAddress } from "@/constants";
import { Address, AddressValue, ApiNetworkProvider, QueryRunnerAdapter, SmartContractQueriesController } from "@multiversx/sdk-core/out";
import { ethers } from "ethers";

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

  const [tokens] = controller.parseQueryResponse(response);

  return (
    +Buffer.from(tokens).toString("hex") !== 0 && {
      token: "EGLD",
      amount: +ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString(), 8) / 46.4,
      value: (Number(ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString(), 8)) * 22) / 46.4,
      apy: 82.602,
      color: "bg-blue-500",
    }
  );
};

const getBorrowingPositions = async () => {
  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  const queryRunner = new QueryRunnerAdapter({
    networkProvider: apiProv,
  });

  const controller = new SmartContractQueriesController({
    queryRunner,
  });

  const query = controller.createQuery({
    contract: taoMoneyMarketAddress, //!this should be dynamic for different contracts
    function: "getStoredAccountBorrowAmount",
    arguments: [new AddressValue(unformattedAddress)],
  });

  const response = await controller.runQuery(query);

  const [tokens] = controller.parseQueryResponse(response);

  console.log("tokens: ", Buffer.from(tokens).toString("hex"));
  console.log("amount: ", ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString(), 9));
  console.log("value: ", Number(ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString())) * 338.3);

  return (
    Buffer.from(tokens).toString("hex") !== "" && {
      token: "WTAO",
      amount: ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString(), 9).toString(),
      value: Number(ethers.formatUnits(parseInt(Buffer.from(tokens).toString("hex"), 16).toString(), 9)) * 338.3,
      apy: 0.514,
      color: "bg-blue-500",
    }
  );
};

const getIsRisky = async () => {
  const address = "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20";

  const unformattedAddress = Address.fromBech32(address);

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

  const [isRisky] = controller.parseQueryResponse(response);

  return +Buffer.from(isRisky).toString("hex");
};

export async function GET() {
  const lendingPositionAmount = await getLendingPositions();

  const borrowingPositionAmount = await getBorrowingPositions();

  console.log("bb", borrowingPositionAmount);

  const borrowedPositions = [];

  borrowingPositionAmount && borrowedPositions.push(borrowingPositionAmount);

  const isRisky = await getIsRisky();

  return Response.json({
    status: 200,
    data: {
      suppliedPositions: [lendingPositionAmount],
      borrowedPositions: borrowedPositions,
      isRisky,
    },
  });
}
