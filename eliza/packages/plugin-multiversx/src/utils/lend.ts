import { Address, SmartContractTransactionsFactory, TransactionsFactoryConfig } from "@multiversx/sdk-core/out";
import { egldMoneyMarketAddress } from "../constants";
import { WalletProvider } from "../providers/wallet";

export const lendToken = async (walletProvider: WalletProvider, amount: number): Promise<string> => {
  const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });

  const factory = new SmartContractTransactionsFactory({
    config: factoryConfig,
  });
  
  const address = walletProvider.getAddress()

    const transaction = factory.createTransactionForExecute({
    sender: address,
    contract: Address.fromBech32(egldMoneyMarketAddress), //!this is hardcoded as of now
    function: "mint",
    gasLimit: BigInt("50000000"),
    nativeTransferAmount: BigInt(amount * 10 ** 18)
  });
  
  const apiProv = walletProvider.getProvider();

  const nonce = (await apiProv.getAccount(address)).nonce;

  transaction.nonce = BigInt(nonce);

  const signature = await walletProvider.signTransaction(transaction)

  transaction.signature = signature;

  const txHash = await walletProvider.sendTransaction(transaction);

  return txHash;

};
