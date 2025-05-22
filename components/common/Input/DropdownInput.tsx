"use client";

import { useId } from "react";
// import Select from "react-select";
import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), { ssr: false });

const DropdownInput = ({
  options,
  selectedOption,
  setSelectedOption,
}: {
  options: any[];
  selectedOption: any;
  setSelectedOption: (option: any) => void;
}) => {
  const id = useId();

  const onSelect = (newOption: any) => {
    if (newOption !== selectedOption) {
      setSelectedOption(newOption);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        inputId={id}
        aria-labelledby={id}
        value={selectedOption}
        onChange={onSelect}
        options={options}
        classNames={{
          control: () =>
            "!bg-bg_primary !border-none !rounded-lg !min-w-[130px]",
          singleValue: () => "!text-white !text-base",
          menu: () => "!m-0 !rounded-lg !bg-white",
          menuList: () => "!p-0 !bg-white !text-black",
        }}
      />
    </div>
  );
};

export { DropdownInput };
