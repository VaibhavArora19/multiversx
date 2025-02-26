// Network configuration object for different environments (mainnet, devnet, testnet)
export const MVX_NETWORK_CONFIG = {
    mainnet: {
        chainID: "1", // Mainnet chain ID
        apiURL: "https://api.multiversx.com", // Mainnet API URL
        explorerURL: "https://explorer.multiversx.com",
        graphURL: "https://internal-graph.xexchange.com/graphql",
    },
    devnet: {
        chainID: "D", // Devnet chain ID
        apiURL: "https://devnet-api.multiversx.com", // Devnet API URL,
        explorerURL: "https://devnet-explorer.multiversx.com",
        graphURL: "https://devnet-graph.xexchange.com/graphql",
    },
    testnet: {
        chainID: "T", // Testnet chain ID
        apiURL: "https://testnet-api.multiversx.com", // Testnet API URL
        explorerURL: "https://testnet-explorer.multiversx.com",
        graphURL: "https://testnet-graph.xexchange.com/graphql",
    },
};

export const hatomControllerAddress = "erd1qqqqqqqqqqqqqpgqwf9drqmy5wxfj36mehus7979wl659p6gv5ysu7ktra"
export const egldMoneyMarketAddress = "erd1qqqqqqqqqqqqqpgq2udp46dvs4cvp4urak39t2fqxp7t3lpzv5ysec452j"
export const taoMoneyMarketAddress = 'erd1qqqqqqqqqqqqqpgqara7qx6funfum8jy30fctvre23rffxw4v5ysnzmlnt'


export const identifiers = {
    'EGLD': {
        identifier: "HEGLD-ae8054"
    },
    'USDC': {
        identifier: 'HUSDC-7c1ef2'
    },
    'HTM': {
        identifier: 'HHTM-f26787'
    }
}