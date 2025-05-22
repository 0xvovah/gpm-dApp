"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";

import { FaucetModal } from "@/components/common";

export default function Faucet() {
  const [modalOpen, setIsModalOpen] = useState<boolean>(false);

  const onToggleModal = () => {
    setIsModalOpen(!modalOpen);
  };

  return (
    <div className="my-4">
      <Button
        className="w-full !font-bold !h-[44px] !bg-lime-500 rounded-lg text-lg"
        onClick={onToggleModal}
        spinnerPlacement="end"
      >
        faucet help
      </Button>
      {modalOpen && (
        <FaucetModal isOpen={modalOpen} onOpenChange={onToggleModal} />
      )}
    </div>
  );
}
