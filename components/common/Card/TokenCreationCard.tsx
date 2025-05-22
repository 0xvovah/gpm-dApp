"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Button, Slider } from "@nextui-org/react";
import NextImage from "next/image";
import { BsArrowDown } from "react-icons/bs";
import { ImageDropzoneInput } from "@/components/common/Input";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useBalance,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as nsfwjs from "nsfwjs";

import { images, icons } from "@/lib/constants/image";
import { getTokenPoolAddress } from "@/lib/utils";
import abis from "@/lib/abi";
import { getAuthData } from "@/lib/utils/localstorage";
import {
  TOKEN_BACKEND_POST_UPLOAD_IMAGE,
  SOCKET_NEWS_ROOM_TOKEN_CREATED,
} from "@/lib/constants/backend";
import { useSocket } from "@/app/GlobalState";
import { NsfwAlertModal } from "@/components/common";

export default function TokenCreationCard() {
  const [coinInfo, setCoinInfo] = useState({
    name: "",
    symbol: "",
    description: "",
    image: "",
    imageElement: null,
    isFeatured: false,
    website: "",
    telegram: "",
    twitter: "",
    isNSFW: false,
  });
  const [isShowMoreOptions, setIsShowMoreOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNsfwAlertModalOpen, setIsNsfwAlertModalOpen] = useState(false);
  const [initialBuyPercent, setInitialBuyPercent] = useState<number>(0);

  const { contract: tokenPool } = useContract(
    getTokenPoolAddress(),
    abis.tokenPool
  );
  const { data: deployCostInWei } = useContractRead(
    tokenPool,
    "deployCost",
    []
  );
  const { data: tradeFeeRaw } = useContractRead(tokenPool, "tradeFee", []);
  const { data: initEthReserveInWei } = useContractRead(
    tokenPool,
    "raiseTokens",
    [ethers.constants.AddressZero]
  );
  const { mutateAsync: createNewToken } = useContractWrite(
    tokenPool,
    "createClub"
  );

  const ONE_HUNDRED = BigNumber.from(100);
  const initialBuyPercentBN = BigNumber.from(initialBuyPercent.toFixed(0));
  const tradeFeeBN = BigNumber.from(tradeFeeRaw || 0);
  const initEthReserveBN = BigNumber.from(initEthReserveInWei || 0);

  const requiredMoreEthBN = initEthReserveBN
    .mul(ONE_HUNDRED)
    .mul(initialBuyPercentBN)
    .div(ONE_HUNDRED.sub(tradeFeeBN))
    .div(ONE_HUNDRED.sub(initialBuyPercentBN));
  const deployCostBN = BigNumber.from(deployCostInWei || 0);

  const router = useRouter();
  const { socket } = useSocket();
  const { data: userEthBalInfo } = useBalance();
  const address = useAddress();
  const account = address || ethers.constants.AddressZero;
  const deployCost = Number(ethers.utils.formatEther(deployCostBN));
  const requiredMoreEth = Number(ethers.utils.formatEther(requiredMoreEthBN));

  const requiredEthBN = deployCostBN.add(requiredMoreEthBN);
  const requiredEth = Number(ethers.utils.formatEther(requiredEthBN));
  const userEthBalance = userEthBalInfo?.value || BigNumber.from(0);
  const hasEnoughEth = userEthBalance.gte(requiredEthBN);

  const isValidCoinInfo =
    coinInfo.name.length > 0 &&
    coinInfo.symbol.length > 0 &&
    coinInfo.description.length > 0 &&
    coinInfo.image &&
    !coinInfo.isNSFW &&
    hasEnoughEth;
  const canCreateCoin = isValidCoinInfo && !isLoading;
  const authData = JSON.parse(getAuthData() || "{}");
  const signature = authData?.signature;

  // action: toggle nsfw alert modal
  const onToggleNsfwAlertModal = useCallback(() => {
    setIsNsfwAlertModalOpen(!isNsfwAlertModalOpen);
  }, [isNsfwAlertModalOpen]);

  // action: toggle show more options
  const onToggleShowMoreOptions = () => {
    setIsShowMoreOptions(!isShowMoreOptions);
  };

  // action: token metadata input change
  const onChangeInput = (e: any) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (value.length > 12) return;
    }
    if (name === "symbol") {
      if (value.length > 10) return;
    }

    setCoinInfo({
      ...coinInfo,
      [name]: value,
    });
  };

  // action: token logo change
  const onChangeImage = (value: any) => {
    const image = new Image();
    image.src = URL.createObjectURL(value);

    setCoinInfo({
      ...coinInfo,
      image: value,
      imageElement: image as unknown as null,
      isNSFW: false,
    });
  };

  // action: token logo upload
  const tokenLogoUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("logo", coinInfo.image);
      formData.append("creator", account);
      formData.append("signature", signature);

      const res = await axios.post(TOKEN_BACKEND_POST_UPLOAD_IMAGE, formData);
      if (res.status == 201) {
        return res.data;
      } else {
        console.log("Token Logo Upload Error: ");
        return;
      }
    } catch (error) {
      console.log("Token Logo Upload Error: ", error);
      return;
    }
  };

  // action: check if the image is NSFW
  const checkImageNSFW = async (image: HTMLImageElement | null) => {
    if (!image) return;

    const model = await nsfwjs.load();
    const result = await model.classify(image);
    let classification: any = {};
    result.map((item) => {
      classification = {
        ...classification,
        [item.className]: item.probability,
      };
    });

    console.log("Token logo NSFW check result: ", classification);

    const isNSFW =
      classification.Sexy > 0.3 ||
      classification.Porn > 0.3 ||
      classification.Hentai > 0.3;

    return isNSFW;
  };

  // action: create a new coin
  const onCreateCoin = async () => {
    if (!address || !canCreateCoin) return;

    setIsLoading(true);

    // check if the image is NSFW
    const isNSFW = await checkImageNSFW(coinInfo.imageElement);

    if (isNSFW) {
      setIsLoading(false);
      setCoinInfo({
        ...coinInfo,
        isNSFW: isNSFW,
      });
      setIsNsfwAlertModalOpen(isNSFW);

      return;
    }

    // handle image upload
    const tokenLogoUrl = await tokenLogoUpload();
    if (!tokenLogoUrl) {
      setIsLoading(false);
      return;
    }

    // execute tx
    const tradingStartTime = Math.floor(Date.now() / 1000) + 60;
    const args: any[] = [
      coinInfo.name,
      coinInfo.symbol,
      tradingStartTime,
      coinInfo.isFeatured,
      {
        logo: tokenLogoUrl,
        description: coinInfo.description,
        website: coinInfo.website,
        telegram: coinInfo.telegram,
        twitter: coinInfo.twitter,
      },
    ];

    try {
      const estimatedGasLimit = await tokenPool?.estimator.gasLimitOf(
        "createClub",
        [...args, { value: requiredEthBN || BigNumber.from(0) }]
      );

      const res = await createNewToken({
        args: args,
        overrides: {
          value: requiredEthBN || BigNumber.from(0),
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });
    } catch (error) {
      console.log("Coin creation error: ", error);
    }

    // after tx new token created event the page is redirected to token page
    // by socket client
  };

  // action: change initial buy percent
  const onChangeInitialBuyPercent = (value: any) => {
    if (isLoading) return;
    if (value !== initialBuyPercent) {
      setInitialBuyPercent(value);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_NEWS_ROOM_TOKEN_CREATED, (message: any) => {
      const { creator, address } = message;
      console.log("NEW Token created:", message);
      if (creator && creator.toLowerCase() === account?.toLowerCase()) {
        router.push(`/token/${address}`);
      }
    });

    return () => {
      socket.off(SOCKET_NEWS_ROOM_TOKEN_CREATED);
    };
  }, [socket]);

  useEffect(() => {
    const loadModel = async () => {
      const tf = await import("@tensorflow/tfjs");
      await tf.setBackend("cpu");
      await tf.env().set("DEBUG", false);
    };

    loadModel();
  }, []);

  return (
    <>
      {isNsfwAlertModalOpen && (
        <NsfwAlertModal
          isOpen={isNsfwAlertModalOpen}
          onOpenChange={onToggleNsfwAlertModal}
        />
      )}
      <div className="flex flex-col gap-4">
        {/* title */}
        <div>
          <div className="text-xl font-normal text-white text-center">
            start a new coin
          </div>
        </div>
        {/* inputs */}
        <div className="flex flex-col gap-2">
          <Input
            name="name"
            value={coinInfo.name}
            type="text"
            label=""
            placeholder="Contrary"
            isDisabled={isLoading}
            onChange={onChangeInput}
            className="border-none !bg-light_blue"
            classNames={{
              inputWrapper: "!bg-light_blue",
              input: "!text-black",
            }}
            startContent={<div className="text-base text-black">name:</div>}
          />
          <Input
            name="symbol"
            value={coinInfo.symbol}
            type="text"
            label=""
            placeholder="Belief"
            isDisabled={isLoading}
            onChange={onChangeInput}
            className="border-none !bg-light_blue text-base"
            classNames={{
              inputWrapper: "!bg-light_blue",
              input: "!text-black",
            }}
            startContent={<div className="text-base text-black">symbol:</div>}
          />
          <Input
            name="description"
            value={coinInfo.description}
            type="text"
            label=""
            placeholder="Lorem Ipsum"
            isDisabled={isLoading}
            onChange={onChangeInput}
            className="border-none !bg-light_blue text-base"
            classNames={{
              inputWrapper: "!bg-light_blue",
              input: "!text-black",
            }}
            startContent={
              <div className="text-base text-black">description:</div>
            }
          />
          <div
            className={`flex items-center bg-light_blue gap-1 px-3 py-2 ${
              isLoading ? "!opacity-50" : ""
            }`}
          >
            <div className="text-black">{`Image: `}</div>
            <div className="grow">
              <ImageDropzoneInput
                disabled={isLoading}
                onSelect={onChangeImage}
              />
            </div>
          </div>
        </div>
        {/* action */}
        <div>
          <div className="mt-4 mb-4">
            <div
              className="flex gap-1 ml-4 font-normal items-center cursor-pointer"
              onClick={onToggleShowMoreOptions}
            >
              <span>{isShowMoreOptions ? "hide" : "show"} more options</span>
              <BsArrowDown />
            </div>
          </div>
          {isShowMoreOptions && (
            <div className="flex flex-col gap-2">
              <Input
                name="telegram"
                value={coinInfo.telegram}
                type="text"
                label=""
                placeholder="(optional)"
                isDisabled={isLoading}
                onChange={onChangeInput}
                className="border-none !bg-light_blue text-base"
                classNames={{
                  inputWrapper: "!bg-light_blue",
                  input: "!text-black",
                }}
                startContent={
                  <div className="text-base text-black">telegram:</div>
                }
              />
              <Input
                name="website"
                value={coinInfo.website}
                type="text"
                label=""
                placeholder="(optional)"
                isDisabled={isLoading}
                onChange={onChangeInput}
                className="border-none !bg-light_blue text-base"
                classNames={{
                  inputWrapper: "!bg-light_blue",
                  input: "!text-black",
                }}
                startContent={
                  <div className="text-base text-black">website:</div>
                }
              />
              <Input
                name="twitter"
                value={coinInfo.twitter}
                type="text"
                label=""
                placeholder="(optional)"
                isDisabled={isLoading}
                onChange={onChangeInput}
                className="border-none !bg-light_blue text-base"
                classNames={{
                  inputWrapper: "!bg-light_blue",
                  input: "!text-black",
                }}
                startContent={
                  <div className="text-base text-black">twitter(x):</div>
                }
              />
            </div>
          )}
          {/* token initial buy percent */}
          <div className="mt-8 mb-12">
            <Slider
              aria-label="initial-buy-percent"
              className="max-w-md"
              value={initialBuyPercent}
              size="sm"
              minValue={0}
              maxValue={5}
              isDisabled={isLoading}
              step={1}
              label={`Initial buy percent of total supply`}
              renderValue={({ children, ...props }) => (
                <div>{`${initialBuyPercent}%`}</div>
              )}
              renderThumb={(props) => (
                <div
                  {...props}
                  className="group p-1 top-1/2 bg-red1 border-default-200 rounded-full"
                >
                  <span className="transition-transform bg-red shadow-small rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
                </div>
              )}
              classNames={{
                base: "h-[10px]",
                track: "!bg-card_bg h-[10px] !border-0",
                filler: "bg-bg_green border-bg_green rounded-full",
                thumb: "bg-white",
              }}
              onChange={onChangeInitialBuyPercent}
            />
          </div>

          {/* deploy cost */}
          {requiredEth > 0 && (
            <div className="flex flex-col gap-0 mt-4">
              {/* initial buy */}
              <div className="">
                <div className="text-blue-500 text-base text-normal text-center">
                  {`(initial buy): ${requiredMoreEth.toFixed(2)}`}
                </div>
              </div>

              {/* token creation */}
              <div className="">
                <div className="text-blue-500 text-base text-normal text-center">
                  {`(token creation): ${deployCost.toFixed(2)}`}
                </div>
              </div>

              {/* total */}
              <div className="">
                <div className="text-blue-500 text-lg font-semibold text-center">
                  {`total cost: ${requiredEth.toFixed(2)}`}
                </div>
              </div>
            </div>
          )}

          {/* buy button */}
          <div className="m-auto flex items-end justify-center">
            <div>
              <Button
                className={`!px-8 !font-normal !h-[40px] !bg-red text-lg cursor-pointer ${
                  canCreateCoin ? "" : "!opacity-50"
                }`}
                onClick={onCreateCoin}
                isDisabled={!canCreateCoin}
                isLoading={isLoading}
                spinnerPlacement="end"
              >
                PUMP ME
              </Button>
            </div>

            <div className="-ml-[24px] z-10 flex flex-col items-center justify-center">
              <div className="-mb-[5px] z-20">
                <NextImage
                  width={30}
                  height={24}
                  alt="crown"
                  src={icons.crown}
                />
              </div>
              <div>
                <NextImage
                  width={40}
                  height={40}
                  alt="red-chip"
                  src={images.redChip}
                />
              </div>
            </div>
          </div>

          {/* not enough fee */}
          {!hasEnoughEth && (
            <div className="mt-2">
              <div className="text-red text-base text-normal text-center">
                {`unsufficient PLS balance`}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
