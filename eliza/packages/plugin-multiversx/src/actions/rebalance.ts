import {
    elizaLogger,
    type ActionExample,
    type Content,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    generateObject,
    composeContext,
    type Action,
} from "@elizaos/core";
import { WalletProvider } from "../providers/wallet";
import { validateMultiversxConfig } from "../environment";
import { copyTradeSchema, createTokenSchema, rebalanceSchema } from "../utils/schemas";
export interface CreateTokenContent extends Content {
    walletAddress: string;
}
import { isUserAuthorized } from "../utils/accessTokenManagement";
import { MVX_NETWORK_CONFIG } from "../constants";
import { NativeAuthProvider } from "../providers/nativeAuth";
import { GraphqlProvider } from "../providers/graphql";
import { denominateAmount } from "../utils/amount";
import { swapToken, TVariables } from "../utils/copy";
import BigNumber from "bignumber.js";

const rebalance = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "tokenIn": "EGLD",
    "amountIn": "1",
    "tokenOut": "MEX"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Source token
- Amount to transfer
- Destination token

Respond with a JSON markdown block containing only the extracted values.`;

export default {
    name: "REBALANCE",
    similes: ["REBALANCE_PORTFOLIO", "REBALANCE_TOKENS"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Rebalancing user portfolio.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting RABALANCE handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to rebalance a wallet:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to rebalance a wallet.",
                    content: { error: "Unauthorized user" },
                });
            }
            return false;
        }

        // Initialize or update state
        // if (!state) {
        //     state = (await runtime.composeState(message)) as State;
        // } else {
        //     state = await runtime.updateRecentMessageState(state);
        // }

        // Initialize or update state
        let currentState: State;
        if (!state) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(state);
        }

        // Compose transfer context
        const transferContext = composeContext({
            state: currentState,
            template: rebalance,
        });

        // Generate transfer content
        const content = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
            schema: rebalanceSchema,
        });

        const payload = content.object as CreateTokenContent;
        const isCreateTokenContent =
            payload.walletAddress && payload.walletAddress && payload.walletAddress;

        // Validate transfer content
        if (!isCreateTokenContent) {
            elizaLogger.error("Invalid content for REBALANCE action.");
            if (callback) {
                callback({
                    text: "Unable to process copy trade request. Invalid content provided.",
                    content: { error: "Invalid rebalance content" },
                });
            }
            return false;
        }

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const networkConfig = MVX_NETWORK_CONFIG[network];
            const walletProvider = new WalletProvider(privateKey, network);

            //*fetch the balance of each token in wallet and their percentage

            const balance = await walletProvider.getBalanceForWallet(payload.walletAddress);
            const estdsBalance = await walletProvider.getTokensData(payload.walletAddress) as Array<any>;

            const tokensArray = [
                {
                    tokenName: 'EGLD',
                    balanceUSD: Number(new BigNumber(balance).shiftedBy(-18).toFixed(4)) * 21,
                    percentage: 0,
                    identifier: 'EGLD'
                }
            ];

            estdsBalance.forEach((data) => {
                tokensArray.push({
                    tokenName: data.ticker,
                    balanceUSD: data?.valueUsd ?? 0,
                    percentage: 0,
                    identifier: data.identifier,
                })
            })

            let sum = 0;

            tokensArray.forEach(token => sum += token.balanceUSD);
            
            elizaLogger.info('sum is: ', sum.toString());

            const tokensBalance = tokensArray.map(data => {
                return {
                    ...data,
                    percentage: (data.balanceUSD / sum) * 100,
                }
            });

            elizaLogger.info('tokens array: ', tokensBalance);

            //*wallet balance fetching ends here


            const nativeAuthProvider = new NativeAuthProvider({
                apiUrl: networkConfig.apiURL,
            });

            await nativeAuthProvider.initializeClient();
            const address = walletProvider.getAddress().toBech32();

            const nativeWalletBalance = await walletProvider.getBalanceForWallet(address);

            elizaLogger.info('native wallet balance: ', nativeWalletBalance.toString());
            
            const accessToken =
                await nativeAuthProvider.getAccessToken(walletProvider);

            const graphqlProvider = new GraphqlProvider(
                networkConfig.graphURL,
                { Authorization: `Bearer ${accessToken}` },
            );

            const funcArray = tokensBalance.map((token) => {

                if(token.percentage == 0 || token.identifier== "EGLD" || token.identifier === "WEGLD-a28c59" || token.percentage < 7) {
                    return;
                }

                
                let variables: TVariables = {
                    amountIn: new BigNumber(nativeWalletBalance).multipliedBy(token.percentage / 100).toString().split(".")[0],
                    tokenInID: "EGLD",
                    tokenOutID: token.identifier,
                    tolerance: 0.01,
                    sender: address,
                }

                elizaLogger.info('variables are: ', variables);

                return swapToken(walletProvider, graphqlProvider, variables);
            });

            const txUrls = await Promise.all(funcArray);

            const transactionHashes = txUrls.join(",")

            callback?.({
                text: `Transaction sent successfully! You can view it here: ${transactionHashes}.`,
            });
            return true;
        } catch (error) {
            elizaLogger.error("Error during creating token:", error);
            if (callback) {
                callback({
                    text: `Error creating token: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Copy trade this address erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20",
                    action: "COPY_TRADE",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully copy traded the wallet address.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you copy all the tokens from this wallet erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20",
                    action: "COPY_TRADE",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully copied all the tokens from this wallet.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
