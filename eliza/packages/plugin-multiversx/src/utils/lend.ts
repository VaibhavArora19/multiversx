import { Address, SmartContractTransactionsFactory, Token, TokenTransfer, TransactionsFactoryConfig, TransactionWatcher } from "@multiversx/sdk-core/out";
import { egldMoneyMarketAddress, hatomControllerAddress } from "../constants";
import { WalletProvider } from "../providers/wallet";
import { WarpBuilder, WarpRegistry } from "@vleap/warps";
import { elizaLogger } from "@elizaos/core";

export const createLendWarp = async (walletProvider: WalletProvider, amount: number) => {
const warpSchema = {
  protocol: "warp:0.1.0",
  name: "Lending Warp",
  title: "Allow people to lend on hatom",
  description: `Lend ${amount} EGLD to hatom using warps`,
  preview: "https://pbs.twimg.com/media/Fguvr4LXgAErJ-I?format=jpg",
  actions: [
    {
      type: "contract",
      label: "Supply",
      address: "erd1qqqqqqqqqqqqqpgq2udp46dvs4cvp4urak39t2fqxp7t3lpzv5ysec452j",
      func: "mint",
      args: [],
      value: BigInt(amount * 10 ** 18).toString(),
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
    gasLimit: BigInt("300000000"),
    nativeTransferAmount: BigInt(amount * 10 ** 18)
  });
  
  const apiProv = walletProvider.getProvider();

  const nonce = (await apiProv.getAccount(address)).nonce;

  transaction.nonce = BigInt(nonce);

  const signature = await walletProvider.signTransaction(transaction)

  transaction.signature = signature;

  const txHash = await walletProvider.sendTransaction(transaction);

  //* wait for transaction to be completed
  await new TransactionWatcher(apiProv).awaitCompleted(txHash);

  //* then put the money as collateral
  const transaction2 = factory.createTransactionForExecute({
      sender: address,
      contract: Address.fromBech32(hatomControllerAddress), 
      function: "enterMarkets",
      gasLimit: BigInt("300000000"),
      tokenTransfers: [
        new TokenTransfer({
          token: new Token({ identifier: "HEGLD-ae8054" }), //!this is hardcoded as of now
          amount: BigInt(amount * 45 * (10 ** 8)), //!read discussion on tg about this
        }),
      ],
    });

    
    const nonce2 = (await apiProv.getAccount(address)).nonce;
    
    transaction2.nonce = BigInt(nonce2);
    
    const signature2 = await walletProvider.signTransaction(transaction2)
    
    transaction2.signature = signature2;
    
    await walletProvider.sendTransaction(transaction2);

    return txHash;

};
