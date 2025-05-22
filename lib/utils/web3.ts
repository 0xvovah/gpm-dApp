import { createPublicClient, http } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const sepoliaClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const walletClient =
  process.env.NEXT_PUBLIC_CHAIN_ID === "1" ? ethereumClient : sepoliaClient;
