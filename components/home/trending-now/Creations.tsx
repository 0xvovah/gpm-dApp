"use client";

import { Image } from "@nextui-org/image";
import { shortenAddress } from "@thirdweb-dev/react";
import NextLink from "next/link";

import { images, icons } from "@/lib/constants/image";

export default function Creations({ creates }: { creates: any }) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center items-center gap-2">
        <Image
          src={icons.egg}
          width={0}
          height={0}
          alt="avatar"
          classNames={{
            img: "w-[24px] h-[24px] rounded-full",
            wrapper: "w-[24px] h-[24px] rounded-full",
          }}
        />
        <div className="text-cyan-300 text-lg font-bold">creations</div>
        <Image
          src={icons.egg}
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
        {creates.map((create: any, id: number) => {
          const { profile, symbol: tokenSymbol, address } = create;
          const profileAvatar = profile?.avatar || images.profileDefault;
          const profileHandle =
            profile?.handle || shortenAddress(profile?.address || "");

          const bgColor = id % 2 ? "bg-pink-300" : "bg-teal-300";

          return (
            <div
              key={address}
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
              <div className="">{`created`}</div>
              <div className="font-semibold text-ellipsis overflow-hidden">
                <NextLink href={`/token/${address}`}>{tokenSymbol}</NextLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
