"use client";

import NextImage from "next/image";
import { Image } from "@nextui-org/image";
import { useHover } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import NextLink from "next/link";

import { images, icons } from "@/lib/constants/image";
import abis from "@/lib/abi";
import { beautifyNumber } from "@/lib/utils";

export default function TokenCard({ tokenInfo }: { tokenInfo: any }) {
  const [ref, hovering] = useHover();
  const router = useRouter();

  const {
    address,
    name,
    symbol,
    creator,
    logo,
    commentCount,
    description,
    isLiveStreaming,
    profile,
    price,
    createdAt,
  } = tokenInfo;

  const { contract: token } = useContract(address, abis.erc20);
  const { data: totalSupplyInWei } = useContractRead(token, "totalSupply", []);

  const cardBgColor = hovering ? "bg-card_bg_hover" : "card_bg";
  const descriptionColor = hovering ? "text-white" : "text-value_grey";
  const borderColor = isLiveStreaming ? "border-1 border-red" : "";

  // navigate to coin page
  const onViewCoin = () => {
    router.push(`/token/${address}`);
  };

  // const isFeatured = createdAt < 1738082200;
  const isFeatured = false;
  const ethPrice = 0.00005;
  const totalSupply = ethers.utils.formatUnits(totalSupplyInWei || 0, 18);
  const priceInEth = ethers.utils.formatUnits(price || 0, 18);
  const marketcap =
    (isFeatured ? 0.25 : 1) *
    (Number(ethPrice) * Number(priceInEth) * Number(totalSupply));

  return (
    <div
      className="flex flex-col justify-center items-center cursor-pointer bg-black rounded-lg"
      ref={ref}
      onClick={onViewCoin}
    >
      <div
        className={`${cardBgColor} ${borderColor} p-3 w-full h-full rounded-lg`}
      >
        <div className="flex gap-2 md:gap-2 lg:gap-4">
          <div className="relative w-[128px] h-[128px] sm:w-[128px] sm:h-[128px] md:w-[128px] md:h-[128px]">
            <Image
              width={0}
              height={0}
              alt="token-logo"
              src={logo}
              classNames={{
                wrapper:
                  "relative shadow-black/5 shadow-none w-[128px] h-[128px] sm:w-[128px] sm:h-[128px] md:w-[128px] md:h-[128px] rounded-lg",
                img: "relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 w-[128px] h-[128px] sm:w-[128px] sm:h-[128px] md:w-[128px] md:h-[128px] rounded-lg",
              }}
            />
          </div>
          <div className="grow overflow-hidden">
            {isLiveStreaming && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-white bg-red w-fit p-1.5 truncate overflow-ellipsis overflow-hidden">
                  Currently live streaming
                </div>
                <div>
                  <NextImage
                    width={25}
                    height={20}
                    alt="spin"
                    src={icons.spin}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="text-base sm:text-lg text-white">{name}</div>
              <div className="flex gap-1 text-black bg-violet-800 w-fit p-1 sm:p-1.5 text-sm sm:text-base whitespace-nowrap z-0">
                <span className="text-neutral-400">created by</span>
                <span>
                  <Image
                    src={profile?.avatar || images.profileDefault}
                    width={0}
                    height={0}
                    alt="avatar"
                    classNames={{
                      img: "w-[18px] h-[18px] rounded-full",
                      wrapper: "w-[18px] h-[18px] rounded-full",
                    }}
                  />
                </span>
                <span className="text-white">
                  <NextLink
                    href={`/profile/${profile?.address}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {profile?.handle || ""}
                  </NextLink>
                </span>
              </div>
              <div className="flex gap-1 sm:gap-2 text-white items-center flex-wrap text-sm sm:text-base">
                <div className="flex gap-1 p-1 sm:p-1.5 bg-pink-500">
                  <div className="text-black">{`mcap: `}</div>
                  <div className="text-black font-bold">
                    {beautifyNumber(marketcap)}
                  </div>
                </div>
                <div className="flex gap-1 p-1 sm:p-1.5 bg-neutral-700 overflow-hidden">
                  <div className="text-neutral-400">{`ticker: `}</div>
                  <div className="font-bold text-ellipsis overflow-hidden">
                    {symbol}
                  </div>
                </div>
              </div>
              <div
                className={`overflow-y-auto overflow-x-hidden text-ellipsis max-h-[55px] text-sm sm:text-base`}
              >
                {description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
