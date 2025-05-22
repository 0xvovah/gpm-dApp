import { Manrope, Poppins } from "next/font/google";
import type { Metadata } from "next";

import { Providers } from "./providers";
import "./global.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${manrope.variable} ${poppins.variable} font-poppins bg-bg`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gopump.me/"),
  title: {
    default: "gopump",
    template: `https://www.gopump.me/`,
  },
  description: "Gopumpme is a hub of memecoin launchpad.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: { url: "/favicon.ico" },
  },
  openGraph: {
    title: "gopump",
    description: "Gopumpme is a hub of memecoin launchpad.",
    images: [
      {
        url: "https://www.gopump.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "gopump.me",
      },
    ],
  },
  twitter: {
    title: "Gopump",
    description: "Gopumpme is a hub of memecoin launchpad.",
    images: [
      {
        url: "https://www.gopump.me/opengraph-image",
        width: 1200,
        height: 630,
        alt: "gopump.me",
      },
    ],
  },
};
