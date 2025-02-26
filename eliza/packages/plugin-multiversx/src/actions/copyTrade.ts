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
import { copyTradeSchema, createTokenSchema } from "../utils/schemas";
export interface CreateTokenContent extends Content {
    walletAddress: string;
}
import { isUserAuthorized } from "../utils/accessTokenManagement";
import { MVX_NETWORK_CONFIG } from "../constants";
import { NativeAuthProvider } from "../providers/nativeAuth";
import { GraphqlProvider } from "../providers/graphql";
import { denominateAmount } from "../utils/amount";
import { swapToken, TVariables } from "../utils/copy";

const copyTradeTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "walletAddress": "erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20",
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token creation:
- Wallet Address

Respond with a JSON markdown block containing only the extracted values.`;

export default {
    name: "COPY_TRADE",
    similes: ["COPY_TOKEN", "COPY", "COPY_WALLET"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Copy trading a wallet address.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting COPY_TRADE handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to copy trade a wallet:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to copy trade a wallet.",
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
            template: copyTradeTemplate,
        });

        // Generate transfer content
        const content = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
            schema: copyTradeSchema,
        });

        const payload = content.object as CreateTokenContent;
        const isCreateTokenContent =
            payload.walletAddress && payload.walletAddress && payload.walletAddress;

        // Validate transfer content
        if (!isCreateTokenContent) {
            elizaLogger.error("Invalid content for COPY_TRADE action.");
            if (callback) {
                callback({
                    text: "Unable to process copy trade request. Invalid content provided.",
                    content: { error: "Invalid copy trade content" },
                });
            }
            return false;
        }

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const networkConfig = MVX_NETWORK_CONFIG[network];
            const walletProvider = new WalletProvider(privateKey, network);

            //!fetch all the tokens held by the wallet here and then distribute the current wallet egld balance in percentage in respect to other tokens


            const nativeAuthProvider = new NativeAuthProvider({
                apiUrl: networkConfig.apiURL,
            });

            await nativeAuthProvider.initializeClient();
            const address = walletProvider.getAddress().toBech32();

            const accessToken =
                await nativeAuthProvider.getAccessToken(walletProvider);

            const graphqlProvider = new GraphqlProvider(
                networkConfig.graphURL,
                { Authorization: `Bearer ${accessToken}` },
            );


            const value = denominateAmount({
                amount: 'amount of egld to send each round',
                decimals: 18,
            });

            let variables: TVariables = {
                amountIn: value,
                tokenInID: "EGLD",
                tokenOutID: 'we will soon find out',
                tolerance: 0.01,
                sender: address,
            }

            //!do this inside a loop for X no of tokens
            await swapToken(walletProvider, graphqlProvider, variables);
                        
            //!here goes the implementation of the copytrade

            // callback?.({
            //     text: `Transaction sent successfully! You can view it here: ${txURL}.`,
            // });
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
                    text: "Create a token XTREME with ticker XTR and supply of 10000",
                    action: "CREATE_TOKEN",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Successfully created token.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a token TEST with ticker TST, 18 decimals and supply of 10000",
                    action: "CREATE_TOKEN",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Successfully created token.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
