export const getTokenDecimal = (name: string) => {
  if (name.toLowerCase() === "usdc") return 6;
  if (name.toLowerCase() === "usdt") return 6;
  return 18;
};

export const getTokenLogo = (logoUrl: string) => {
  if (!logoUrl || logoUrl === "") {
    const randomId = Math.floor((Math.random() * 100) % 7) + 1;
    return `/images/image_temp${randomId}.svg`;
  }
  return logoUrl;
};
