import { Address, SmartContractTransactionsFactory, TransactionsFactoryConfig, U32Value } from "@multiversx/sdk-core/out";
import { taoMoneyMarketAddress } from "../constants";
import { WalletProvider } from "../providers/wallet";

export const borrowToken = async (walletProvider: WalletProvider, amount: number): Promise<string> => {
  const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });

  const factory = new SmartContractTransactionsFactory({
    config: factoryConfig,
  });
  
  const address = walletProvider.getAddress()

    //*borrow
    const transaction = factory.createTransactionForExecute({
    sender: address,
    contract: Address.fromBech32(taoMoneyMarketAddress), 
    function: "borrow",
    gasLimit: BigInt("260000000"),
    arguments: [new U32Value(BigInt(amount * 10 ** 9))] //!this is applicable to borrowing tao only as it contains 9 decimals
  });
  
  const apiProv = walletProvider.getProvider();

  const nonce = (await apiProv.getAccount(address)).nonce;

  transaction.nonce = BigInt(nonce);

  const signature = await walletProvider.signTransaction(transaction)

  transaction.signature = signature;

  const txHash = await walletProvider.sendTransaction(transaction);

  return txHash;

};
