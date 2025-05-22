"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Image } from "@nextui-org/react";

const ImageDropzoneInput = ({
  className,
  disabled,
  onSelect,
}: {
  className?: string;
  disabled?: boolean;
  onSelect: (value: any) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // action: drop image to upload input
  const onDrop = (acceptedFiles: any[], rejectedFiles: any[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedImage(acceptedFiles[0]);
      onSelect(acceptedFiles[0]);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: false,
    disabled: disabled,
    accept: {
      "image/*": [".png", ".jpeg"],
    },
  });

  return (
    <div className={`cursor-pointer text-value_grey ${className}`}>
      <div className="h-full" {...getRootProps()}>
        <input {...getInputProps()} />
        {!selectedImage && (
          <div className="text-sm flex items-center justify-center m-auto h-full p-2 text-center">
            {isDragActive ? (
              <p>Drop file(s) here ...</p>
            ) : (
              <p>Drag and drop file here, or click</p>
            )}
          </div>
        )}
        {selectedImage && (
          <div className="flex h-full items-center gap-1">
            <Image
              width={0}
              height={0}
              alt="logo"
              src={`${URL.createObjectURL(selectedImage)}`}
              classNames={{
                img: "w-[100%] h-auto md:w-[100%] md:h-auto rounded",
                wrapper:
                  "w-[100%] h-auto md:w-[100%] md:h-auto max-h-[100%] overflow-y-scroll",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { ImageDropzoneInput };
