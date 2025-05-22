"use client";

import { useRouter } from "next/navigation";

import { TokenView } from "@/components/token";

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className="w-full">
        <TokenView /> 
      </div>
    </>
  );
}
