import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, BLOCKCHAIN_IDS } from "@solana/actions";
import { Connection, VersionedTransaction } from "@solana/web3.js";

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
export const OPTIONS = async (request: Request) => {
    return new Response(null, { headers });
};

// POST request14
export const POST = async (req: Request, { params }: { params: { token: string, amount: string } }) => {
    // Extract the token, amount and the account
    const token = params.token.toUpperCase();
    const amount = Number(params.amount);
    const response: ActionPostRequest = await req.json();
    const { account } = response;

    // Check if API key is set
    if (!luloApiKey) {
        return new Response(JSON.stringify({ error: "Lulo API key is not set" }), { status: 500, headers });
    }

    // Check if token is USDC
    if (!token || token !== "USDC") {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400, headers });
    }

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
            mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
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
};