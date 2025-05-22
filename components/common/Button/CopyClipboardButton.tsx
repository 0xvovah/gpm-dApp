"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy, FaCheck } from "react-icons/fa";

const CopyClipboardButton = ({
  label,
  value,
  text,
}: {
  label: string;
  value: string;
  text: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = () => {
    try {
      // await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Button className="!px-4 !font-normal !h-[32px] min-w-[90px] w-full !bg-card_bg rounded-lg text-base">
      <CopyToClipboard text={value || ""} onCopy={onCopy}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{label}</span>
            <span>{text}</span>
          </div>
          <span> {isCopied ? <FaCheck /> : <FaCopy />}</span>
        </div>
      </CopyToClipboard>
    </Button>
  );
};

export { CopyClipboardButton };
