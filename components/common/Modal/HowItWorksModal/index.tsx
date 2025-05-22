"use client";

import { Modal, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react";

const steps = [
  {
    id: 1,
    text: "pick a coin that you like",
  },
  {
    id: 2,
    text: "buy the coin on the bonding curve",
  },
  {
    id: 3,
    text: "sell at any time to lock in your profits or losses",
  },
  {
    id: 4,
    text: "when enough people buy on the bonding curve it reaches a market cap of $69k",
  },
  {
    id: 5,
    text: "$12k of liquidity is then deposited in PulseX and burned",
  },
];

export default function FaucetModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        hideCloseButton
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "items-start" }}
      >
        <ModalContent className="max-w-lg !w-[500px] bg-card_bg border-0 rounded-lg shadow-none w-auto px-3 py-2 md:p-8 m-2 md:m-0">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl text-center font-medium">
                how it works
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6 max-h-[calc(100vh-150px)] overflow-y-auto text-center">
                  <div className="text-base text-value_grey">
                    <span>
                      {`GoPumpMe prevents rugs by making sure that all created tokens are
                  safe. Each coin on pump is a `}
                    </span>
                    <span className="text-primary font-medium">{`fair-launch`}</span>
                    <span>{` with `}</span>
                    <span className="text-primary font-medium">{`no presale`}</span>
                    <span>{` and no team allocation.`}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {steps.map((stepItem) => {
                      return (
                        <div
                          key={stepItem.id}
                          className="text-base text-value_grey"
                        >
                          <span className="text-primary font-medium">{`step ${stepItem.id}: `}</span>
                          <span>{stepItem.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
