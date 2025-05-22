"use client";
import { Image, Progress } from "@nextui-org/react";
import NextLink from "next/link";
import {
  shortenAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";

import { getTokenPoolAddress } from "@/lib/utils";
import abis from "@/lib/abi";
import { CopyClipboardButton } from "@/components/common";
import { icons } from "@/lib/constants/image";

const tokenPoolAddress = getTokenPoolAddress();

export default function TokenGeneralInfo({ tokenInfo }: { tokenInfo: any }) {
  const {
    logo,
    name,
    symbol,
    description,
    telegram,
    twitter,
    website,
    address: tokenAddress,
    dexPair,
    createdAt,
  } = tokenInfo;

  const { contract: tokenPool } = useContract(tokenPoolAddress, abis.tokenPool);
  const { data: tokenOnchainInfo } = useContractRead(tokenPool, "tokenInfos", [
    tokenAddress,
  ]);
  const { data: initReserveRaw } = useContractRead(tokenPool, "raiseTokens", [
    ethers.constants.AddressZero,
  ]);

  const maxCap = BigNumber.from(tokenOnchainInfo?.maxCap || 0);
  const raiseReserve = BigNumber.from(tokenOnchainInfo?.raiseReserve || 0);
  // const initReserve = BigNumber.from(initReserveRaw || 0);

  // const initReserve =
  //   createdAt < 1738082200
  //     ? BigNumber.from(ethers.utils.parseUnits("1380000000"))
  //     : createdAt < 1738290400
  //     ? BigNumber.from(ethers.utils.parseUnits("345000000"))
  //     : BigNumber.from(initReserveRaw || 0);

  const initReserve = BigNumber.from(initReserveRaw || 0);

  const bondingCurveProgressInWei =
    Number(ethers.utils.formatEther(maxCap)) !== 0
      ? BigNumber.from(10000)
          // .mul(raiseReserve.mul(100).div(99).sub(initReserve))
          .mul(raiseReserve.sub(initReserve))
          .div(maxCap.sub(initReserve))
      : BigNumber.from(0);

  // const bondingCurveProgress = Math.min(
  //   100,
  //   Number(bondingCurveProgressInWei) / 100 >= 99
  //     ? 100
  //     : Number(bondingCurveProgressInWei) / 100
  // );

  const bondingCurveProgress = Math.min(
    100,
    Number(bondingCurveProgressInWei) / 100
  );

  if (!name) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* bonding curve */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between gap-1">
          <div className="flex">{`bonding curve progress: `}</div>
          <div className="flex text-white font-semibold">
            {`${bondingCurveProgress.toFixed(2)}%`}
          </div>
        </div>

        <Progress
          aria-label="bonding-curve"
          // className="max-w-2xl"
          value={bondingCurveProgress}
          size="md"
          classNames={{
            base: "h-[16px]",
            track: "!bg-card_bg h-[16px]",
            indicator: "!bg-bg_green !rounded-r-none h-[16px]",
          }}
        />
        {dexPair && (
          <div className="flex gap-2 text-value_grey justify-center">
            <div className="flex gap-1 items-center">
              <Image
                src={icons.pulseX}
                width={0}
                height={0}
                alt="avatar"
                classNames={{
                  img: "w-[20px] h-[20px] rounded-full",
                  wrapper: "w-[20px] h-[20px] rounded-full",
                }}
              />
              <span>{`pulseX pool seeded! view on pulseX `}</span>
            </div>
            <div>
              <NextLink
                className="text-base font-normal underline text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.geckoterminal.com/pulsechain/pools/${dexPair}`}
              >
                here
              </NextLink>
            </div>
          </div>
        )}
      </div>
      <div>
        <CopyClipboardButton
          label={`contract address: `}
          value={tokenAddress || ""}
          text={`${shortenAddress(tokenAddress, false)}`}
        />
      </div>

      {/* general info */}
      <div className="flex gap-4">
        <div className="relative">
          <Image
            width={0}
            height={0}
            alt="logo"
            src={logo}
            classNames={{
              wrapper:
                "relative shadow-black/5 shadow-none rounded-large w-[100px] h-[100px] md:w-[130px] md:h-[130px]",
              img: "relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large w-[100px] h-[100px] md:w-[130px] md:h-[130px]",
            }}
          />
        </div>
        <div className="flex-1 text-value_grey overflow-y-auto max-h-[130px]">
          <div className="font-semibold text-ellipsis overflow-hidden">
            <span className="">{`${name} (`}</span>
            <span className="text-white">{`${symbol}`}</span>
            <span className="">{`)`}</span>
          </div>
          <div className="text-ellipsis overflow-hidden">{`${description}`}</div>
        </div>
      </div>

      {/* social links */}
      {(telegram || twitter || website) && (
        <div className="flex justify-center gap-8">
          {telegram && (
            <div>
              <NextLink
                className="text-white text-base font-normal"
                target="_blank"
                rel="noopener noreferrer"
                href={telegram}
              >
                telegram
              </NextLink>
            </div>
          )}
          {twitter && (
            <div>
              <NextLink
                className="text-white text-base font-normal"
                target="_blank"
                rel="noopener noreferrer"
                href={twitter}
              >
                twitter
              </NextLink>
            </div>
          )}
          {website && (
            <div>
              <NextLink
                className="text-white text-base font-normal"
                target="_blank"
                rel="noopener noreferrer"
                href={website}
              >
                website
              </NextLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
