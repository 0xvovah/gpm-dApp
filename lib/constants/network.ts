import {
  Base,
  BaseSepoliaTestnet,
  Sepolia,
  Ethereum,
  Pulsechain,
  PulsechainTestnetV4,
} from "@thirdweb-dev/chains";

import { coins } from "./image";

export const BASE_MAINNET_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const ETHEREUM_SEPOLIA_CHAIN_ID = 11155111;
export const PULSE_MAINNET_CHAIN_ID = 369;
export const PULSE_TESTNET_CHAIN_ID = 943;
export const MAINNET_CHAIN_ID = PULSE_MAINNET_CHAIN_ID;

// get rpc url from chainId
export const getRpc = (chainId: Number) => {
  if (chainId === PULSE_MAINNET_CHAIN_ID) return `https://rpc.pulsechain.com`;
  if (chainId === PULSE_TESTNET_CHAIN_ID)
    return `https://rpc.v4.testnet.pulsechain.com`;
  if (chainId === BASE_MAINNET_CHAIN_ID) return `https://mainnet.base.org`;
  if (chainId === BASE_SEPOLIA_CHAIN_ID) return `https://sepolia.base.org`;
  if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID)
    return `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
};

// get explorer url from chainId
export const getExplorerUrl = (chainId: Number) => {
  if (chainId === PULSE_MAINNET_CHAIN_ID)
    return `https://pulsescan.finvesta.io/#`;
  if (chainId === PULSE_TESTNET_CHAIN_ID)
    return `https://scan.v4.testnet.pulsechain.com/#`;
  if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID)
    return `https://sepolia.etherscan.io`;
};

// get native token logo from chainId
export const getNativeTokenLogo = (chainId: Number) => {
  if (chainId === PULSE_MAINNET_CHAIN_ID) return coins.pls;
  if (chainId === PULSE_TESTNET_CHAIN_ID) return coins.pls;
  if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID) return coins.eth;
};

// get active chain
export const getActiveChain = (chainId: Number) => {
  if (chainId === PULSE_MAINNET_CHAIN_ID) return Pulsechain;
  if (chainId === PULSE_TESTNET_CHAIN_ID) return PulsechainTestnetV4;
  if (chainId === BASE_MAINNET_CHAIN_ID) return Base;
  if (chainId === BASE_SEPOLIA_CHAIN_ID) return BaseSepoliaTestnet;
  if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID) return Sepolia;

  return Ethereum;
};

// get supported chains
export const getSupportedChains = (chainId: Number) => {
  if (chainId === PULSE_MAINNET_CHAIN_ID) return [Pulsechain];
  if (chainId === PULSE_TESTNET_CHAIN_ID) return [PulsechainTestnetV4];
  if (chainId === BASE_MAINNET_CHAIN_ID) return [Base];
  if (chainId === BASE_SEPOLIA_CHAIN_ID) return [BaseSepoliaTestnet];
  if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID) return [Sepolia];
  return [Ethereum];
};

export const CHAIN_ID: number = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID || MAINNET_CHAIN_ID
);

export const RPC_URL = getRpc(CHAIN_ID);
export const EXPLORER_URL = getExplorerUrl(CHAIN_ID);
export const NATIVE_TOKEN_LOGO = getNativeTokenLogo(CHAIN_ID);
