import { z } from "zod";

export const createTokenSchema = z.object({
    tokenName: z.string().min(1, { message: "Token name is required." }),
    tokenTicker: z.string().min(1, { message: "Token ticker is required." }),
    amount: z
        .number()
        .positive({ message: "Amount must be a positive number." }),
    decimals: z
        .number()
        .int()
        .min(0, { message: "Decimals must be at least 0" })
        .max(18, { message: "Decimals must be at most 18" })
        .nullable()
        .optional(),
});

export const transferSchema = z.object({
    tokenAddress: z.string().min(1, { message: "Token address is required." }),
    amount: z.string().min(1, { message: "Amount is required." }),
    tokenIdentifier: z
        .string()
        .transform((val) => (val === "null" ? null : val))
        .nullable()
        .optional(),
});

export const swapSchema = z.object({
    tokenIn: z.string().min(1, { message: "First token is required." }),
    amountIn: z.string().min(1, { message: "Amount is required." }),
    tokenOut: z.string().min(1, { message: "Second token is required." }),
});

export const lendTokenSchema = z.object({
    tokenName: z.string().min(1, {message: "token name is required"}),
    amount: z.number().positive({message: 'Amount must be a positive number'})
})

export const copyTradeSchema = z.object({
    walletAddress: z.string().min(1, {message: "Wallet address is required."})
})

export const investSchema = z.object({
    riskTolerance: z.string().min(1, {message: "risk tolerance is required"}),
    investmentAmount: z.number({message: "investment amount is required"}),
    annualReturns: z.number().min(1).max(100, {message: "annual returns is required"}),
    investmentTimeline: z.string().min(1, {message: "investment timeline is required"}),
    defiExperience: z.string().min(1, {message: "defi experience is required"})
})

export const valueSchema = z.object({tokens: z.array(z.object({
    identifier: z.string().min(1, {message: "identifier is required"}),
    amount: z.string().min(1, {message: "amount is required"})
}))})