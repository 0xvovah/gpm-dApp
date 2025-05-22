"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "@nextui-org/react";

import TokenCard from "./TokenCard";
import TokenSearch from "./TokenSearch";
import {
  TOKEN_BACKEND_ROOT,
  SOCKET_NEWS_ROOM_TOKEN_CREATED,
} from "@/lib/constants";
import { CHAIN_ID } from "@/lib/constants/network";
import { useSocket } from "@/app/GlobalState";

const sortOptions = [
  { value: "lastTradeAt", label: "bump Order" },
  // { value: "featured", label: "featured" },
  { value: "createdAt", label: "creation time" },
  { value: "price", label: "market cap" },
  { value: "dexAt", label: "listed on dex" },
];

const orderOptions = [
  { value: "asc", label: "order: asc" },
  { value: "desc", label: "order: desc" },
];

const ITEMS_PER_PAGE = 45;

export default function TokenList() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState(sortOptions[0]); // lastTradeAt
  const [sortOrder, setSortOrder] = useState("DESC");
  const [pageNum, setPageNum] = useState(1);
  const [totalTokensCnt, setTotalTokensCnt] = useState(0);

  const { socket } = useSocket();

  const lastPageNum = Math.ceil(totalTokensCnt / ITEMS_PER_PAGE);

  const onSearch = (value: string) => {
    setSearchText(value);
  };

  const onChangeSortBy = (option: any) => {
    if (option.value !== sortBy.value) {
      setSortBy(option);
    }
  };

  const fetchTokens = useCallback(
    async (_pageNum?: number) => {
      const res = await axios.get(TOKEN_BACKEND_ROOT, {
        params: {
          chainId: CHAIN_ID,
          search: searchText,
          sortBy: sortBy.value,
          sortOrder: sortOrder,
          skip: ((_pageNum || 1) - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        },
      });
      if (res.status == 200) {
        const newTokens = [...res.data.tokens];
        setTokens(newTokens);
        if (res.data.count !== totalTokensCnt) {
          setTotalTokensCnt(res.data.count);
          if (pageNum !== 1) {
            setPageNum(pageNum);
          }
        }
      }
    },
    [searchText, sortBy.value, sortOrder, pageNum, totalTokensCnt]
  );

  const onChangePageNum = async (_pageNum: number) => {
    if (_pageNum !== pageNum) {
      setPageNum(_pageNum);
    }
  };

  useEffect(() => {
    fetchTokens(pageNum);
  }, [sortBy.value, pageNum, sortOrder]);

  useEffect(() => {
    fetchTokens(1);
  }, [searchText]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_NEWS_ROOM_TOKEN_CREATED, (message: any) => {
      fetchTokens(pageNum);
    });

    return () => {
      socket.off(SOCKET_NEWS_ROOM_TOKEN_CREATED);
    };
  }, [socket]);

  return (
    <div>
      <div>
        <TokenSearch
          onSearch={onSearch}
          sortOptions={sortOptions}
          selectedOption={sortBy}
          setSelectedOption={onChangeSortBy}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 xl:gap-4 mt-7 mb-8 md:mt-9 md:mb-10">
        {tokens.map((row: any) => {
          return <TokenCard key={row.address} tokenInfo={row} />;
        })}
      </div>
      {lastPageNum >= 2 && (
        <div className="m-auto">
          <Pagination
            isCompact
            showControls
            initialPage={1}
            total={lastPageNum}
            onChange={onChangePageNum}
            classNames={{
              wrapper: "m-auto",
            }}
          />
        </div>
      )}
    </div>
  );
}
