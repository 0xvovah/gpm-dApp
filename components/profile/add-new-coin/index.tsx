"use client";

import NextImage from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { images } from "@/lib/constants/image";

export default function AddNewCoin() {
  const router = useRouter();

  const onNavigateToTokenCreation = () => {
    router.push(`/new-coin`);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex z-10">
        <div>
          <NextImage
            width={34}
            height={34}
            alt="red-chip"
            src={images.redChip}
          />
        </div>
        <div className="-ml-4 -mr-4">
          <NextImage
            width={34}
            height={34}
            alt="blue-chip"
            src={images.blueChip}
          />
        </div>
      </div>

      <Button
        className="!px-6 !font-normal !h-[32px] !bg-bg_primary rounded-lg text-base"
        onClick={onNavigateToTokenCreation}
        spinnerPlacement="end"
      >
        Add new coin
      </Button>
    </div>
  );
}
