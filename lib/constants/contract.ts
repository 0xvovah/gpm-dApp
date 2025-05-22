/**
 * Chain ID
 * 369: Pulse mainnet
 * 943: Pulse sepolia
 */

const contractAddresses = {
  multicall: {
    369: "0xcA11bde05977b3631167028862bE2a173976CA11",
    943: "0x25Eef291876194AeFAd0D60Dff89e268b90754Bb",
  },
  eth: {
    369: "0x0000000000000000000000000000000000000000",
    943: "0x0000000000000000000000000000000000000000",
  },
  weth: {
    369: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
    943: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
  },
  tokenPool: {
    369: "0x2a0D403815eb35D1e2658B806E5c27f72129FdFd", // pulsechain mainnet
    943: "0x87a39b5FAae6Ced02cFc1E788DBAAa1A4Ab9820B", // pulsechain testnet
  },
  pulseXRouter: {
    369: "0x165C3410fC91EF562C50559f7d2289fEbed552d9", // pulsechain mainnet
    943: "0x165C3410fC91EF562C50559f7d2289fEbed552d9", // pulsechain testnet
  },
};

export default contractAddresses;
