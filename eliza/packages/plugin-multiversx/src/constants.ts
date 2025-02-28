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

export const healthScores = [
    {
        identifier: "EGLD",
        score: 90,
    },
    {
        identifier: 'WEGLD',
        score: 90,
    },
    {
        identifier: "USDC",
        score: 100,
    },
    {
        identifier: "USDT",
        score: 100
    },
    {
        identifier: "WTAO",
        score: 70
    },
    {
        identifier: "TAO",
        score: 70
    },
    {
        identifier: 'WBTC',
        score: 95,
    },
    {
        identifier: "WETH",
        score: 60 
    }
]


export const investment_assets = [
    {
        name: "EGLD",
        riskTolerance: ['conservative', 'moderate'],
        annualReturns: '10%-30%',
        investmentTimeline: '1-2 years',
    },
    {
        name: "USDC-350c4e",
        riskTolerance: ['conservative'],
        annualReturns: '15%-35%',
        invstmentTimeline: "3 years"
    },
    {
        name: 'WETH-bbe4ab',
        riskTolerance: 'aggresive',
        annualReturns: "2%-50%",
        investimentTimeline: "1 year"
    },
    {
        name: "WBTC-05fd5b",
        riskTolerance: ['moderate', 'aggresive'],
        annualReturns: '50%-100%',
        investmentTimeline: '2 years'
    },
    {
        name: "WTAO-f94e58",
        riskTolerance: ['conservative'],
        annualReturns: '30-50%',
        investmentTimeline: "1 year"
    }
]