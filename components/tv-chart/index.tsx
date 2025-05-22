import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  widget,
} from "@/public/static/charting_library";
import DataFeed from "./dataFeed/dataFeed";
import { apolloClient } from "@/app/providers";
import { candlesQuery, dexCandlesQuery } from "@/lib/ponder/query";
import { CHAIN_ID } from "@/lib/constants/network";

const defaultWidgetOptions: Partial<ChartingLibraryWidgetOptions> = {
  symbol: "",
  theme: "Dark",
  timezone: "Etc/UTC",
  interval: "1" as ResolutionString,
  library_path: "/static/charting_library/",
  locale: "en",
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
};

export const TVChartContainer = ({
  symbol,
  dexChartShown,
  dexPair,
}: {
  symbol: string;
  dexChartShown: boolean;
  dexPair?: string;
}) => {
  const params = useParams();
  const tokenAddress = params.slug ? params.slug[0] : "";

  const fetchCandles = async ({ from, to }: { from: number; to: number }) => {
    if (dexChartShown) {
      let variables: any = {
        tokenAddress: tokenAddress,
        dexPair: dexPair,
        chainId: CHAIN_ID,
      };
      if (from >= 0) {
        variables = {
          ...variables,
          from: from,
        };
      }
      if (to > 0) {
        variables = {
          ...variables,
          to: to,
        };
      }

      const res = await apolloClient.query({
        query: dexCandlesQuery,
        variables: variables,
      });

      const { dexCandles } = res.data;
      return dexCandles.items.map((row: any) => {
        return {
          close: row.close,
          high: row.high,
          low: row.low,
          open: row.open,
          time: row.timestamp,
          token: row.token,
        };
      });
    } else {
      let variables: any = {
        tokenAddress: tokenAddress,
        chainId: CHAIN_ID,
      };
      if (from >= 0) {
        variables = {
          ...variables,
          from: from,
        };
      }
      if (to > 0) {
        variables = {
          ...variables,
          to: to,
        };
      }

      const res = await apolloClient.query({
        query: candlesQuery,
        variables: variables,
      });

      const { candles } = res.data;
      return candles.items.map((row: any) => {
        return {
          close: row.close,
          high: row.high,
          low: row.low,
          open: row.open,
          time: row.timestamp,
          token: row.token,
        };
      });
    }
  };

  const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: symbol,
      theme: defaultWidgetOptions.theme,
      datafeed: new DataFeed({ fetchCandles, tokenAddress }),
      timezone: defaultWidgetOptions.timezone,
      interval: defaultWidgetOptions.interval as ResolutionString,
      container: chartContainerRef.current,
      library_path: defaultWidgetOptions.library_path,
      locale: defaultWidgetOptions.locale as LanguageCode,
      disabled_features: ["use_localstorage_for_settings", "popup_hints"],
      charts_storage_url: defaultWidgetOptions.charts_storage_url,
      charts_storage_api_version:
        defaultWidgetOptions.charts_storage_api_version,
      client_id: defaultWidgetOptions.client_id,
      user_id: defaultWidgetOptions.user_id,
      fullscreen: defaultWidgetOptions.fullscreen,
      autosize: defaultWidgetOptions.autosize,
      overrides: {
        volumePaneSize: "tiny", // Reduces the volume pane size
        "mainSeriesProperties.showVolume": false, // Completely hide volume
      },
      studies_overrides: {
        volumePaneSize: "tiny",
      },
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {});
    });

    return () => {
      tvWidget.remove();
    };
  }, [symbol, dexChartShown]);

  return (
    <>
      {/* <header className={styles.VersionHeader}>
          <h1>TradingView Charting Library and Next.js Integration Example</h1>
        </header> */}
      <div ref={chartContainerRef} className="h-[400px] w-full" />
    </>
  );
};
