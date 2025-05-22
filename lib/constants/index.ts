export * from "./backend";

export const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
export const THIRDWEB_SECRET_KEY = process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY;

export const socials = [
  { name: "twitter", label: "twitter", key: "twitter" },
  { name: "telegram", label: "telegram", key: "telegram" },
  { name: "discord", label: "discord", key: "discord" },
];

export const headerItems = [
  {
    key: "telegram",
    value: "telegram",
    text: "telegram",
    link: "https://google.com",
  },
  {
    key: "twitter",
    value: "twitter",
    text: "twitter",
    link: "https://google.com",
  },
  {
    key: "support",
    value: "support",
    text: "support",
    link: "https://google.com",
  },
  {
    key: "how it works",
    value: "how it works",
    text: "how it works",
    link: "https://google.com",
  },
];
