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
import { denominateAmount } from "../utils/amount";

let rebalanceRecommendationTemplate = `# Areas of Expertise
{{knowledge}}

# About {{agentName}}:
{{bio}}
{{lore}}
{{topics}}

{{characterPostExamples}}


# Task: Do not make any value up by yourself.Analyze the {{tokensObject}} array and fetch the token name and amount of each token.
Recommend the rebalance of tokens to the user in their wallet to increase their chance of capturing more gains. Your task is to analyze {{tokensObject}} and reply with the
changes you would suggest to make that user can buy or sell to make their wallet portfolio capture more gains.Remember do not make any value up by yoursel, only select the token name and the amount that is present in {{tokensObject}}. 
You can reply with 2 lines of text and ask them if the user wants you to rebalance their portfolio. Mention the token name from {{tokensObject}}. 
For example - Based on your current wallet porfolio, you own {{tokensObject[0].token}}, {{tokensObject[1].token}} and {{tokensObject[1].token}} and then suggest the tokens
they can rebalance to. For example swap 50% of USDC to WBTC and convert EGLD to WTAO. You should first mention only those tokens that are present in the {{tokensObject}} and then
suggest the tokens. Do not make anything up by yourself. Only do what is written in this prompt. Be more details, also tell how much amount they own from {{tokensObject}}, use these values from {{tokensObject}}, do not make these values up by yourself,
and the above points are just example generate something on your own that relates to this. Be more specific about which token should be converted to which token and of how much value`


export default {
    name: "RECOMMEND_REBALANCE",
    similes: ["REBALANCE_RECOMMENDATION", "SHOW_RECOMMEND_REBALANCE"],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Show rebalance recommendation to user.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting SHOW_REBALANCE handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to fetch the rebalance:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to rebalance the portfolio.",
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
                amount: "$" + +denominateAmount({amount: balance, decimals: -18}) * 22
            })

            estdsBalance.forEach(data => {
                balanceObject.push({
                    token: data?.ticker,
                    amount: "$"+(data?.valueUsd ?? 0)
                })
            })


            elizaLogger.info('balance object:', JSON.stringify(balanceObject))
             const state = await runtime.composeState(
                    message,
                {
                    tokensObject: JSON.stringify(balanceObject)
                }
            );

            const context = composeContext({
                state,
                template: rebalanceRecommendationTemplate,
            });

            elizaLogger.debug("generate post prompt:\n" + context);

            const response = await generateText({
                runtime: runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            elizaLogger.info('response is: ', response.toString());

            //!feed this data to generatetext
            // balanceObject.map(obj => JSON.stringify(obj, null, 2)).join('\n')

            callback?.({
                text: response
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
                "text": "Show me the recommendation to rebalance my portfolio",
                "action": "RECOMMEND_REBALANCE"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "Here is how you can rebalance your portfolio - swap USDC to EGLD and lend it to hatom app to capture more gains."
            }
        }
    ],
    [
        {
            "user": "{{user1}}",
            "content": {
                "text": "How can I capture more gains.",
                "action": "RECOMMEND_REBALANCE"
            }
        },
        {
            "user": "MVSX_Bot",
            "content": {
                "text": "In my suggestion, you can swap Wrapped TAO to Wrapped BTC for more gains."
            }
        }
    ]
] as ActionExample[][],
} as Action;
