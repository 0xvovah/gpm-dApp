/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from "next/server";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #010101, #0e0e0e, #000000)",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0px",
        }}
      >
        <img src="/iamges/logo.png" width={300} alt="Logo" tw="my-6" />

        <br />
        <h2 tw="mt-2 text-2xl text-default-600 block max-w-[60%] !w-full text-center">
          Gopumpme is a hub of memecoin launchpad.
        </h2>
      </div>
    ),
    {
      ...size,
    }
  );
}
