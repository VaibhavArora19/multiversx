import {
    composeContext,
    generateText,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    parseJSONObjectFromText,
    type State,
} from "@elizaos/core";

export async function getParamsWithLLM<T>(
    runtime: IAgentRuntime,
    message: Memory,
    template: string,
    state: State = null,
    maxAttempts = 5
): Promise<T | null> {
    const context = composeContext({
        state: {
            ...state,
            userMessage: message.content.text,
        },
        template,
    });

    for (let i = 0; i < maxAttempts; i++) {
        const response = await generateText({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
        });

        const parsedResponse = parseJSONObjectFromText(response) as T | null;
        if (parsedResponse) {
            return parsedResponse;
        }
    }
    return null;
}
