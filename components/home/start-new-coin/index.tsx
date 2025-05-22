"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function StartNewCoin() {
  const router = useRouter();

  const onNavigateToTokenCreation = () => {
    router.push(`/new-coin`);
  };

  return (
    <div className="flex justify-center items-center w-full">
      <Button
        className="w-full !font-bold !h-[44px] !bg-fuchsia-500	rounded-lg text-lg"
        onClick={onNavigateToTokenCreation}
        spinnerPlacement="end"
      >
        create your token now!
      </Button>
    </div>
  );
}
