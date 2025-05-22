"use client";

import NextLink from "next/link";
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers, BigNumber } from "ethers";

import { shortenAddress } from "@/lib/utils/addressHelper";
import { getTokenPoolAddress } from "@/lib/utils";
import abis from "@/lib/abi";

const tokenPoolAddress = getTokenPoolAddress();

export default function Holders({
  tokenInfo,
  holders,
}: {
  tokenInfo: any;
  holders: any;
}) {
  const address = useAddress();
  const account = address || ethers.constants.AddressZero;
  const { contract: token } = useContract(tokenInfo.address, abis.erc20);
  const { data: totalSupplyInWei } = useContractRead(token, "totalSupply", []);
  const totalSupply = Number(
    ethers.utils.formatEther(BigNumber.from(totalSupplyInWei || 0))
  );
  const tokenCreator = tokenInfo?.creator || "";

  return (
    <div className="mt-6">
      <div className="text-white text-[17px] font-semibold text-center">
        holder distribution
      </div>
      <div className="flex flex-col max-h-[400px] overflow-y-auto mt-4">
        {holders.map((row: any, id: number) => {
          const allocation =
            totalSupply > 0 ? (Number(row.amount) / totalSupply) * 100 : 0;
          const isBondingCurve =
            (row.account?.toLowerCase() || "") ===
            tokenPoolAddress?.toLowerCase();
          const isDev =
            (row.account?.toLowerCase() || "") === tokenCreator?.toLowerCase();

          return (
            <div
              key={row.account}
              className="flex justify-between items-center text-value_grey"
            >
              {/* name */}
              <div className="flex items-center gap-2">
                <div>
                  <NextLink
                    className="text-base font-normal hover:underline"
                    href={`/profile/${row.account}`}
                  >
                    {`${id + 1}. ${shortenAddress(row.account)}`}
                    {isBondingCurve && <span>{` (bonding curve)`}</span>}
                    {isDev && <span>{` (dev)`}</span>}
                  </NextLink>
                </div>
              </div>
              {/* allocation */}
              <div>
                <div>{`${allocation.toFixed(2)}%`}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
