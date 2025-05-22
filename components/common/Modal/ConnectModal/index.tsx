"use client";

import { ConnectWallet, useAddress, useBalance } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import { Button, Image } from "@nextui-org/react";
import { BigNumber, ethers } from "ethers";

import { useGlobalState } from "@/app/GlobalState";
import { images } from "@/lib/constants/image";

export default function ConnectModal() {
  const router = useRouter();
  const address = useAddress();

  const onViewProfile = (e: any) => {
    if (!address) return;
    router.push(`/profile/${address}`);

    e.stopPropagation();
  };

  return (
    <ConnectWallet
      hideTestnetFaucet
      switchToActiveChain={true}
      modalTitle="Connect wallet"
      btnTitle="Connect wallet"
      modalTitleIconUrl="/images/logo.png"
      className="!px-2 sm:!px-6 !font-normal !h-[32px] !rounded-lg !min-w-[90px] sm:!min-w-[115px] !bg-bg_primary !text-white !text-xs sm:text-base"
      welcomeScreen={() => {
        return null;
      }}
      detailsBtn={() => {
        return (
          <div className="flex flex-col gap-1">
            <Button
              className="!px-2 sm:!px-6 !font-normal !h-[32px] !rounded-lg !min-w-[90px] sm:!min-w-[115px] !bg-bg_primary !text-white !text-xs sm:text-base"
              onClick={onViewProfile}
            >
              <div className="flex items-center justify-center gap-2">
                <p>view profile</p>
              </div>
            </Button>

            {/* <div className="flex items-center text-base justify-center gap-2 cursor-pointer">
              <p>
                {`(${Number(profileBalance).toFixed(2)} ${nativeTokenSymbol}`}
              </p>
              <Image
                src={profileAvatar}
                width={0}
                height={0}
                alt="avatar"
                classNames={{
                  img: "w-[25px] h-[25px] rounded-full",
                  wrapper: "w-[25px] h-[25px] rounded-full",
                }}
              />
              <p>{`${profileName})`}</p>
            </div> */}
          </div>
        );
      }}
    />
  );
}
