import { ActionGetResponse, ACTIONS_CORS_HEADERS, BLOCKCHAIN_IDS } from "@solana/actions";
import { isSupportedToken, getTokenByTicker } from "@/app/constants/tokens";

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
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split("/");
    const token = pathnameParts[pathnameParts.length - 1]?.toUpperCase();

    // Check if the token is supported
    if (!token || !isSupportedToken(token)) {
        return new Response(JSON.stringify({ error: "Unsupported token" }), { status: 400, headers });
    }

    // Create a payload
    const payload: ActionGetResponse = {
        type: "action",
        label: "Withdraw",
        title: `Withdraw ${getTokenByTicker(token)?.ticker}`,
        description: `Withdraw  ${getTokenByTicker(token)?.name} (${getTokenByTicker(token)?.ticker}) from your Lulo balance.`,
        icon: "https://proxy.dial.to/image?url=https%3A%2F%2Fi.imgur.com%2FYxgeGxl.png",
        links: {
            actions: [
                {
                    type: "transaction",
                    label: `100 ${token}`,
                    href: `/api/actions/withdraw/${token}/100`,
                },
                {
                    type: "transaction",
                    label: `200 ${token}`,
                    href: `/api/actions/withdraw/${token}/200`,
                },
                {
                    type: "transaction",
                    label: `500 ${token}`,
                    href: `/api/actions/withdraw/${token}/500`,
                },
                {
                    type: "transaction",
                    label: `${token}`,
                    href: `/api/actions/withdraw/${token}/{amount}`,
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
};