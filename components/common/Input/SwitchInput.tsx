"use client";

import { useState } from "react";
import { Button } from "@nextui-org/react";

const SwitchInput = ({ label }: { label: string }) => {
  const [status, setStatus] = useState<boolean>(false);

  const onToogle = (newStatus: boolean) => {
    if (newStatus !== status) {
      setStatus(newStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-value_grey">{label || ""}</div>
      <div className="flex gap-1">
        <Button
          className={`!font-normal !h-[26px] !w-[26px] !min-w-[26px] !bg-transparent ${
            status ? "!bg-bg_primary" : ""
          } rounded-none text-base`}
          onClick={() => onToogle(true)}
        >
          On
        </Button>
        <Button
          className={`!font-normal !h-[26px] !w-[26px] !min-w-[26px] !bg-transparent ${
            !status ? "!bg-bg_primary" : ""
          } rounded-none text-base`}
          onClick={() => onToogle(false)}
        >
          Off
        </Button>
      </div>
    </div>
  );
};

export { SwitchInput };
