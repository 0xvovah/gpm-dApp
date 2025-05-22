"use client";

import axios from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { Tabs, Tab } from "@nextui-org/react";

import {
  TokenTradeForm,
  TokenGeneralInfo,
  Holders,
  TokenComment,
} from "@/components/token";
import { TOKEN_BACKEND_ROOT } from "@/lib/constants";
import { useTokenHolders } from "@/hooks/usePonderQuery";

const TVChartContainer = dynamic(
  () => import("@/components/tv-chart").then((mod) => mod.TVChartContainer),
  { ssr: false }
);

export default function TokenView() {
  const [tokenInfo, setTokenInfo] = useState<any>();
  const [chartSource, setChartSource] = useState("gopumpme");

  const params = useParams();
  const tokenAddress = params.slug ? params.slug[0] : "";
  const { data: holders, refetch: refetchHolders } = useTokenHolders(
    tokenAddress || ethers.constants.AddressZero
  );
  const isGopumpme = chartSource === "gopumpme";
  const dexPair = tokenInfo?.dexPair;
  const dexAt = tokenInfo?.dexAt;

  // action: chart source change action
  const onChangeChartSource = (source: string) => {
    if (source !== chartSource) {
      setChartSource(source);
    }
  };

  const fetchTokenInfo = useCallback(async () => {
    if (!tokenAddress) {
      setTokenInfo(undefined);
      return;
    }

    const res = await axios.get(`${TOKEN_BACKEND_ROOT}/${tokenAddress}`);

    if (res.status == 200) {
      setTokenInfo((prev: any) => {
        return { ...prev, ...res.data };
      });
    }
  }, [tokenAddress]);

  const refetchData = async () => {
    await fetchTokenInfo();
    setTimeout(async () => {
      await refetchHolders();
    }, 2000);
  };

  useEffect(() => {
    fetchTokenInfo();
  }, [tokenAddress, fetchTokenInfo]);

  if (!tokenInfo?.symbol) return null;

  return (
    <div className="flex flex-col lg:flex-row space-x-8 mt-4 gap-4 md:gap-8">
      {/* left */}
      <div className="flex flex-1 flex-col gap-8 w-full lg:w-2/3">
        <div className="">
          <div className="mb-4 max-w-[300px]">
            {dexPair && (
              <Tabs
                selectedKey={chartSource}
                aria-label="Options"
                classNames={{
                  base: "w-full",
                  tabList: "w-full p-0 bg-card_bg",
                  cursor: "!bg-transparent",
                }}
                onSelectionChange={(key) => onChangeChartSource(key as string)}
              >
                <Tab
                  key="gopumpme"
                  title={
                    <span
                      className={`${isGopumpme ? "text-black" : "text-white"}`}
                    >
                      GoPumpMe chart
                    </span>
                  }
                  className={isGopumpme ? "bg-bg_green" : ""}
                />
                <Tab
                  key="dex"
                  title={
                    <span
                      className={`${!isGopumpme ? "text-black" : "text-white"}`}
                    >
                      DEX chart
                    </span>
                  }
                  className={!isGopumpme ? "bg-bg_green" : ""}
                />
              </Tabs>
            )}
          </div>
          <TVChartContainer
            symbol={tokenInfo?.symbol || ""}
            dexPair={dexPair}
            dexChartShown={!isGopumpme}
          />
        </div>
        {/* <div className="invisible sm:visible"> */}
        <div className="hidden lg:block">
          <TokenComment tokenInfo={tokenInfo} />
        </div>
      </div>

      {/* right */}
      <div className="relative min-w-[250px] lg:max-w-[350px] !m-0 lg:w-1/3 flex flex-col gap-8">
        <div className="w-full">
          <TokenTradeForm tokenInfo={tokenInfo} refetchData={refetchData} />
        </div>
        <div className="w-full">
          <TokenGeneralInfo tokenInfo={tokenInfo} />
        </div>
        <div className="w-full">
          <Holders tokenInfo={tokenInfo} holders={holders} />
        </div>
      </div>
      <div className="block lg:hidden !m-0 !mt-8">
        <TokenComment tokenInfo={tokenInfo} />
      </div>
    </div>
  );
}
