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
import { createBorrowWarp } from "../utils/borrow";

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
    name: "BORROW_WARP",
    similes: ["BORROWING_WARP", "WARP_BORROW"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Create a warp for borrowing.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting BORROW_WARP handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to  a warp:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to borrow a warp.",
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
            elizaLogger.error("Invalid content for BORROW_WARP action.");
            if (callback) {
                callback({
                    text: "Unable to process borrow request. Invalid content provided.",
                    content: { error: "Invalid borrow content" },
                });
            }
            return false;
        }


        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            const warpUrl = await createBorrowWarp(walletProvider, payload.amount)

            callback?.({
                text: `Warp created Successfully! You can view your warp here: ${warpUrl}`,
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
                    text: "Create a warp to borrow 0.3 WTAO tokens for me",
                    action: "BORROW_WARP",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully created warp for borrowing.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a warp to borrow 100 XTREME with ticker XTR",
                    action: "BORROW_WARP",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully created warp for borrowing.",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a warp to borrow a token TEST with ticker TST of value 2000",
                    action: "BORROW_WARP",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully created warp for borrowing.",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
