import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";
import createToken from "./actions/createToken";
import swap from "./actions/swap";
import showBalance from "./actions/showBalance";
import lend from "./actions/lend";
import borrow from "./actions/borrow";
import copyTrade from "./actions/copyTrade";

export const multiversxPlugin: Plugin = {
    name: "multiversx",
    description: "MultiversX Plugin for Eliza",
    actions: [transfer, createToken, swap, showBalance, lend, borrow, copyTrade],
    evaluators: [],
    providers: [],
};

export default multiversxPlugin;
