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
import { lendTokenSchema } from "../utils/schemas";
export interface CreateTokenContent extends Content {
    tokenName: string;
    amount: number;
}
import { isUserAuthorized } from "../utils/accessTokenManagement";
import { lendToken } from "../utils/lend";

const createTokenTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "tokenName": "TEST",
    "amount: 100,
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token creation:
- Token name
- Amount


Respond with a JSON markdown block containing only the extracted values.`;

export default {
    name: "LEND_TOKEN",
    similes: ["SUPPLY_TOKEN"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Lend a token.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting LEND_TOKEN handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to lend a token:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to lend a token.",
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
            template: createTokenTemplate,
        });

        // Generate transfer content
        const content = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
            schema: lendTokenSchema,
        });

        const payload = content.object as CreateTokenContent;
        const isCreateTokenContent =
            payload.tokenName && payload.tokenName && payload.tokenName;

        // Validate transfer content
        if (!isCreateTokenContent) {
            elizaLogger.error("Invalid content for LEND_TOKEN action.");
            if (callback) {
                callback({
                    text: "Unable to process lend request. Invalid content provided.",
                    content: { error: "Invalid lend content" },
                });
            }
            return false;
        }


        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            //!lend here, pass on the token as well later on
            const txHash = await lendToken(walletProvider, payload.amount);

            const txURL = walletProvider.getTransactionURL(txHash);
            callback?.({
                text: `Transaction sent successfully! You can view it here: ${txURL}`,
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
                    text: "Lend 0.3 EGLD tokens for me",
                    action: "LEND_TOKEN",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully lent token.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Lend 100 XTREME with ticker XTR",
                    action: "LEND_TOKEN",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully lent token.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "LEND a token TEST with ticker TST of value 2000",
                    action: "LEND_TOKEN",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully lent token.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
