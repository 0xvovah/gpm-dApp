"use client";

import { useState } from "react";
import { Image } from "@nextui-org/react";

const ImageExpander = ({
  content,
  imageUrl,
}: {
  content?: string;
  imageUrl?: string;
}) => {
  const [isExpanded, setExpanded] = useState(false);

  // action: toggle expansion
  const onToggleExpanded = () => {
    setExpanded(!isExpanded);
  };

  return (
    <div
      className={`flex w-full gap-2 ${isExpanded ? "flex-col" : "flex-row"}`}
    >
      {imageUrl && (
        <div className="cursor-pointer" onClick={onToggleExpanded}>
          <Image
            width={0}
            height={0}
            alt="attachments"
            src={imageUrl}
            classNames={{
              img: isExpanded
                ? "w-auto h-auto md:w-auto md:h-auto rounded-lg"
                : "w-[100px] h-auto md:w-[100px] md:h-auto rounded-lg",
              wrapper: isExpanded
                ? "w-auto h-auto md:w-auto md:h-auto rounded-lg !max-w-none"
                : "w-[100px] h-auto md:w-[100px] md:h-auto rounded-lg !max-w-none",
            }}
          />
        </div>
      )}
      {content && <div>{content}</div>}
    </div>
  );
};

export { ImageExpander };
