"use client";

import {
  Faucet,
  StartNewCoin,
  TrendingNow,
  TokenList,
} from "@/components/home";

export default function Page() {
  return (
    <>
      {/* <div className="mt-15 w-full">
        <Faucet />
      </div> */}
      <div className="mt-15 w-full">
        <TrendingNow />
      </div>
      <div className="mt-12 w-full">
        <StartNewCoin />
      </div>
      <div className="mt-12 w-full">
        <TokenList />
      </div>
    </>
  );
}
