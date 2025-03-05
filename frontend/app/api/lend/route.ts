import { controllerAddress, egldMoneyMarketAddress, taoMoneyMarketAddress } from "@/constants";
import {
  Address,
  AddressValue,
  ApiNetworkProvider,
  BigUIntType,
  BinaryCodec,
  QueryRunnerAdapter,
  ResultsParser,
  SmartContract,
  SmartContractQueriesController,
} from "@multiversx/sdk-core/out";
import { ethers } from "ethers";

const getLendingPositions = async () => {
  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  const unformattedAddress = Address.fromBech32(address);

  const egldAddress = Address.fromBech32(egldMoneyMarketAddress);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  let legacyDelegationContract = new SmartContract({
    address: Address.fromBech32(controllerAddress),
  });

  const query = legacyDelegationContract.createQuery({
    func: "getAccountTokens",
    args: [new AddressValue(egldAddress), new AddressValue(unformattedAddress)],
  });

  const queryResponse = await apiProv.queryContract(query);

  let bundle = new ResultsParser().parseUntypedQueryResponse(queryResponse);
  let firstValue = bundle.values[0];
  let decodedValue = new BinaryCodec().decodeTopLevel(firstValue, new BigUIntType());

  const value = decodedValue.valueOf();

  console.log("decoded value for lend is", value);
  console.log("unformatted", +ethers.formatUnits(parseInt(value.toString()).toString(), 8) / 46);

  return (
    value.toString() !== "0" && {
      token: "EGLD",
      amount: (+ethers.formatUnits(parseInt(value.toString()).toString(), 8) / 46).toFixed(4),
      value: ((+ethers.formatUnits(parseInt(value.toString()).toString(), 8) * 22) / 46).toFixed(4),
      apy: 82.602,
      color: "bg-blue-500",
    }
  );
};

const getBorrowingPositions = async () => {
  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

  const unformattedAddress = Address.fromBech32(address);

  const apiProv = new ApiNetworkProvider("https://devnet-api.multiversx.com");

  let legacyDelegationContract = new SmartContract({
    address: Address.fromBech32(taoMoneyMarketAddress),
  });

  const query = legacyDelegationContract.createQuery({
    func: "getStoredAccountBorrowAmount",
    args: [new AddressValue(unformattedAddress)],
  });

  const queryResponse = await apiProv.queryContract(query);

  let bundle = new ResultsParser().parseUntypedQueryResponse(queryResponse);
  let firstValue = bundle.values[0];
  let decodedValue = new BinaryCodec().decodeTopLevel(firstValue, new BigUIntType());

  const value = decodedValue.valueOf();

  console.log("decoded value for borrow is", decodedValue.valueOf().toFixed(0));
  return (
    value.toString() !== "0" && {
      token: "WTAO",
      amount: (+ethers.formatUnits(parseInt(value.toString()).toString(), 9)).toFixed(4),
      value: (+ethers.formatUnits(parseInt(value.toString()).toString(), 9) * 338.6).toFixed(4),
      apy: 0.514,
      color: "bg-pink-500",
    }
  );
};

const getIsRisky = async () => {
  const address = "erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger";

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

  console.log("is risky", +Buffer.from(isRisky).toString("hex"));

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
