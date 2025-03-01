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
    name: "SHOW_BALANCE",
    similes: ["GET_BALANCE", "GET_TOKENS", "FETCH_BALANCE"],
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
        elizaLogger.log("Starting SHOW_BALANCE handler...");

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
        const address = 'erd13gh9ecruu4kg2r76ts8w64jzk2q8etxcev3w32j788fjpfg2kk0qjw8d20';

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            const balance = await walletProvider.getBalance();
            // const estdsBalance = await walletProvider.getESDTSBalance();

            const estdsBalance = await walletProvider.getTokensData(walletProvider.getAddress().bech32());

            let balanceObject = [];

            balanceObject.push({

                token: "EGLD",
                balance: denominateAmount({amount: balance, decimals: -18}),
                amount: +denominateAmount({amount: balance, decimals: -18}) * 22
            })

            estdsBalance.forEach(data => {
                balanceObject.push({
                    token: data?.ticker,
                    balance: denominateAmount({amount: data?.balance, decimals: -data?.decimals}),
                    amount: "$"+(data?.valueUsd?.substring(0, 5) ?? 0)
                })
            })

            balanceObject.map(obj => JSON.stringify(obj, null, 2)).join('\n')

            callback?.({
                text: `Your wallet address balance - \n ${balanceObject.map(obj => JSON.stringify(obj, null, 2)).join('\n')}`
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
                "text": "Get balance of my account",
                "action": "SHOW_BALANCE"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your balance for XTREME (XTR) is 5000."
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": {
                "text": "Get balance of token TEST (TST) for my account",
                "action": "GET_BALANCE"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your balance for TEST (TST) is 7500."
            }
        }
    ]
] as ActionExample[][],
} as Action;
