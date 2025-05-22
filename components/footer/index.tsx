"use client";

import NextLink from "next/link";

export default function Footer() {
  return (
    <div className="py-6 mt-auto md:py-8 w-full">
      <div className="flex gap-8 flex-wrap flex-col justify-center items-center md:justify-between md:flex-row md:gap-4">
        <p className="text-value_grey text-center">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply
        </p>
        <div className="flex gap-4">
          <NextLink
            className="text-value_grey text-base font-normal underline"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://t.me/gopumpme_official`}
          >
            telegram
          </NextLink>
          <NextLink
            className="text-value_grey text-base font-normal underline"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://x.com/Gopumpme`}
          >
            twitter
          </NextLink>
          <NextLink
            className="text-value_grey text-base font-normal underline"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://t.me/gopumpme_official`}
          >
            support
          </NextLink>
        </div>
      </div>
    </div>
  );
}
