"use client";

import { Image } from "@nextui-org/image";
import { shortenAddress } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import NextLink from "next/link";

import { images, icons } from "@/lib/constants/image";
import { beautifyNumber } from "@/lib/utils";

export default function Trades({ trades }: { trades: any }) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center items-center gap-2">
        <Image
          src={icons.smile}
          width={0}
          height={0}
          alt="avatar"
          classNames={{
            img: "w-[24px] h-[24px] rounded-full",
            wrapper: "w-[24px] h-[24px] rounded-full",
          }}
        />
        <div className="text-cyan-300 text-lg font-bold">trades</div>
        <Image
          src={icons.smile}
          width={0}
          height={0}
          alt="avatar"
          classNames={{
            img: "w-[24px] h-[24px] rounded-full",
            wrapper: "w-[24px] h-[24px] rounded-full",
          }}
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 bg-black rounded-lg p-3 max-h-[200px] overflow-y-auto">
        {trades.map((trade: any) => {
          const { isBuy, raiseAmount, profile, token, transactionHash } = trade;
          const profileAvatar = profile?.avatar || images.profileDefault;
          const profileHandle =
            profile?.handle || shortenAddress(profile?.address || "");
          const tokenSymbol = token?.symbol || "";
          const raiseAmountInEth = ethers.utils.formatEther(
            BigNumber.from(String(raiseAmount) || 0)
          );
          const bgColor = isBuy ? "bg-lime-400" : "bg-yellow-300";

          return (
            <div
              key={transactionHash || new Date().valueOf()}
              className={`flex gap-2 items-center px-1.5 py-1 ${bgColor} text-black whitespace-nowrap`}
            >
              <div>
                <Image
                  src={profileAvatar}
                  width={0}
                  height={0}
                  alt="avatar"
                  classNames={{
                    img: "w-[16px] h-[16px] rounded-full",
                    wrapper: "w-[16px] h-[16px] rounded-full",
                  }}
                />
              </div>
              <div className="font-semibold">
                <NextLink href={`/profile/${profile?.address}`}>
                  {profileHandle}
                </NextLink>
              </div>
              <div>{isBuy ? "bought" : "sold"}</div>
              <div className="font-semibold">
                {`${beautifyNumber(raiseAmountInEth)} PLS`}
              </div>
              <div>{`of`}</div>
              <div className="font-semibold text-ellipsis overflow-hidden">
                <NextLink href={`/token/${token?.address}`}>
                  {tokenSymbol}
                </NextLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
