"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { TokenCreationForm } from "@/components/coin-creation";

export default function Page() {
  const router = useRouter();

  const onNavigateToHome = () => {
    router.push(`/board`);
  };

  return (
    <>
      {/* <div className="mt-10">
        <Button
          className="!px-6 !font-normal !h-[32px] !bg-bg_primary rounded-none text-base"
          onClick={onNavigateToHome}
          spinnerPlacement="end"
        >
          home page
        </Button>
      </div> */}
      <div className="w-full mt-12">
        <TokenCreationForm />
      </div>
    </>
  );
}
