import type { Plugin } from "@elizaos/core";
import transfer from "./actions/transfer";
import createToken from "./actions/createToken";
import swap from "./actions/swap";
import showBalance from "./actions/showBalance";
import lend from "./actions/lend";
import borrow from "./actions/borrow";
import copyTrade from "./actions/copyTrade";
import health from "./actions/health";
import invest from "./actions/invest";
import showAddress from "./actions/showAddress";
import rebalance_recommendation from "./actions/rebalance_recommendation";
import stake from "./actions/stake";
import lendWarp from "./actions/lendWarp";
import borrowWarp from "./actions/borrowWarp";
import stakeWarp from "./actions/stakeWarp";

export const multiversxPlugin: Plugin = {
    name: "multiversx",
    description: "MultiversX Plugin for Eliza",
    actions: [transfer, createToken, swap, showBalance, lend, borrow, copyTrade, health, invest, showAddress, rebalance_recommendation, stake, lendWarp, borrowWarp, stakeWarp],
    evaluators: [],
    providers: [],
};

export default multiversxPlugin;
