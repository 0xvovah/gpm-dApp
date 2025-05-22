import { createPublicClient, http } from "viem";
import { mainnet, base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

export const multicall = async (calls: any[]) => {
  const results = await client.multicall({
    contracts: calls,
    allowFailure: true,
  });
  return results;
};

const ethereumClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const ethereumMulticall = async (calls: any[]) => {
  const results = await ethereumClient.multicall({
    contracts: calls,
    allowFailure: true,
  });
  return results;
};
