"use client";

import { useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";

export default function LastCreatedToken({ tokenInfo }: { tokenInfo: any }) {
  const [isShaking, setIsShaking] = useState(false);

  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  useEffect(() => {
    if (tokenInfo) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 500);
    }
  }, [tokenInfo]);

  if (!tokenInfo) return null;

  return (
    <>
      {tokenInfo && (
        <div
          className={`flex gap-0.5 px-2.5 py-2 bg-light_blue ${
            isShaking ? "animate-shake" : ""
          } ${isMobile ? "m-auto" : ""}`}
        >
          <Image
            width={0}
            height={0}
            alt="creator"
            src={tokenInfo?.profile?.avatar}
            classNames={{
              img: "w-[20px] h-[20px] md:w-[20px] md:h-[20px] rounded-full",
              wrapper: "w-[20px] h-[20px] md:w-[20px] md:h-[20px] rounded-full",
            }}
          />
          <div className="text-black whitespace-nowrap flex gap-1">
            <span className="font-semibold">{tokenInfo?.profile?.handle}</span>
            <span>created</span>
            <span className="font-semibold">{tokenInfo?.symbol}</span>
          </div>
          <Image
            width={0}
            height={0}
            alt="token"
            src={tokenInfo?.logo}
            classNames={{
              img: "w-[20px] h-[20px] md:w-[20px] md:h-[20px] rounded-full",
              wrapper: "w-[20px] h-[20px] md:w-[20px] md:h-[20px] rounded-full",
            }}
          />
        </div>
      )}
    </>
  );
}
