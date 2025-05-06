import { ActionGetResponse, ACTIONS_CORS_HEADERS, BLOCKCHAIN_IDS } from "@solana/actions";
import { isSupportedToken, getTokenByInput, TOKENS } from "@/app/constants/tokens";

const blockchain = BLOCKCHAIN_IDS.mainnet;

// CORS headers
const headers = {
    ...ACTIONS_CORS_HEADERS,
    "x-blockchain-id": blockchain,
    "x-action-version": "2.4",
};

// OPTIONS request
export const OPTIONS = async () => {
    return new Response(null, { headers });
};

// GET request
export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const pathnameParts = url.pathname.split("/");
        const tokenInput = pathnameParts[pathnameParts.length - 1];

        // Check if the token is supported
        if (!isSupportedToken(tokenInput)) {
            throw new Error("Unsupported token, please use a supported token ticker or mint address. Supported tickers: " + Object.keys(TOKENS).join(", "));
        }

        // Get token data
        const tokenData = getTokenByInput(tokenInput);
        const ticker = tokenData!.ticker;

        // Create a payload
        const payload: ActionGetResponse = {
            type: "action",
            label: "Withdraw",
            title: `Withdraw ${ticker}`,
            description: `Withdraw ${tokenData!.name} (${ticker}) from your Lulo balance.`,
            icon: "https://proxy.dial.to/image?url=https%3A%2F%2Fi.imgur.com%2FYxgeGxl.png",
            links: {
                actions: [
                    {
                        type: "transaction",
                        label: `100 ${ticker}`,
                        href: `/api/actions/withdraw/${ticker}/100`,
                    },
                    {
                        type: "transaction",
                        label: `200 ${ticker}`,
                        href: `/api/actions/withdraw/${ticker}/200`,
                    },
                    {
                        type: "transaction",
                        label: `500 ${ticker}`,
                        href: `/api/actions/withdraw/${ticker}/500`,
                    },
                    {
                        type: "transaction",
                        label: `${ticker}`,
                        href: `/api/actions/withdraw/${ticker}/{amount}`,
                        parameters: [
                            {
                                name: "amount",
                                type: "number",
                                required: true,
                                label: "Enter the amount to withdraw",
                            }
                        ]
                    }
                ]
            }
        };
        // Return the payload
        return new Response(JSON.stringify(payload), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers });
    }
};