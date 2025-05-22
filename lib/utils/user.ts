import { getTokenPoolAddress } from "@/lib/utils/addressHelper";

export const getUserInfo = (address: string | undefined) => {
  return {
    name: "IAIAIA",
    balance: 0.457,
    address: "0x000",
    followers: 1,
    followings: 10,
    bio: "Degen / memecoin expert",
    likeReceived: 5,
    mentionReceived: 10,
  };
};

export const getUserName = (address: string | undefined) => {
  if (address) {
    if (address.toLowerCase() === getTokenPoolAddress().toLowerCase()) {
      return "Bonding Curve";
    }
    return address.substring(5);
  }

  return "";
};
