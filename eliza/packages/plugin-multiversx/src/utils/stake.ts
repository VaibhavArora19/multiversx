import { Address, SmartContractTransactionsFactory, Token, TokenTransfer, TransactionsFactoryConfig, TransactionWatcher } from "@multiversx/sdk-core/out";
import { WalletProvider } from "../providers/wallet";
import { htmStakeAddress } from "../constants";

export const stake = async (walletProvider: WalletProvider, amount: number) => {
const factoryConfig = new TransactionsFactoryConfig({ chainID: "D" });

  const factory = new SmartContractTransactionsFactory({
    config: factoryConfig,
  });
  
  const address = walletProvider.getAddress()

    const transaction = factory.createTransactionForExecute({
    sender: address,
    contract: Address.fromBech32(htmStakeAddress), //!this is hardcoded as of now
    function: "stakeFarm",
    gasLimit: BigInt("20000000"),
      tokenTransfers: [
        new TokenTransfer({
          token: new Token({ identifier: "HTM-23a1da" }), //!this is hardcoded as of now
          amount: BigInt(amount * (10 ** 18)), //!read discussion on tg about this
        }),
      ],
  });
  
  const apiProv = walletProvider.getProvider();

  const nonce = (await apiProv.getAccount(address)).nonce;

  transaction.nonce = BigInt(nonce);

  const signature = await walletProvider.signTransaction(transaction)

  transaction.signature = signature;

  const txHash = await walletProvider.sendTransaction(transaction);

  return txHash;
};