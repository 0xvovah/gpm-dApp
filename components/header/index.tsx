"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { useMediaQuery } from "react-responsive";
import { useAddress } from "@thirdweb-dev/react";

import {
  ConnectModal,
  HowItWorksModal,
  VerifyYourAccountModal,
} from "@/components/common";
import { images } from "@/lib/constants/image";
import useAuth from "@/hooks/useAuth";
import { getAuthData } from "@/lib/utils/localstorage";
import { useGlobalState } from "@/app/GlobalState";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountVerifyModalOpen, setAccountVerifyModalOpen] =
    useState<boolean>(false);

  const { fetchUserPortfolio } = useGlobalState();
  const address = useAddress();
  const { authToken } = useAuth(address);
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });
  const authData = JSON.parse(getAuthData() || "{}");
  const signature = authData?.signature;

  const onToggleHelpModal = () => {
    setIsModalOpen(!modalOpen);
  };

  const onToggleAccountVerifyModal = useCallback(() => {
    setAccountVerifyModalOpen(!accountVerifyModalOpen);
  }, [accountVerifyModalOpen]);

  useEffect(() => {
    if (!authToken) return;
    if (!address) return;
    if (signature) return;

    onToggleAccountVerifyModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, authToken, signature]);

  useEffect(() => {
    fetchUserPortfolio(address);
  }, [address, fetchUserPortfolio]);

  // render mobile view
  const renderMobileView = () => {
    return (
      <>
        <Navbar
          onMenuOpenChange={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          // shouldHideOnScroll
          className="py-4 bg-transparent justify-start block"
          classNames={{
            wrapper: "max-w-full p-0",
          }}
        >
          {/* how it works */}
          <NavbarContent className="gap-8 w-full">
            <NavbarItem className="">
              <Button
                className="!px-2 !font-normal !h-[32px] !rounded-lg !bg-bg_primary !text-white !text-xs sm:text-base"
                onClick={onToggleHelpModal}
              >
                how it works
              </Button>
            </NavbarItem>
          </NavbarContent>

          {/* logo */}
          <NavbarContent className="flex gap-6 !justify-between">
            <NavbarItem className="">
              <Link href="/" color="foreground" as={NextLink}>
                <div className="relative w-[140px] min-w-[140px] h-[30px]">
                  <NextImage
                    width={0}
                    height={0}
                    alt="token"
                    src={images.logo}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </Link>
            </NavbarItem>
          </NavbarContent>

          {/* connect wallet */}
          <NavbarContent className="flex !justify-end">
            <NavbarItem>
              <ConnectModal />
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </>
    );
  };

  // render desktop view
  const renderDesktopView = () => {
    return (
      <>
        <Navbar
          onMenuOpenChange={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
          // shouldHideOnScroll
          className="py-4 bg-transparent justify-start block"
          classNames={{
            wrapper: "max-w-full p-0",
          }}
        >
          {/* left */}
          <NavbarContent className="gap-8 w-full">
            <NavbarItem className="hidden sm:block">
              <Button
                className="!px-6 !font-normal !h-[32px] !rounded-lg !min-w-[115px] !bg-bg_primary !text-white !text-base sm:text-base"
                onClick={onToggleHelpModal}
              >
                how it works
              </Button>
            </NavbarItem>
          </NavbarContent>

          {/* center */}
          <NavbarContent className="gap-8 w-full">
            <NavbarItem className="hidden sm:block">
              <Link href="/" color="foreground" as={NextLink}>
                <NextImage
                  width={142}
                  height={24}
                  alt="logo"
                  src={images.logo}
                  className="min-w-[142px] min-h-[24px]"
                />
              </Link>
            </NavbarItem>
          </NavbarContent>

          {/* right */}
          <NavbarContent className="!grow-0 gap-6">
            <NavbarItem>
              <ConnectModal />
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </>
    );
  };

  return (
    <>
      {accountVerifyModalOpen && (
        <VerifyYourAccountModal
          isOpen={accountVerifyModalOpen}
          onOpenChange={onToggleAccountVerifyModal}
        />
      )}
      {modalOpen && (
        <HowItWorksModal isOpen={modalOpen} onOpenChange={onToggleHelpModal} />
      )}
      <>{isMobile ? renderMobileView() : renderDesktopView()} </>
    </>
  );
}
