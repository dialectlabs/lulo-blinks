"use client";

import { Blink, useBlink } from "@dialectlabs/blinks";
import { useBlinkSolanaWalletAdapter } from "@dialectlabs/blinks/hooks/solana";
import "@dialectlabs/blinks/index.css";

import { StepCard } from "./components/step-card";

// Text for the steps on the left side of the page for the user to follow
const steps = [
  {
    icon: "icon-cog",
    chip: {
      text: "Backend",
      icon: "icon-cog",
    },
    headline: "Blink API",
    text: "Blinks are headless APIs that return transactions, as well as educational metadata that can be used to render blink UIs. \n\nGet started by editing `/src/app/api/actions/withdraw/usdc/route.ts`",
  },
  {
    icon: "icon-code",
    chip: {
      text: "Frontend",
      icon: "icon-code",
    },
    headline: "Blink UI",
    text: "Dialect's blinks UI components libraries can be used to render the blink data returned from the blink API backend. \n\nGet started by editing `src/app/page.tsx`",
  },
];

export default function Home() {
  const blinkApiUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/actions/withdraw/usdc`;

  // Adapter, used to connect to the wallet
  const { adapter } = useBlinkSolanaWalletAdapter(
    process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.mainnet-beta.solana.com"
  );

  // Blink we want to execute
  const { blink, isLoading } = useBlink({ url: blinkApiUrl });

  return (
    <main className="grid grid-cols-[2fr_3fr] h-[calc(100vh-64px)]">
      <div className="col-span-1 p-8 pr-16 overflow-y-auto">
        <h1 className="text-[40px] mb-3 font-bold leading-[1]">
          Lulo Blinks
        </h1>
        <h2 className="text-[18px] mb-2">
          This website showcases Blinks that interact with the Lulo lending protocol on the Solana blockchain.
          The Blink below lets you withdraw USDC from your Lulo balance.
          <br /><br />
          <span className="text-xl mb-2 font-bold">Curious how to build this Blink yourself?</span>
          <br />
          Check out our step-by-step {" "}
          <a
            href="https://youtu.be/YHANYj0YbLA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            YouTube tutorial
          </a>
          .
        </h2>
        {steps.map((step, i) => (
          <StepCard
            key={i}
            chip={step.chip}
            headline={step.headline}
            text={step.text}
          />
        ))}
      </div>

      <div className=" flex items-center justify-center border border-gray-600 rounded-[10px] m-4">
        {isLoading || !blink ? (
          <span>Loading</span>
        ) : (
          <div className="w-full max-w-lg">
            <Blink
              blink={blink}
              adapter={adapter}
              securityLevel="all"
              stylePreset="x-dark"
            />
          </div>
        )}
      </div>
    </main>
  );
}
