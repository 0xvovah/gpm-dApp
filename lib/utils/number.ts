import { BigNumber, ethers } from "ethers";

export function beautifyNumber(input: number | string): string {
  const num = typeof input === "string" ? parseFloat(input) : input;
  const absNum = Math.abs(num);

  if (absNum < 1e3) {
    return num.toString();
  } else if (absNum < 1e6) {
    return (num / 1e3).toFixed(2) + "K";
  } else if (absNum < 1e9) {
    return (num / 1e6).toFixed(2) + "M";
  } else if (absNum < 1e12) {
    return (num / 1e9).toFixed(2) + "B";
  } else {
    return (num / 1e12).toFixed(2) + "T";
  }
}

export const max = (a: number, b: number) => (a > b ? a : b);

export const min = (a: number, b: number) => (a < b ? a : b);

export const formatBalance = (value: BigNumber | string, decimal?: 18) => {
  const formated = ethers.utils.formatUnits(value, decimal);
  if (Number(formated) < 0.001) return "Less than 0.001";
  return Number(Number(formated).toFixed(4)).toLocaleString();
};
