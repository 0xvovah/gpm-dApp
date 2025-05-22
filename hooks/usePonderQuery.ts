import { useQuery } from "@apollo/client";
import { ethers } from "ethers";

import { candlesQuery, holdersQuery } from "@/lib/ponder/query";
import { CHAIN_ID } from "@/lib/constants/network";

// get token holders
const useTokenHolders = (tokenAddress: string) => {
  const { data, loading, error, refetch } = useQuery(holdersQuery, {
    variables: {
      tokenAddress: tokenAddress,
      chainId: CHAIN_ID,
    },
  });

  const refetchHolders = () => {
    refetch();
  };

  if (loading) {
    return { data: [], refetch };
  }

  if (error) {
    console.log("Token holders query failed", error);
    return { data: [], refetch };
  }

  const { holders } = data;
  return {
    data: holders.items.map((row: any) => {
      return {
        account: row.account,
        amount: ethers.utils.formatEther(row.amount),
        token: row.token,
      };
    }),
    refetch: refetchHolders,
  };
};

// get token candles
const useTokenCandles = (tokenAddress: string) => {
  const { data, loading, error } = useQuery(candlesQuery, {
    variables: { tokenAddress, chainId: CHAIN_ID },
  });

  if (loading) {
    return [];
  }

  if (error) {
    console.log("Token candles query failed", error);
    return [];
  }

  const { candles } = data;
  return candles.items.map((row: any) => {
    return {
      close: row.close,
      high: row.high,
      low: row.low,
      open: row.open,
      timestamp: row.timestamp,
      volume: row.volume,
      token: row.token,
    };
  });
};

export { useTokenHolders, useTokenCandles };
