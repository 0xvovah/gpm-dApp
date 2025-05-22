import { ethers } from "ethers";
import SocketClient from "./streaming";

const configurationData: TradingView.DatafeedConfiguration = {
  supported_resolutions: [
    "1",
    // "5",
    // "15",
    // "30",
    // "60",
  ] as TradingView.ResolutionString[],
};

export interface DataFeedOptions {
  SymbolInfo?: TradingView.LibrarySymbolInfo;
  DatafeedConfiguration?: TradingView.DatafeedConfiguration;
  getBars?: TradingView.IDatafeedChartApi["getBars"];
  fetchCandles: ({ from, to }: { from: number; to: number }) => Promise<any[]>;
  tokenAddress: string;
}

export default class DataFeed
  implements TradingView.IExternalDatafeed, TradingView.IDatafeedChartApi
{
  private options: DataFeedOptions;
  private lastBarsCache: Map<string, TradingView.Bar>;
  private socket!: SocketClient;

  constructor(options: DataFeedOptions) {
    this.options = options;
    this.lastBarsCache = new Map();
    if (!options) {
      this.options.DatafeedConfiguration = configurationData;
    }
  }
  public async onReady(callback: TradingView.OnReadyCallback) {
    console.log("[onReady]: Method call");
    setTimeout(() => callback(configurationData));
    this.socket = new SocketClient(this.options.tokenAddress);
  }

  public async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: TradingView.SearchSymbolsCallback
  ) {
    console.log("[searchSymbols]: Method call");
  }

  private async getAllSymbols() {
    return [];
  }

  public async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: TradingView.ResolveCallback,
    onResolveErrorCallback: TradingView.ErrorCallback,
    extension: TradingView.SymbolResolveExtension
  ) {
    const symbolItem = {
      symbol: symbolName,
      full_name: symbolName,
      description: symbolName,
      type: "crypto",
      exchange: "",
    };

    if (!symbolItem) {
      console.log("[resolveSymbol]: Cannot resolve symbol", symbolName);
      onResolveErrorCallback("Cannot resolve symbol");
      return;
    }
    // Symbol information object
    const symbolInfo: Partial<TradingView.LibrarySymbolInfo> = {
      ticker: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 1e10,
      has_intraday: true,
      has_daily: true,
      has_weekly_and_monthly: false,
      visible_plots_set: "ohlc",
      supported_resolutions: configurationData.supported_resolutions!,
      volume_precision: 2,
      data_status: "streaming",
    };
    console.log("[resolveSymbol]: Symbol resolved", symbolName);
    onSymbolResolvedCallback(symbolInfo as TradingView.LibrarySymbolInfo);
  }

  public async getBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    periodParams: TradingView.PeriodParams,
    onHistoryCallback: TradingView.HistoryCallback,
    onErrorCallback: TradingView.ErrorCallback
  ) {
    const { from, to, firstDataRequest, countBack } = periodParams;

    try {
      // const data = await this.options.fetchCandles({ from: 0, to });
      const data = await this.options.fetchCandles({ from: 1738650000, to });

      if (!data || data.length === 0) {
        onHistoryCallback([], { noData: true });
        return;
      }

      const bars: {
        time: number;
        low: any;
        high: any;
        open: any;
        close: any;
      }[] = data.reverse().map((bar: any) => {
        const { time, open, high, low, close } = bar;
        // const oldValue = time < 1738636200;
        const oldValue = false;

        if (oldValue) {
          return {
            time: parseInt(time) * 1000,
            open: (parseFloat(ethers.utils.formatEther(open)) * 4) / 25,
            high: (parseFloat(ethers.utils.formatEther(high)) * 4) / 25,
            low: (parseFloat(ethers.utils.formatEther(low)) * 4) / 25,
            close: (parseFloat(ethers.utils.formatEther(close)) * 4) / 25,
          };
        } else {
          return {
            time: parseInt(time) * 1000,
            open: parseFloat(ethers.utils.formatEther(open)),
            high: parseFloat(ethers.utils.formatEther(high)),
            low: parseFloat(ethers.utils.formatEther(low)),
            close: parseFloat(ethers.utils.formatEther(close)),
          };
        }
      });

      if (firstDataRequest) {
        this.lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log("[getBars]: Get error", error);
      onErrorCallback(error as string);
    }
  }

  public async subscribeBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    onRealtimeCallback: TradingView.SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) {
    console.log(
      "[subscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    this.socket.subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      this.lastBarsCache.get(symbolInfo.full_name)
    );
  }

  public async unsubscribeBars(subscriberUID: string) {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID
    );
    this.socket.unsubscribeFromStream(subscriberUID);
  }
}
