import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, BLOCKCHAIN_IDS } from "@solana/actions";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { getTokenByInput, isSupportedToken, TOKENS } from "@/app/constants/tokens";

// CAIP-2 
const blockchain = BLOCKCHAIN_IDS.mainnet;

// Lulo API key
const luloApiKey = process.env.LULO_API_KEY;

// Connection
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);

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

// POST request
export const POST = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const pathnameParts = url.pathname.split("/");
        const tokenInput = pathnameParts[pathnameParts.length - 2];
        const amount = Number(pathnameParts[pathnameParts.length - 1]);

        const response: ActionPostRequest = await req.json();

        const { account } = response;

        // Check if API key is set
        if (!luloApiKey) {
            throw new Error("Lulo API key is not set");
        }

        // Check if token is supported
        if (!isSupportedToken(tokenInput)) {
            throw new Error("Unsupported token, please use a supported token ticker or mint address. Supported tickers: " + Object.keys(TOKENS).join(", "));
        }

        // Get token data
        const tokenData = getTokenByInput(tokenInput);

        // Query Lulo API
        const luloResponse = await fetch(`https://api.flexlend.fi/generate/account/withdraw?priorityFee=50000`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-wallet-pubkey": account,
                "x-api-key": luloApiKey,
            },
            body: JSON.stringify({
                owner: account,
                mintAddress: tokenData!.mintAddress,
                withdrawAmount: amount,
            }),
        });

        // Update the blockhash from the transaction
        const tx = await luloResponse.json();

        const { transactionMeta } = tx.data;

        const deserializedTx = VersionedTransaction.deserialize(Buffer.from(transactionMeta[0].transaction, "base64"));

        const blockhash = (await connection.getLatestBlockhash()).blockhash;

        deserializedTx.message.recentBlockhash = blockhash;

        // Create a payload
        const payload: ActionPostResponse = {
            type: "transaction",
            transaction: Buffer.from(deserializedTx.serialize()).toString("base64"),
        }

        // Return the payload
        return new Response(JSON.stringify(payload), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers });
    }
};