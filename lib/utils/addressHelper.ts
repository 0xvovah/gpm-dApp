import addresses from "@/lib/constants/contract";
import { Address } from "@/lib/types";
import { CHAIN_ID } from "@/lib/constants/network";

export const getAddress = (address: Address): `0x${string}` => {
  return (address as any)[CHAIN_ID];
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multicall);
};

export const getEthAddress = () => {
  return getAddress(addresses.eth);
};

export const getWethAddress = () => {
  return getAddress(addresses.weth);
};

export const getTokenPoolAddress = () => {
  return getAddress(addresses.tokenPool);
};

export const getPulseXRouterAddress = () => {
  return getAddress(addresses.pulseXRouter);
};

/**
 * Shortens an Ethereum address to the format: 0x123...4567
 * @param address - The Ethereum address to shorten
 * @param chars - Number of characters to show at the start and end
 * @returns The shortened address
 */
export const shortenAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < chars * 2) {
    throw new Error("Invalid address");
  }

  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};
