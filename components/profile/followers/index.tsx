"use client";

import { Image } from "@nextui-org/react";
import NextLink from "next/link";

export default function Followers() {
  const followers: any[] = [];

  return (
    <div className="flex flex-col gap-2 mx-0 md:mx-6">
      {followers.map((row) => {
        return (
          <div
            key={row.id}
            className="flex justify-between items-center bg-card_bg py-1.5 px-3"
          >
            <div className="flex items-center gap-2">
              <div className="relative m-auto">
                <Image
                  width={0}
                  height={0}
                  alt="logo"
                  src={row.image}
                  classNames={{
                    img: "w-[18px] h-[18px] md:w-[18px] md:h-[18px] rounded-full",
                    wrapper: "w-[18px] h-[18px] md:w-[18px] md:h-[18px]",
                  }}
                />
              </div>
              <div>
                <NextLink
                  className="text-base font-normal hover:underline"
                  href={`/profile/${row.name}`}
                >
                  {`${row.name}`}
                </NextLink>
              </div>
            </div>
            <div>
              <div>{`${row.followers} followers`}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
