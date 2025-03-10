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
import { createTokenSchema } from "../utils/schemas";
export interface CreateTokenContent extends Content {
    tokenName: string;
    tokenTicker: string;
    decimals: string;
    amount: string;
}
import { isUserAuthorized } from "../utils/accessTokenManagement";
import { denominateAmount } from "../utils/amount";


export default {
    name: "SHOW_ADDRESS",
    similes: ["GET_ADDRESS","FETCH_ADDRESS"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Show token balance of user.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting SHOW_ADDRESS handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to fetch the balance:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to fetch the balance.",
                    content: { error: "Unauthorized user" },
                });
            }
            return false;
        }

        let currentState: State;
        if (!state) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(state);
        }

        //!make this address dynamic later
        // const address = 'erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger';

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            const address = walletProvider.getAddress().bech32();

            callback?.({
                text: `Your wallet address - \n ${address}`
            })
            return true;
        } catch (error) {
            elizaLogger.error("Error during fetching balance:", error);
            if (callback) {
                callback({
                    text: `Error fetching balance: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },

    examples: [
    [
        {
            "user": "{{user1}}",
            "content": {
                "text": "Get address of my account",
                "action": "SHOW_ADDRESS"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your address is erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger."
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": {
                "text": "Show me my address",
                "action": "SHOW_ADDRESS"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your address is erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger."
            }
        }
    ]
] as ActionExample[][],
} as Action;
