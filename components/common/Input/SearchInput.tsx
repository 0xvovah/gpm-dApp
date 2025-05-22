"use client";

import { useState } from "react";
import { Input, Button } from "@nextui-org/react";

const SearchInput = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const [value, setValue] = useState("");

  const onChangeInput = (e: any) => {
    const { value: newValue } = e.target;
    if (value !== newValue) {
      setValue(newValue);
    }
  };

  const handleSearch = () => {
    onSearch(value);
  };

  return (
    <div className="flex rounded-lg !bg-light_blue">
      <Input
        type="text"
        label=""
        value={value}
        placeholder="type here"
        onChange={onChangeInput}
        className="border-none rounded-lg !bg-light_blue"
        classNames={{
          inputWrapper: "!bg-light_blue",
          input: "!text-black",
        }}
      />
      <Button
        className="!px-4 !font-normal !h-[full] min-w-[90px] !bg-bg_primary rounded-lg text-base"
        onClick={handleSearch}
        spinnerPlacement="end"
      >
        search
      </Button>
    </div>
  );
};

export { SearchInput };
