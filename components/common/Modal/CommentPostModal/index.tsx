"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import * as nsfwjs from "nsfwjs";

import { ImageDropzoneInput } from "@/components/common/Input";
import { getAuthData } from "@/lib/utils/localstorage";
import { CHAIN_ID } from "@/lib/constants/network";
import { COMMENT_BACKEND_POST_CREATE } from "@/lib/constants";
import { NsfwAlertModal } from "@/components/common";

export default function CommentPostModal({
  tokenInfo,
  isOpen,
  onOpenChange,
}: {
  tokenInfo: any;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [commentInfo, setCommentInfo] = useState({
    content: "",
    attachment: "",
    attachmentElement: null,
    attachmentUrl: "",
    isNSFW: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isNsfwAlertModalOpen, setIsNsfwAlertModalOpen] = useState(false);

  const address = useAddress();
  const account = address || ethers.constants.AddressZero;
  const authData = JSON.parse(getAuthData() || "{}");
  const signature = authData?.signature;

  const isValidComentInfo =
    commentInfo.content.length > 0 || !!commentInfo.attachment;
  const canComment = isValidComentInfo && !isLoading && !!address;

  // action: comment content change
  const onChangeComment = (e: any) => {
    const { value } = e.target;

    setCommentInfo({
      ...commentInfo,
      content: value,
    });
  };

  // action: comment attachment change
  const onChangeAttachment = (value: any) => {
    const image = new Image();
    image.src = URL.createObjectURL(value);

    setCommentInfo({
      ...commentInfo,
      attachment: value,
      attachmentElement: image as unknown as null,
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

    console.log("Comment attachment NSFW check result: ", classification);

    const isNSFW =
      classification.Sexy > 0.3 ||
      classification.Porn > 0.3 ||
      classification.Hentai > 0.3;

    return isNSFW;
  };

  // action: post comment
  const onPostComment = async () => {
    if (!address || !canComment) return;

    setIsLoading(true);

    // check if the attachment is NSFW
    const isNSFW = await checkImageNSFW(commentInfo.attachmentElement);
    if (isNSFW) {
      setIsLoading(false);
      setCommentInfo({
        ...commentInfo,
        isNSFW: isNSFW,
      });
      setIsNsfwAlertModalOpen(isNSFW);

      return;
    }

    try {
      const formData = new FormData();
      formData.append("attachments", commentInfo.attachment);
      formData.append("chainId", CHAIN_ID.toString());
      formData.append("tokenAddress", tokenInfo.address);
      formData.append("author", account);
      formData.append("content", commentInfo.content);
      formData.append("replyTo", tokenInfo.creator);
      formData.append("signature", signature);

      const res = await axios.post(COMMENT_BACKEND_POST_CREATE, formData);
      if (res.status == 201) {
        // setCommentInfo({
        //   content: "",
        //   attachment: "",
        //   attachmentUrl: "",
        // });
        onOpenChange();
      }
    } catch (error) {
      console.log("Comment post Error: ", error);
      return;
    }

    setIsLoading(false);
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
        backdrop="blur"
        hideCloseButton
        onOpenChange={onOpenChange}
        classNames={{ wrapper: "items-start" }}
      >
        <ModalContent className="max-w-lg !w-[500px] bg-card_bg border-0 rounded-lg shadow-none w-auto px-3 py-2 md:p-8 m-2 md:m-0">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                add a comment
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 sm:gap-8">
                  <Textarea
                    value={commentInfo.content}
                    label=""
                    placeholder="Enter your message"
                    isDisabled={isLoading}
                    onChange={onChangeComment}
                  />
                  <div className="flex flex-col gap-1">
                    <div className="text-base">{`image (optional)`}</div>
                    <ImageDropzoneInput
                      disabled={isLoading}
                      onSelect={onChangeAttachment}
                      className="bg-black rounded-lg w-[160px] h-[160px] md:w-[200px] md:h-[200px] m-auto"
                    />
                  </div>

                  <Button
                    type="button"
                    isDisabled={!canComment}
                    isLoading={isLoading}
                    onClick={onPostComment}
                    className="bg-bg_green text-black"
                  >
                    Submit
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
