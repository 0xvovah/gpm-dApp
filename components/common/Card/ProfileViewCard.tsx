"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, Tab, Button } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import NextLink from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAddress } from "@thirdweb-dev/react";

import {
  CoinsHeld,
  CoinsCreated,
  Replies,
  Notifications,
  Followers,
  Followings,
} from "@/components/profile";
import ProfileModal from "@/components/common/Modal/ProfileModal";
import { PROFILE_PORTFORLIO_BACKEND_GET_INFO } from "@/lib/constants/backend";
import { shortenAddress } from "@/lib/utils/addressHelper";
import { images } from "@/lib/constants/image";
import { EXPLORER_URL } from "@/lib/constants/network";
import { useGlobalState } from "@/app/GlobalState";

const tabLists = [
  {
    label: "coins held",
    value: "coin-held",
  },
  // {
  //   label: "replies",
  //   value: "replies",
  // },
  // {
  //   label: "notifications",
  //   value: "notifications",
  // },
  {
    label: "coin created",
    value: "coin-created",
  },
  // {
  //   label: "followers",
  //   value: "followers",
  // },
  // {
  //   label: "following",
  //   value: "following",
  // },
];

export default function ProfileViewCard() {
  const [editProfileModalOpen, setEditProfileModalOpen] =
    useState<boolean>(false);

  const [userPortfolio, setUserPortfolio] = useState({
    createdTokens: [],
    holds: [],
    profile: null,
    trades: [],
  });

  const { userPortfolio: newUserPortfolio } = useGlobalState();
  const address = useAddress();
  const router = useRouter();
  const params = useParams();
  const profileAddress = params?.slug ? params.slug[0] : "";
  const { createdTokens, profile, holds: holdingTokens } = userPortfolio;
  const isMe = (address || "").toLowerCase() === profileAddress?.toLowerCase();

  const fetchUserPortfolio = useCallback(async (address?: string) => {
    if (!address) return;

    const res = await axios.get(
      `${PROFILE_PORTFORLIO_BACKEND_GET_INFO}/${address}`
    );

    if (res.status == 200) {
      setUserPortfolio((prev) => {
        return { ...prev, ...res.data };
      });
    }
  }, []);

  const onToggleEditProfileModal = () => {
    setEditProfileModalOpen(!editProfileModalOpen);
  };

  const renderTabContent = (key: string) => {
    if (key === "coin-held") {
      return <CoinsHeld tokens={holdingTokens} />;
    }
    if (key === "coin-created") {
      return <CoinsCreated tokens={createdTokens} />;
    }
    if (key === "replies") {
      return <Replies />;
    }
    if (key === "notifications") {
      return <Notifications />;
    }

    if (key === "followers") {
      return <Followers />;
    }
    if (key === "following") {
      return <Followings />;
    }
    return <div className="text-center">Coming soon</div>;
  };

  useEffect(() => {
    if (!profileAddress) {
      router.push(`/board`);
    }
  }, [profileAddress, router, profile]);

  useEffect(() => {
    fetchUserPortfolio(profileAddress);
  }, [profileAddress, fetchUserPortfolio]);

  useEffect(() => {
    if (
      (newUserPortfolio?.profile?.address || "").toLowerCase() ===
      profileAddress.toLowerCase()
    ) {
      setUserPortfolio(newUserPortfolio);
    }
  }, [newUserPortfolio]);

  return (
    <>
      {editProfileModalOpen && (
        <ProfileModal
          isOpen={editProfileModalOpen}
          onOpenChange={onToggleEditProfileModal}
        />
      )}

      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row md:flex-row gap-20 md:gap-20 m-auto justify-center items-center">
          <div className="relative m-auto">
            <Image
              width={0}
              height={0}
              alt="avatar"
              src={(profile as any)?.avatar || images.profileDefault}
              classNames={{
                img: "w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full",
                wrapper:
                  "w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full",
              }}
            />
          </div>
          <div className="flex flex-col gap-0 md:gap-12">
            {/* <div></div> */}
            {/* general info */}
            <div className="flex flex-col justify-center gap-2 w-full lg:max-w-[250px] text-left">
              <div className="flex flex-col gap-1 text-white">
                <div>
                  {(profile as any)?.handle
                    ? `@${(profile as any)?.handle}`
                    : shortenAddress(profileAddress)}
                </div>
                {/* <div>{`${(profile as any)?.followers || 0} followers`}</div> */}
                <div>{`${(profile as any)?.bio || ""}`}</div>
              </div>
              {isMe && (
                <div>
                  <Button
                    className="!px-6 !font-normal !h-[32px] !bg-bg_primary rounded-lg text-base"
                    onClick={onToggleEditProfileModal}
                    spinnerPlacement="end"
                  >
                    edit profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* activity info: likes and mentions */}
          {/* <div className="flex justify-center gap-2 mt-8 md:justify-start md:mt-2">
                <div className="text-red text-base">
                  {`likes received: ${(profile as any)?.likeReceived || 0}`}
                </div>
                <div className="text-light_blue">
                  {`mentions received: ${
                    (profile as any)?.mentionReceived || 0
                  }`}
                </div>
              </div> */}
          {/* address */}
          {profileAddress && (
            <div className="flex flex-wrap justify-center items-center gap-5 mt-5">
              <div className="bg-black text-white text-base whitespace-nowrap rounded-lg px-2.5 py-2">
                {profileAddress}
              </div>
              <div className="flex gap-1 items-center">
                <NextLink
                  className="text-value_grey text-base font-normal"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${EXPLORER_URL}/address/${profileAddress}`}
                >
                  view on explorer
                </NextLink>
                <BsArrowRight />
              </div>
            </div>
          )}
        </div>
        <div className="mt-10">
          <Tabs
            aria-label="Options"
            variant="underlined"
            classNames={{
              tabList:
                "flex gap-1 flex-wrap justify-center w-full relative rounded-none p-0 border-divider",
              cursor: "w-full bg-light_blue",
              tab: "max-w-fit px-0 h-12 !h-auto !px-2",
              tabContent: "group-data-[selected=true]:text-light_blue",
            }}
          >
            {tabLists.map((row) => {
              return (
                <Tab
                  key={row.value}
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{row.label}</span>
                    </div>
                  }
                  className="mt-4"
                >
                  {renderTabContent(row.value)}
                </Tab>
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
}
