"use client";
import { useState } from "react";
import { Input, Button, Image, Tabs, Tab } from "@nextui-org/react";
import { useParams } from "next/navigation";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useBalance,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";

import {
  getTokenPoolAddress,
  getPulseXRouterAddress,
  getWethAddress,
  currentTime,
} from "@/lib/utils";
import abis from "@/lib/abi";
import { NATIVE_TOKEN_LOGO } from "@/lib/constants/network";

const tokenPoolAddress = getTokenPoolAddress();
const routerAddress = getPulseXRouterAddress();
const wPLSAddress = getWethAddress();

const percentageOptions = [
  { key: 25, text: "25%" },
  { key: 50, text: "50%" },
  { key: 75, text: "75%" },
  { key: 100, text: "max" },
];

export default function TokenTradForm({
  tokenInfo,
  refetchData,
}: {
  tokenInfo: any;
  refetchData: () => void;
}) {
  const [tradeType, setTradeType] = useState("buy");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountInWei, setAmountInWei] = useState(BigNumber.from(0));

  const address = useAddress();
  const account = address || ethers.constants.AddressZero;

  const params = useParams();
  const tokenAddress = params.slug ? params.slug[0] : "";

  // trade on gopumpme
  const { data: userNativeTokenBalInfo, refetch: userNativeTokenBalRefetch } =
    useBalance();
  const { data: userTokenBalInfo, refetch: userTokenBalRefetch } =
    useBalance(tokenAddress);

  const { contract: tokenPool } = useContract(tokenPoolAddress, abis.tokenPool);
  const { contract: tokenContract } = useContract(tokenAddress, abis.erc20);
  const { data: tokenAllowance, refetch: tokenAllowanceRefetch } =
    useContractRead(tokenContract, "allowance", [account, tokenPoolAddress]);
  const { data: purchaseAmountInWei } = useContractRead(
    tokenPool,
    "calculatePurchaseReturn",
    [tokenAddress, amountInWei.mul(99).div(100)]
  );
  const { data: saleReturnAmountInWei } = useContractRead(
    tokenPool,
    "calculateSaleReturn",
    [tokenAddress, amountInWei.mul(99).div(100)]
  );

  const plsPrice = 0.00005;
  const purchaseAmount = ethers.utils.formatEther(purchaseAmountInWei || "0");
  const saleReturnAmount = ethers.utils.formatEther(
    saleReturnAmountInWei || "0"
  );

  const { mutateAsync: approve } = useContractWrite(tokenContract, "approve");
  const { mutateAsync: buyToken } = useContractWrite(tokenPool, "buyTokens");
  const { mutateAsync: sellToken } = useContractWrite(tokenPool, "sellTokens");

  // trade on pulseX
  const { contract: swapRouter } = useContract(routerAddress, abis.uniRouter);
  const { data: tokenAllowanceRouter, refetch: tokenAllowanceRouterRefetch } =
    useContractRead(tokenContract, "allowance", [account, routerAddress]);

  const { mutateAsync: buyTokenOnDex } = useContractWrite(
    swapRouter,
    "swapExactETHForTokens"
  );
  const { mutateAsync: sellTokenOnDex } = useContractWrite(
    swapRouter,
    "swapExactTokensForETH"
  );

  const dexPair = tokenInfo.dexPair;
  const isBuy = tradeType === "buy";
  const userNativeTokenBalance =
    userNativeTokenBalInfo?.value || BigNumber.from(0);
  const userTokenBalance = userTokenBalInfo?.value || BigNumber.from(0);

  const isValidAmount = Number(amount) > 0;
  const canTradeCoin = isValidAmount && !isLoading;
  const isTokenApproved = dexPair
    ? tokenAllowanceRouter &&
      amountInWei.gt(BigNumber.from(0)) &&
      tokenAllowanceRouter.gte(amountInWei)
    : tokenAllowance &&
      amountInWei.gt(BigNumber.from(0)) &&
      tokenAllowance.gte(amountInWei);

  // action: trade type change action
  const onChangeTradeType = (type: string) => {
    if (isLoading) return;
    if (type !== tradeType) {
      setTradeType(type);
      setAmount("0");
      setAmountInWei(BigNumber.from(0));
    }
  };

  // action: amount change of buy/sell action
  const onChangeAmount = (value: any) => {
    setAmount(value);
    setAmountInWei(ethers.utils.parseEther(Number(value).toFixed(18)));
  };

  // action: percentage change of buy/sell action
  const onChangePercentage = (percent: any) => {
    if (isBuy) {
      setAmount(
        ethers.utils.formatEther(userNativeTokenBalance.mul(percent).div(100))
      );
      setAmountInWei(userNativeTokenBalance.mul(percent).div(100));
    } else {
      setAmount(
        ethers.utils.formatEther(userTokenBalance.mul(percent).div(100))
      );
      setAmountInWei(userTokenBalance.mul(percent).div(100));
    }
  };

  // "buy" action on bonding curve
  const handleBuyTokenOnBC = async () => {
    const args: any[] = [tokenAddress];
    const estimatedGasLimit = await tokenPool?.estimator.gasLimitOf(
      "buyTokens",
      [...args, { value: amountInWei }]
    );

    try {
      await buyToken({
        args: args,
        overrides: {
          value: amountInWei || BigNumber.from(0),
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });

      await userNativeTokenBalRefetch();
      await userTokenBalRefetch();
      await refetchData();
    } catch (error) {
      console.log("Buy token on Bonding Curve Error: ", error);
    }
  };

  // "buy" action on PulseX
  const handleBuyTokenOnDex = async () => {
    const args: any[] = [
      0,
      [wPLSAddress, tokenAddress],
      account,
      currentTime() + 3600 * 5,
    ];
    const estimatedGasLimit = await swapRouter?.estimator.gasLimitOf(
      "swapExactETHForTokens",
      [...args, { value: amountInWei }]
    );

    try {
      await buyTokenOnDex({
        args: args,
        overrides: {
          value: amountInWei || BigNumber.from(0),
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });

      await userNativeTokenBalRefetch();
      await userTokenBalRefetch();
      await refetchData();
    } catch (error) {
      console.log("Buy token on PulseX Error: ", error);
    }
  };

  // "sell" action on bonding curve
  const handleSellTokenOnBC = async () => {
    const args: any[] = [tokenAddress, amountInWei];
    const estimatedGasLimit = await tokenPool?.estimator.gasLimitOf(
      "sellTokens",
      [...args]
    );

    try {
      await sellToken({
        args: args,
        overrides: {
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });

      await userNativeTokenBalRefetch();
      await userTokenBalRefetch();
      await refetchData();
    } catch (error) {
      console.log("Sell token on Bonding Curve Error: ", error);
    }
  };

  // "sell" action on dex
  const handleSellTokenOnDex = async () => {
    const args: any[] = [
      amountInWei,
      0,
      [tokenAddress, wPLSAddress],
      account,
      currentTime() + 3600 * 5,
    ];
    const estimatedGasLimit = await swapRouter?.estimator.gasLimitOf(
      "swapExactTokensForETH",
      [...args]
    );

    try {
      await sellTokenOnDex({
        args: args,
        overrides: {
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });

      await userNativeTokenBalRefetch();
      await userTokenBalRefetch();
      await refetchData();
    } catch (error) {
      console.log("Sell token on Dex Error: ", error);
    }
  };

  // approve sell token
  const handleApproveToken = async (spenderAddress: string) => {
    if (isTokenApproved) return;

    const args = [
      spenderAddress, // address of spender
      amountInWei, // amount to approve
    ];
    const estimatedGasLimit = await tokenContract?.estimator.gasLimitOf(
      "approve",
      args
    );

    try {
      await approve({
        args: args,
        overrides: {
          gasLimit: BigNumber.from(estimatedGasLimit)?.mul(120).div(100),
          gasPrice: BigNumber.from(5e15),
        },
      });
    } catch (error) {
      console.log("Approve token Error: ", error);
    }
  };

  // action: buy or sell token
  const onTradeCoin = async () => {
    if (dexPair) {
      handleTradeCoinOnDex();
    } else {
      handleTradeCoinOnBondingCurve();
    }
  };

  // action: buy or sell token on dex
  const handleTradeCoinOnDex = async () => {
    if (!address || !canTradeCoin) return;

    setIsLoading(true);

    try {
      if (isBuy) {
        await handleBuyTokenOnDex();
      } else {
        if (isTokenApproved) {
          await handleSellTokenOnDex();
        } else {
          await handleApproveToken(routerAddress);
        }
      }

      setIsLoading(false);
    } catch (_) {
      setIsLoading(false);
    }
  };

  // action: buy or sell token on bonding curve
  const handleTradeCoinOnBondingCurve = async () => {
    if (!address || !canTradeCoin) return;

    setIsLoading(true);

    try {
      if (isBuy) {
        await handleBuyTokenOnBC();
      } else {
        if (isTokenApproved) {
          await handleSellTokenOnBC();
        } else {
          await handleApproveToken(tokenPoolAddress);
        }
      }

      setIsLoading(false);
    } catch (_) {
      setIsLoading(false);
    }
  };
  // get action button text
  const getButtonText = () => {
    if (isBuy) {
      return "place bet";
    } else {
      return isTokenApproved ? "sell" : "approve";
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-black px-3 py-4 md:py-10 md:px-8 border-none rounded-lg">
      <Tabs
        selectedKey={tradeType}
        aria-label="Options"
        classNames={{
          base: "w-full",
          tabList: "w-full p-0 bg-card_bg",
          cursor: "!bg-transparent",
        }}
        onSelectionChange={(key) => onChangeTradeType(key as string)}
      >
        <Tab
          key="buy"
          title={
            <span className={`${isBuy ? "text-black" : "text-white"}`}>
              buy
            </span>
          }
          className={isBuy ? "bg-bg_green" : ""}
        />
        <Tab
          key="sell"
          title={
            <span className={`${!isBuy ? "text-black" : "text-white"}`}>
              sell
            </span>
          }
          className={!isBuy ? "bg-bg_yellow" : ""}
        />
      </Tabs>
      <div className="flex flex-col gap-4">
        <div>
          <Input
            name="amount"
            type="number"
            label=""
            value={amount}
            isDisabled={isLoading}
            placeholder="0.0"
            onChange={(e) => onChangeAmount(e.target.value)}
            className="!bg-card_bg rounded-lg"
            classNames={{
              inputWrapper: "!bg-card_bg",
              input: "!text-white",
            }}
            endContent={
              <div className="relative m-auto bg-white rounded-full">
                <Image
                  width={0}
                  height={0}
                  alt="logo"
                  src={isBuy ? NATIVE_TOKEN_LOGO : tokenInfo.logo}
                  classNames={{
                    img: "w-[20px] h-[20px] md:w-[20px] md:h-[20px] rounded-full",
                    wrapper: "w-[20px] h-[20px] md:w-[20px] md:h-[20px]",
                  }}
                />
              </div>
            }
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {percentageOptions.map((option) => (
            <Button
              key={option.key}
              isDisabled={isLoading}
              className="grid bg-white text-black rounded-lg h-[32px] min-w-[auto] font-semibold"
              onClick={() => onChangePercentage(option.key)}
            >
              {option.text}
            </Button>
          ))}
        </div>
        {isBuy ? (
          <div>
            <div className="flex gap-1">
              <span>PLS in USD:</span>
              <span>
                {`$${Number(
                  (plsPrice * Number(amount)).toFixed(2)
                ).toLocaleString()}`}
              </span>
            </div>
            <div className="flex gap-1">
              <span>Token output:</span>
              <span>
                {Number(Number(purchaseAmount).toFixed(2)).toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-1">
              <span>PLS input:</span>
              <span>
                {Number(Number(saleReturnAmount).toFixed(2)).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="0">
        <Button
          className={`p-2 text-center rounded-lg bg-bg_primary font-semibold text-white disabled:pointer-events-none disabled:opacity-50 w-full  ${
            canTradeCoin ? "" : "!opacity-50"
          } ${isBuy ? "bg-bg_green text-black" : "bg-bg_yellow text-black"}`}
          isDisabled={!canTradeCoin}
          isLoading={isLoading}
          onClick={onTradeCoin}
          spinnerPlacement="end"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}
