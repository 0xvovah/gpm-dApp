import { useEffect, useState } from "react";

import { ethereumMulticall } from "@/lib/utils";
import abis from "@/lib/abi";

const useTokenPrice = () => {
  const [prices, setPrices] = useState({ ETH: 0, USDC: 0, USDT: 0, WETH: 0 });

  const fetchPrice = async () => {
    const ethToUsdOracle = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    const usdcToUsdOracle = "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6";
    const usdtToUsdOracle = "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D";

    const pricesRes = await ethereumMulticall([
      {
        address: ethToUsdOracle,
        abi: abis.priceAggregator,
        functionName: "latestAnswer",
        args: [],
      },
      {
        address: usdcToUsdOracle,
        abi: abis.priceAggregator,
        functionName: "latestAnswer",
        args: [],
      },
      {
        address: usdtToUsdOracle,
        abi: abis.priceAggregator,
        functionName: "latestAnswer",
        args: [],
      },
    ]);

    const ethPriceInUsd =
      pricesRes[0].status === "success"
        ? Number((pricesRes[0] as any)?.result) / 1e8
        : 0;
    const ezEthPriceInEth =
      pricesRes[1].status === "success"
        ? Number((pricesRes[1] as any)?.result) / 1e18
        : 0;
    const usdcPriceInUsd =
      pricesRes[2].status === "success"
        ? Number((pricesRes[2] as any)?.result) / 1e8
        : 0;
    const usdtPriceInUsd =
      pricesRes[2].status === "success"
        ? Number((pricesRes[3] as any)?.result) / 1e8
        : 0;

    setPrices({
      ETH: ethPriceInUsd,
      USDC: usdcPriceInUsd,
      USDT: usdtPriceInUsd,
      WETH: ethPriceInUsd,
    });
  };

  useEffect(() => {
    fetchPrice();

    setInterval(() => {
      fetchPrice();
    }, 60000);
  }, []);

  return prices;
};

export default useTokenPrice;
