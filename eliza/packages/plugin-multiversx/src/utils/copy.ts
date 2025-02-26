import { Transaction, TransactionPayload } from "@multiversx/sdk-core/out";
import { SwapResultType } from "../actions/swap";
import { swapQuery } from "../graphql/swapQuery";
import { GraphqlProvider } from "../providers/graphql";
import { WalletProvider } from "../providers/wallet";

export type TVariables = {
    amountIn: string;
    tokenInID: string;
    tokenOutID: string;
    tolerance: number,
    sender: string;
}

export const swapToken = async (walletProvider: WalletProvider, graphqlProvider: GraphqlProvider, variables: TVariables) => {

    const { swap } = await graphqlProvider.query<SwapResultType>(
        swapQuery,
        variables
    );

    if (!swap.noAuthTransactions) {
        throw new Error("No route found");
    }
    
    const txURLs = await Promise.all(
        swap.noAuthTransactions.map(async (transaction) => {
            const txToBroadcast = { ...transaction };
                txToBroadcast.sender = variables.sender;
                txToBroadcast.data = TransactionPayload.fromEncoded(
                    transaction.data as unknown as string,
                );
    
                const account = await walletProvider.getAccount(
                    walletProvider.getAddress(),
                );
                txToBroadcast.nonce = account.nonce;
    
                const tx = new Transaction(txToBroadcast);
                const signature = await walletProvider.signTransaction(tx);
                tx.applySignature(signature);
    
                const txHash = await walletProvider.sendTransaction(tx);
                return walletProvider.getTransactionURL(txHash); // Return the transaction URL
            }),
        );
    
    const transactionURLs = txURLs.join(",");

    return transactionURLs;
}