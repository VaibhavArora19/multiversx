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
import {investSchema, valueSchema } from "../utils/schemas";
export interface CreateInvestmentContent extends Content {
    riskTolerance: string,
    investmentAmount: number,
    annualReturns: number;
    investmentTimeline: string;
    defiExperience: string;
}
export interface CreateInvestmentMainContent extends Content {
    tokens: {
        identifier: string;
        amount: string;
    }[]
}
import { isUserAuthorized } from "../utils/accessTokenManagement";
import { investment_assets, MVX_NETWORK_CONFIG } from "../constants";
import { NativeAuthProvider } from "../providers/nativeAuth";
import { GraphqlProvider } from "../providers/graphql";
import { swapToken, TVariables } from "../utils/copy";
import { denominateAmount } from "../utils/amount";

const getDetailsTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "riskTolerance": "Conservative",
    "investmentAmount: "1 EGLD",
    "annual returns": "20%",
    "investmentTimeline: "less than 1 year"
    "defiExperience": "Beginner"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token creation:
- Risk Tolerance
- Investment Amount
- Annual Returns
- Investment Timeline
- DeFi Experience

Respond with a JSON markdown block containing only the extracted values.`;

const generateValuesTemplate = `
# Areas of Expertise
{{knowledge}}

# About you:
{{bio}}
{{lore}}
{{topics}}

{{characterPostExamples}}


# Task: Given the data fields from the previous values {{riskTolerance}} {{investmentAmount}} {{annualReturns}} {{investmentTimeline}} {{defiExperience}}. Create an array of object and 
choose the fields from the {{secondArray}} which will be provided to you in which each object will contain the identifier of the token, the amount to be deposited in that token. You do
not have to select all the tokens from the {{secondArray}} 2 to 3 tokens are enough. Remember this amount should be the percentage of the {{investmentAmount}} carried out based on {{riskTolerance}} and {{annualReturns}}. Do not choose the tokens at random. They should be 
based on similar {{riskTolerance}} {{annualReturns}} and other fields that are provided to you. Do not create any other prompt, just create a simple object.
`

const p = `
# Areas of Expertise
{{knowledge}}

# About you:
{{bio}}
{{lore}}
{{topics}}

{{characterPostExamples}}


# Task: Given the data fields from the previous values {{riskTolerance}} {{investmentAmount}} {{annualReturns}} {{investmentTimeline}} {{defiExperience}}. You need to generate the array
called tokens which will contains objects. Each object will have 2 fields one is token identifier and the second is amount. identifier should be chosen from the {{secondArray}} and the amount
should be some percentage of {{investmentAmount}}. For example if {{investmentAmount}} is 1 and amount is 30% of it then it will be 0.3. The sum of amount should be equal to {{investmentAmount}}. For example if you selected 2 tokens then the {{investmentAmount}} should be equal to the sum of those 2 tokens.You do not have to select all the tokens from the {{secondArray}} 2 to 3 tokens are enough.
Your result should be based on {{riskTolerance}} {{annualReturns}} and other fields that are provided to you. Match these values with the {{secondArray}} and then generate result.
`



export default {
    name: "INVEST",
    similes: ["PORTFOLIO_INVEST", "INVESTMENT_PROFILE",],
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Validating config for user:", message.userId);
        await validateMultiversxConfig(runtime);
        return true;
    },
    description: "Smart investing using AI.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting INVEST handler...");

        elizaLogger.log("Handler initialized. Checking user authorization...");

        if (!isUserAuthorized(message.userId, runtime)) {
            elizaLogger.error(
                "Unauthorized user attempted to invest:",
                message.userId
            );
            if (callback) {
                callback({
                    text: "You do not have permission to invest.",
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
            template: getDetailsTemplate,
        });

        // Generate transfer content
        const content = await generateObject({
            runtime,
            context: transferContext,
            modelClass: ModelClass.SMALL,
            schema: investSchema,
        });

        elizaLogger.info("first content: ", content);

        const payload = content.object as CreateInvestmentContent;

        try {
            const privateKey = runtime.getSetting("MVX_PRIVATE_KEY");
            const network = runtime.getSetting("MVX_NETWORK");

            const networkConfig = MVX_NETWORK_CONFIG[network];
            const walletProvider = new WalletProvider(privateKey, network);

            const finalTemplate = `The value that you need to work on are ${JSON.stringify(content.object)}. The secondArray is ${JSON.stringify(investment_assets)}` + p;

            const investmentContext = composeContext({
                state: currentState,
                template: finalTemplate,
            });

            elizaLogger.info('investment context is: ', investmentContext);

                const investmentContent = await generateObject({
                    runtime,
                    context: investmentContext,
                    modelClass: ModelClass.SMALL,
                    schema: valueSchema,
                });

                 elizaLogger.info("investment content: ", investmentContent);
                 elizaLogger.info('response is', investmentContent)

               const mainPayload = investmentContent.object as CreateInvestmentMainContent





            const arr = mainPayload.tokens;

            elizaLogger.info('arr is', JSON.stringify(arr));


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
            

            const funcArray = arr.map((token) => {

                const value = denominateAmount({
                    amount: token.amount,
                    decimals: 18,
                });
   
                let variables: TVariables = {
                    amountIn: value,
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
                    text: "Create investment for me where my risk tolerance is Conservative - Prioritize capital preservation and my investment budget is 1 EGLD and my annual target returns is 30% and my investment timeline is 1 year. My experience in DeFi is Beginner.",
                    action: "INVEST",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully invested for you. Your investment is safe and smart with DeFiVerse",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create investment for me where my risk tolerance is Conservative - Prioritize capital preservation and my investment budget is 1 EGLD and my annual target returns is 30% and my investment timeline is 1 year. My experience in DeFi is Beginner.",
                    action: "INVEST",
                },
            },
            {
                user: "MVSX_Bot",
                content: {
                    text: "Successfully invested for you. Your investment is safe and smart with DeFiVerse",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
