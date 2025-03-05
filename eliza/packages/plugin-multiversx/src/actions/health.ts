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
    generateText,
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
import BigNumber from "bignumber.js";
import { healthScores, identifiers } from "../constants";

export const responseTemplate = `
# Areas of Expertise
{{knowledge}}

# About you:
{{bio}}
{{lore}}
{{topics}}

{{characterPostExamples}}


# Task: Based on 2 given arrays in which {{firstArray}} one will contain the tokens held by a wallet address along with their balance and {{secondArray}} will hold their health score.
Determine both the arrays and match the health score from {{secondArray}} to {{firstArray}} and generate a health score for the wallet. Add suggestions based on your {{knowledge}} and {{topcis}}.
Your response should be 1, 2, or 3 sentences (choose the length at random).
Your response should not contain any questions. Brief, concise statements only. Show the aggregated percentage of health that you calculated from all tokens. Use emojis to look playful and friendly.
Mention token names that the wallet holds in between the message.
`


export default {
    name: "SHOW_HEALTH",
    similes: ["HEALTH_SCORE", "SHOW_HEALTH_SCORE"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Show health score of user.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting SHOW_HEALTH handler...");

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
        const address = 'erd12zmngrp3k3hd3rf309fky5pp38t9ykx9vn5x2k6m49g60dreuzus6vkger';

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const walletProvider = new WalletProvider(privateKey, network);

            const balance = await walletProvider.getBalance();
            const estdsBalance = await walletProvider.getTokensData(walletProvider.getAddress().bech32());

            const balanceObject = [{
                   identifier: 'EGLD',
                   balance: balance,
                   balanceUsd: Number(new BigNumber(balance).shiftedBy(-18).toFixed(4)) * 21,
            }];

            estdsBalance.forEach(data => {
                balanceObject.push({
                    identifier: data?.ticker,
                    balance: data.balance,
                    balanceUsd: data?.valueUsd ?? 0
                })
            })

            const state = await runtime.composeState(message, {
                firstArray: JSON.stringify(balanceObject),
                secondArray: JSON.stringify(healthScores),
            })

            elizaLogger.info('state is', JSON.stringify(state));

            const context = composeContext({
                state,
                template: responseTemplate
            })

            elizaLogger.info('context is', JSON.stringify(context));

            const response = await generateText({
                runtime: runtime,
                context,
                modelClass: ModelClass.SMALL,
            })

            elizaLogger.info('response: ', response.toString());


            callback?.({
                text: response,
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
                "text": "Show health of my wallet",
                "action": "SHOW_HEALTH"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your wallet looks good. The health score is 90%"
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": {
                "text": "What is the health score of my address",
                "action": "SHOW_HEALTH"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Your wallet's health score is 85%. Nice selection of tokens."
            }
        }
    ]
] as ActionExample[][],
} as Action;
