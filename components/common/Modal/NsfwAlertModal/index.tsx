"use client";

import { Modal, ModalBody, ModalContent } from "@nextui-org/react";

export default function NsfwAlertModal({
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
              <ModalBody>
                <p className="text-lg text-red text-center font-semibold">
                  Token image is not safe for work.
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
