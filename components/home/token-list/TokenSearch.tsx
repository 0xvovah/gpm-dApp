"use client";

import { useMediaQuery } from "react-responsive";

import { SearchInput, DropdownInput } from "@/components/common/Input";

export default function TokenSearch({
  onSearch,
  selectedOption,
  sortOptions,
  setSelectedOption,
}: {
  onSearch: (value: string) => void;
  selectedOption: any;
  sortOptions: any[];
  setSelectedOption: (option: any) => void;
}) {
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  // render mobile view
  const renderMobileView = () => {
    return (
      <div className="flex flex-col gap-4">
        {/* search input */}
        <div className="w-full md:max-w-[400px]">
          <SearchInput onSearch={onSearch} />
        </div>

        <div className="flex justify-end items-center">
          {/* dropdown select */}
          <div className="flex gap-4 items-center">
            <div>{`sort by: `}</div>
            <DropdownInput
              options={sortOptions}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </div>
      </div>
    );
  };

  // render desktop view
  const renderDesktopView = () => {
    return (
      <div className="flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex w-full justify-between gap-2">
          {/* search input */}
          <div className="w-full max-w-[300px] md:max-w-[300px] md:w-auto grow lg:max-w-[400px]">
            <SearchInput onSearch={onSearch} />
          </div>

          {/* dropdown input */}
          <div className="flex gap-4 items-center">
            <div>{`sort by: `}</div>
            <DropdownInput
              options={sortOptions}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return <>{renderMobileView()}</>;
  } else {
    return <>{renderDesktopView()}</>;
  }
}
