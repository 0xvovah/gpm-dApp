"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { createWalletClient, custom } from "viem";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { AUTH_BACKEND_POST_SIGN_MESSAGE } from "@/lib/constants/backend";
import { setAuthData, getAuthData } from "@/lib/utils/localstorage";

export default function VerifyYourAccountModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const address = useAddress();
  const { authToken } = useAuth(address);
  const authData = JSON.parse(getAuthData() || "{}");

  const onSignMessage = async () => {
    if (!address) return;
    if (authData?.signature) return;

    const walletClient = createWalletClient({
      account: address as `0x${string}`,
      transport: custom(window.ethereum!),
    });

    const signature = await walletClient.signMessage({
      message: `You are signing in GoPumpMe: ${authToken}`,
    });

    const res = await axios.post(`${AUTH_BACKEND_POST_SIGN_MESSAGE}`, {
      address,
      signature,
    });

    if (res.status == 201) {
      setAuthData(
        JSON.stringify({
          signature,
          lastAuthDay: res.data.lastAuthDay,
          token: res.data.token,
          updatedAt: res.data.updatedAt,
        })
      );
    }

    // close modal after signing
    onOpenChange();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        size="sm"
        backdrop="blur"
        hideCloseButton
        onOpenChange={onOpenChange}
      >
        <ModalContent className="max-w-lg !w-[500px] bg-card_bg border-0 rounded-lg shadow-none w-auto px-3 py-2 md:p-8 m-2 md:m-0">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Verify your account
              </ModalHeader>
              <ModalBody>
                <p className="text-base">
                  To finish connecting, you must sign a message in your wallet
                  to verify that you are the owner of this account.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onSignMessage}>
                  Sign Message
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
