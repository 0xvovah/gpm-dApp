"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useAddress } from "@thirdweb-dev/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import * as nsfwjs from "nsfwjs";

import { ImageDropzoneInput } from "@/components/common/Input";
import { PROFILE_BACKEND_ROOT } from "@/lib/constants/backend";
import { getAuthData } from "@/lib/utils/localstorage";
import { useGlobalState } from "@/app/GlobalState";
import { NsfwAlertModal } from "@/components/common";

export default function ProfileModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    handle: "",
    avatar: "",
    avatarElement: null,
    isNSFW: false,
  });
  const [isNsfwAlertModalOpen, setIsNsfwAlertModalOpen] = useState(false);

  const { userPortfolio, fetchUserPortfolio } = useGlobalState();
  const address = useAddress();
  const authData = JSON.parse(getAuthData() || "{}");
  const profileName = userPortfolio?.profile?.handle || "";

  useEffect(() => {
    setUserInfo({
      ...userInfo,
      handle: profileName || "",
    });
  }, [profileName]);

  // action: user info input change
  const onChangeInput = (e: any) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  // action: user avatar change
  const onChangeImage = (value: any) => {
    const image = new Image();
    image.src = URL.createObjectURL(value);

    setUserInfo({
      ...userInfo,
      avatar: value,
      avatarElement: image as unknown as null,
    });
  };

  // action: check if the image is NSFW
  const checkImageNSFW = async (image: HTMLImageElement | null) => {
    if (!image) return;

    const model = await nsfwjs.load();
    const result = await model.classify(image);
    let classification: any = {};
    result.map((item) => {
      classification = {
        ...classification,
        [item.className]: item.probability,
      };
    });

    console.log("User PFP NSFW check result: ", classification);

    const isNSFW =
      classification.Sexy > 0.3 ||
      classification.Porn > 0.3 ||
      classification.Hentai > 0.3;

    return isNSFW;
  };

  // action: save user info
  const onSave = async () => {
    if (!address) return;

    setIsLoading(true);

    // check if the image is NSFW
    const isNSFW = await checkImageNSFW(userInfo.avatarElement);
    if (isNSFW) {
      setIsLoading(false);
      setUserInfo({
        ...userInfo,
        isNSFW: isNSFW,
      });
      setIsNsfwAlertModalOpen(isNSFW);

      return;
    }

    try {
      const formData = new FormData();
      formData.append("address", address);
      formData.append("handle", userInfo.handle);
      formData.append("signature", authData.signature);

      if (userInfo.avatar) {
        formData.append("avatar", userInfo.avatar);
      }

      const res = await axios.post(PROFILE_BACKEND_ROOT, formData);
      if (res.status == 201) {
        await fetchUserPortfolio(address);
      }
    } catch (error) {
      console.log("Profile Save Error: ", error);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange();
    }, 1000);
  };

  // action: cancel user info
  const onCancel = () => {
    onOpenChange();
  };

  // action: toggle nsfw alert modal
  const onToggleNsfwAlertModal = useCallback(() => {
    setIsNsfwAlertModalOpen(!isNsfwAlertModalOpen);
  }, [isNsfwAlertModalOpen]);

  useEffect(() => {
    const loadModel = async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.setBackend("cpu");
      await tf.env().set("DEBUG", false);
    };

    loadModel();
  }, []);

  return (
    <>
      {isNsfwAlertModalOpen && (
        <NsfwAlertModal
          isOpen={isNsfwAlertModalOpen}
          onOpenChange={onToggleNsfwAlertModal}
        />
      )}
      <Modal
        isOpen={isOpen}
        size="sm"
        backdrop="blur"
        hideCloseButton
        onOpenChange={onOpenChange}
      >
        <ModalContent className="max-w-lg !w-[500px] bg-card_bg border-0 rounded-lg shadow-none px-3 py-2 md:p-2 m-2 md:m-0">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Profile
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-4">
                    <Input
                      name="handle"
                      type="text"
                      label=""
                      value={userInfo.handle}
                      placeholder="Contrary"
                      isDisabled={isLoading}
                      onChange={onChangeInput}
                      className="rounded-lg"
                      classNames={{
                        inputWrapper: "rounded-lg",
                        input: "!text-white",
                      }}
                      startContent={
                        <div className="text-base text-white">Handle:</div>
                      }
                    />
                    <div
                      className={`flex items-center bg-black gap-1 rounded-lg px-3 py-2 ${
                        isLoading ? "!opacity-50" : ""
                      }`}
                    >
                      <div className="text-base text-white">{`Image: `}</div>
                      <div className="grow">
                        <ImageDropzoneInput
                          disabled={isLoading}
                          onSelect={onChangeImage}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" disabled={isLoading} onPress={onCancel}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  disabled={!address || isLoading}
                  onPress={onSave}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
