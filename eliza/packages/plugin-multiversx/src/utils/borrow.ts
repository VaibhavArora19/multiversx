import { Address, SmartContractTransactionsFactory, TransactionsFactoryConfig, TransactionWatcher, U32Value } from "@multiversx/sdk-core/out";
import { taoMoneyMarketAddress } from "../constants";
import { WalletProvider } from "../providers/wallet";
import { elizaLogger } from "@elizaos/core";
import { WarpBuilder, WarpRegistry } from "@vleap/warps";

export const createBorrowWarp = async (walletProvider: WalletProvider, amount: number) => {
const warpSchema = {
  protocol: "warp:0.1.0",
  name: "Borrowing Warp",
  title: "Allow people to borrow on hatom",
  description: `Borrow ${amount} WTAO from hatom using warps`,
  preview: "https://pbs.twimg.com/media/Fguvr4LXgAErJ-I?format=jpg",
  actions: [
    {
      type: "contract",
      label: "Borrow",
      address: "erd1qqqqqqqqqqqqqpgqara7qx6funfum8jy30fctvre23rffxw4v5ysnzmlnt",
      func: "borrow",
      args: [`biguint:${BigInt(amount * 10 ** 9).toString()}`],
      value: '0',
      gasLimit: 300000000,
    },
  ],
};
const address = walletProvider.getAddress();

elizaLogger.info('address is', address.toBech32());

const builder = new WarpBuilder({env: "devnet", userAddress: address.toBech32()});

const warp = await builder.createFromRaw(JSON.stringify(warpSchema));

const transaction = builder.createInscriptionTransaction(warp);

const apiProv = walletProvider.getProvider();

const nonce = (await apiProv.getAccount(address)).nonce;

transaction.nonce = BigInt(nonce);

const signature = await walletProvider.signTransaction(transaction)

transaction.signature = signature;

const txHash = await walletProvider.sendTransaction(transaction);

await new TransactionWatcher(apiProv).awaitCompleted(txHash);

elizaLogger.info('txhash is: ', txHash.toString())

const registry = new WarpRegistry({env: 'devnet', userAddress: address.toBech32()});

await registry.init();

const transaction2 = registry.createWarpRegisterTransaction(txHash);

const nonce2 = (await apiProv.getAccount(address)).nonce;

transaction2.nonce = BigInt(nonce2);

const signature2 = await walletProvider.signTransaction(transaction2)

transaction2.signature = signature2;

const txHash2 = await walletProvider.sendTransaction(transaction2);
elizaLogger.info('txhash2 is: ', txHash2.toString())

return `https://devnet.usewarp.to/hash%3A${txHash}`

};

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
