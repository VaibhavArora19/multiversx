import { Address, SmartContractTransactionsFactory, Token, TokenTransfer, TransactionsFactoryConfig, TransactionWatcher } from "@multiversx/sdk-core/out";
import { WalletProvider } from "../providers/wallet";
import { htmStakeAddress } from "../constants";
import { elizaLogger } from "@elizaos/core";
import { WarpBuilder, WarpRegistry } from "@vleap/warps";


export const createStakeWarp = async (walletProvider: WalletProvider, amount: number) => {
const warpSchema = {
  protocol: "warp:0.1.0",
  name: "Staking Warp",
  title: "Allow people to stake HTM token",
  description: `Stake ${amount} HTM to hatom using warps`,
  preview: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpDvm_5mQcbME-E42u3W1X9yT55jfUPa9hdQ&s",
  actions: [
    {
      type: "contract",
      label: "Stake",
      address: "erd1qqqqqqqqqqqqqpgqvyhjh8623r3v7n267fa3g3f62vlekhqe0n4s6fp752",
      func: "stakeFarm",
      args: [],
      value: '0',
      gasLimit: 300000000,
    },
  ],
};
const address = walletProvider.getAddress();

elizaLogger.info('address is', address.toBech32());

const apiProv = walletProvider.getProvider();

const nonce = (await apiProv.getAccount(address)).nonce;

const builder = new WarpBuilder({env: "devnet", userAddress: address.toBech32()});

warpSchema.actions[0].args = [`esdt:HTM-23a1da|${nonce}|${BigInt(amount * (10 ** 18)).toString()}`]

const warp = await builder.createFromRaw(JSON.stringify(warpSchema));

const transaction = builder.createInscriptionTransaction(warp);

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