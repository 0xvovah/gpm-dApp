"use client";

import axios from "axios";
import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Image } from "@nextui-org/react";
import { useAddress } from "@thirdweb-dev/react";
import moment from "moment";

import { COMMENT_BACKEND_GET } from "@/lib/constants";
import { CHAIN_ID } from "@/lib/constants/network";
import { SOCKET_COMMENT_ROOM } from "@/lib/constants/backend";
import { CommentPostModal } from "@/components/common";
import { ImageExpander } from "@/components/common/Input";
import { useSocket } from "@/app/GlobalState";
import { images } from "@/lib/constants/image";

export default function TokenComment({ tokenInfo }: { tokenInfo: any }) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setIsModalOpen] = useState<boolean>(false);

  const { socket } = useSocket();
  const commentsRef = useRef(comments);

  const address = useAddress();
  const canComment = !isLoading && !!address;

  const fetchComments = useCallback(async () => {
    if (!tokenInfo.address) return;
    setIsLoading(true);

    try {
      const res = await axios.get(
        `${COMMENT_BACKEND_GET}/${CHAIN_ID}/${tokenInfo.address}`
      );

      if (res.status == 200) {
        const newComments: any[] = res.data.reverse();
        setComments(newComments);
        commentsRef.current = newComments;
      }
    } catch (error) {
      console.log("Comments get Error: ", error);
      return;
    }

    setIsLoading(false);
  }, [tokenInfo.address]);

  const initSocketClient = useCallback(() => {
    if (!tokenInfo.address) return;
    if (!socket) return;

    socket.emit("joinRoom", {
      room: `${SOCKET_COMMENT_ROOM}-${tokenInfo.address}`,
    });

    socket.on(
      `${SOCKET_COMMENT_ROOM}-${tokenInfo.address}:update`,
      (newComment: any) => {
        const lastComment = (commentsRef?.current || [])[0];
        if (lastComment?.id !== newComment?.id) {
          setComments([newComment, ...commentsRef?.current]);
          commentsRef.current = [newComment, ...commentsRef?.current];
        }
      }
    );
  }, [tokenInfo.address, socket]);

  useEffect(() => {
    fetchComments();
    initSocketClient();
  }, [tokenInfo.address, fetchComments, initSocketClient]);

  const onToggleCommentPostModal = () => {
    setIsModalOpen(!modalOpen);
  };

  return (
    <>
      {modalOpen && (
        <CommentPostModal
          tokenInfo={tokenInfo}
          isOpen={modalOpen}
          onOpenChange={onToggleCommentPostModal}
        />
      )}
      <div className="flex flex-col gap-2 md:gap-4">
        <div className="text-xl font-semibold">comments</div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              isDisabled={!canComment}
              isLoading={isLoading}
              onClick={onToggleCommentPostModal}
              className="bg-bg_green text-black"
            >
              post a reply
            </Button>
          </div>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {comments.map((comment: any) => {
              return (
                <div
                  key={comment.id}
                  className="flex flex-col gap-2 bg-black rounded-lg p-4"
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      width={0}
                      height={0}
                      alt="creator"
                      src={comment?.profile?.avatar || images.profileDefault}
                      classNames={{
                        img: "w-[24px] h-[24px] md:w-[24px] md:h-[24px] rounded-full",
                        wrapper:
                          "w-[24px] h-[24px] md:w-[24px] md:h-[24px] rounded-full",
                      }}
                    />
                    <div>{comment?.profile?.handle}</div>
                    <div className="text-sm text-value_grey">
                      {moment(1000 * (comment?.createdAt || 0)).format(
                        "MM/DD/YYYY, hh:mm:ss"
                      )}
                    </div>
                  </div>
                  {(comment?.content || comment?.attachments) && (
                    <ImageExpander
                      content={comment?.content}
                      imageUrl={comment?.attachments}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
