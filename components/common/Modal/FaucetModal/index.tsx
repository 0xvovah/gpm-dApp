"use client";

import { Modal, ModalHeader, ModalBody, ModalContent } from "@nextui-org/react";
import NextLink from "next/link";

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
              <ModalHeader className="flex flex-col gap-1 text-xl text-center font-medium px-0">
                Faucet Help
              </ModalHeader>
              <ModalBody className="px-0">
                <div className="flex flex-col gap-6 max-h-[calc(100vh-150px)] overflow-y-auto">
                  <div>
                    <div className="text-lg">Pulsechain Faucet Link: </div>
                    <div className="text-base text-value_grey">
                      <NextLink
                        className="text-value_grey text-base font-normal underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://faucet.v4.testnet.pulsechain.com`}
                      >
                        https://faucet.v4.testnet.pulsechain.com
                      </NextLink>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg">
                      How to add Pulsechain V4 Testnet:
                    </div>
                    <div className="text-base text-value_grey">
                      <NextLink
                        className="text-value_grey text-base font-normal underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://youtu.be/QD6R-IfmBpE`}
                      >
                        https://youtu.be/QD6R-IfmBpE
                      </NextLink>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg">
                      Manual Settings to add testnet network:
                    </div>
                    <div className="text-base text-value_grey">
                      <div>
                        <span className="font-bold">{`•V4 Network:   `}</span>
                        <span>PulseChain Testnet-V4</span>
                      </div>
                      <div>
                        <span className="font-bold">{`•V4 RPC URL:   `}</span>
                        <span>
                          <NextLink
                            className="text-value_grey text-base font-normal underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://rpc.v4.testnet.pulsechain.com`}
                          >
                            https://rpc.v4.testnet.pulsechain.com
                          </NextLink>
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">{`•V4 Chain ID:   `}</span>
                        <span>943</span>
                      </div>
                      <div>
                        <span className="font-bold">{`•V4 Currency Symbol:   `}</span>
                        <span>tPLS</span>
                      </div>
                      <div>
                        <span className="font-bold">{`•V4 Block explorer URL:   `}</span>
                        <span>
                          <NextLink
                            className="text-value_grey text-base font-normal underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://scan.v4.testnet.pulsechain.com`}
                          >
                            https://scan.v4.testnet.pulsechain.com
                          </NextLink>
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">{`•V4 Bridge:   `}</span>
                        <span>
                          <NextLink
                            className="text-value_grey text-base font-normal underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://bridge.v4.testnet.pulsechain.com`}
                          >
                            https://bridge.v4.testnet.pulsechain.com
                          </NextLink>
                        </span>
                      </div>
                    </div>
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
