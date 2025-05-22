"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import {
  SOCKET_NEWS_ROOM_TOKEN_CREATED,
  SOCKET_NEWS_ROOM_TOKEN_TRADED,
  TOKEN_BACKEND_GET_KING,
  TOKEN_BACKEND_GET_LASTS,
} from "@/lib/constants/backend";
import { CHAIN_ID } from "@/lib/constants/network";
import { useSocket } from "@/app/GlobalState";
import CurrentKing from "./CurrentKing";
import Trades from "./Trades";
import Creations from "./Creations";

export default function TrendingNow() {
  const [lastCreatedTokens, setLastCreatedTokens] = useState<any[]>([]);
  const [lastTradedTokens, setLastTradedTokens] = useState<any[]>([]);
  const [kingToken, setKingToken] = useState<any>(null);

  const router = useRouter();
  const { socket } = useSocket();
  const address = useAddress();
  const account = address || ethers.constants.AddressZero;

  const fetchLastTokens = useCallback(async () => {
    const res = await axios.get(`${TOKEN_BACKEND_GET_LASTS}/${CHAIN_ID}`);

    if (res.status == 200) {
      const { lastCreatedTokens, lastTrades } = res.data;
      setLastCreatedTokens(lastCreatedTokens);
      setLastTradedTokens(lastTrades);
    }
  }, []);

  const fetchKingToken = useCallback(async () => {
    const res = await axios.get(`${TOKEN_BACKEND_GET_KING}/${CHAIN_ID}`);

    if (res.status == 200) {
      const { kingToken } = res.data;
      setKingToken(kingToken);
    }
  }, []);

  useEffect(() => {
    fetchLastTokens();
    fetchKingToken();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_NEWS_ROOM_TOKEN_CREATED, (message: any) => {
      setLastCreatedTokens((prev: any) => {
        return [message, ...prev];
      });
    });

    socket.on(SOCKET_NEWS_ROOM_TOKEN_TRADED, (message: any) => {
      const { from: account, raiseAmount, tokenAmount } = message;
      setLastTradedTokens((prev: any) => {
        return [
          {
            ...message,
            raiseAmount: raiseAmount.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            tokenAmount: tokenAmount.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            account,
          },
          ...prev,
        ];
      });
    });

    return () => {
      socket.off(SOCKET_NEWS_ROOM_TOKEN_CREATED);
      socket.off(SOCKET_NEWS_ROOM_TOKEN_TRADED);
    };
  }, [account, router, socket]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 xl:gap-4 mt-0 sm:mt-0 md:mt-0">
      {kingToken && <CurrentKing tokenInfo={kingToken} />}
      <Trades trades={lastTradedTokens} />
      <Creations creates={lastCreatedTokens} />
    </div>
  );
}
