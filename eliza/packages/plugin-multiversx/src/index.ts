import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";
import createToken from "./actions/createToken";
import swap from "./actions/swap";
import showBalance from "./actions/showBalance";

export const multiversxPlugin: Plugin = {
    name: "multiversx",
    description: "MultiversX Plugin for Eliza",
    actions: [transfer, createToken, swap, showBalance],
    evaluators: [],
    providers: [],
};

export default multiversxPlugin;
