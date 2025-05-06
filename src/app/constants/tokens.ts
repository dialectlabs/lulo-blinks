export interface Token {
    ticker: string;
    mintAddress: string;
    name: string;
    decimals: number;
}

export const TOKENS: Record<string, Token> = {
    USDC: {
        ticker: "USDC",
        mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        name: "USD Coin",
        decimals: 6
    },
    SOL: {
        ticker: "SOL",
        mintAddress: "So11111111111111111111111111111111111111112",
        name: "Solana",
        decimals: 9
    },
    USDT: {
        ticker: "USDT",
        mintAddress: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        name: "Tether USD",
        decimals: 6
    },
    PYUSD: {
        ticker: "PYUSD",
        mintAddress: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
        name: "PayPal USD",
        decimals: 6
    },
    USDS: {
        ticker: "USDS",
        mintAddress: "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA",
        name: "Saber USD",
        decimals: 6
    },
    FDUSD: {
        ticker: "FDUSD",
        mintAddress: "9zNQRsGLjNKwCUU5Gq5LR8beUCPzQMVMqKAi3SSZh54u",
        name: "First Digital USD",
        decimals: 6
    }
};

export const isSupportedToken = (input: string): boolean => {
    // Check if it's a ticker
    if (Object.keys(TOKENS).includes(input.toUpperCase())) {
        return true;
    }

    // Check if it's a mint address
    return Object.values(TOKENS).some(token => token.mintAddress === input);
};

export const getTokenByInput = (input: string): Token | undefined => {
    // Try to get token by ticker
    const tokenByTicker = TOKENS[input.toUpperCase()];
    if (tokenByTicker) {
        return tokenByTicker;
    }

    // Try to get token by mint address
    return Object.values(TOKENS).find(token => token.mintAddress === input);
}; 