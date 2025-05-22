"use client";

import { Image } from "@nextui-org/react";
import NextLink from "next/link";

import { AddNewCoin } from "@/components/profile";
import { ethers } from "ethers";

export default function CoinsHeld({ tokens }: { tokens: any[] }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div>
        <AddNewCoin />
      </div>
      <div className="flex flex-col gap-2">
        {tokens.map((row) => {
          const { token, amount } = row;
          return (
            <div
              key={token.address}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <div className="relative m-auto">
                  <Image
                    width={0}
                    height={0}
                    alt="logo"
                    src={token.logo}
                    classNames={{
                      img: "w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full",
                      wrapper: "w-[36px] h-[36px] md:w-[40px] md:h-[40px]",
                    }}
                  />
                </div>
                <div>
                  <div>
                    {`${Number(ethers.utils.formatEther(amount)).toFixed(
                      2
                    )} ${token.symbol.slice(0, 6)}`}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <NextLink
                    className="text-value_grey text-base font-normal"
                    href={`/token/${token.address}`}
                  >
                    {`[view coin]`}
                  </NextLink>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
