import { Address, SmartContractTransactionsFactory, TransactionsFactoryConfig, TransactionWatcher, U32Value } from "@multiversx/sdk-core/out";
import { taoMoneyMarketAddress, tokenList } from "../constants";
import { WalletProvider } from "../providers/wallet";
import { elizaLogger } from "@elizaos/core";
import { Warp, WarpBuilder, WarpRegistry } from "@vleap/warps";

export const createBorrowWarp = async (walletProvider: WalletProvider, tokenName: string, amount?: number) => {
const addr = tokenList.find(token => token.identifier === tokenName);

if(!addr) {
  throw new Error("No token found");
}


const warpSchema: Warp = {
  protocol: "warp:0.1.0",
  name: "Borrowing Warp",
  title: "Allow people to borrow on hatom",
  description: `Borrow ${amount ? amount + ' of' : " "}  ${tokenName} from hatom using warpss`,
  preview: "https://pbs.twimg.com/media/Fguvr4LXgAErJ-I?format=jpg",
  actions: [
    {
      type: "contract",
      label: "Borrow",
      address: addr.mmAddress,
      func: "borrow",
      args: [],
      gasLimit: 300000000,
      value: '0'
    },
  ],
};

if(amount) {
  //@ts-ignore
warpSchema.actions[0].args = [`biguint:${BigInt(amount * 10 ** addr.decimals).toString()}`]
} else {
 
  warpSchema.actions[0].inputs = [
    {
      name: "amount",
      description: "amount of the token",
      type: "biguint",
      position: "arg:1",
      source: "field",
      required: true,
      modifier: `scale:${addr.decimals.toString()}`
    }
  ]
}

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
