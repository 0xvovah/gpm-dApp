import { io } from "socket.io-client";
import { ethers } from "ethers";

import {
  BACKEND_WS_SERVER_URL,
  SOCKET_TRADE_ROOM,
} from "@/lib/constants/backend";

export default class SocketClient {
  socket!: any;
  channelToSubscription!: Map<string, any>;
  tokenAddress: string;
  resolution: string;

  constructor(tokenAddress: string) {
    this.tokenAddress = tokenAddress;
    this.resolution = "1";
    console.log("[SocketClient] init");
    this._createSocket();
  }

  _createSocket() {
    this.socket = io(BACKEND_WS_SERVER_URL);
    this.channelToSubscription = new Map();

    this.socket.emit("joinRoom", {
      room: `${SOCKET_TRADE_ROOM}-${this.tokenAddress}`,
    });

    this.socket.on(
      `${SOCKET_TRADE_ROOM}-${this.tokenAddress}:update`,
      (data: any) => {
        const { tradePrice: tradePriceRaw, tradeTime } = data;

        const channelString = `${this.tokenAddress}_resolution_${this.resolution}`;
        const subscriptionItem = this.channelToSubscription.get(channelString);

        if (subscriptionItem === undefined) return;

        const { lastDailyBar } = subscriptionItem;
        if (lastDailyBar === undefined) return;

        const nextDailyBarTime = this.getNextDailyBarTime(
          lastDailyBar?.time || new Date().getTime(),
          this.resolution
        );
        const tradePrice = parseFloat(
          ethers.utils.formatEther(String(tradePriceRaw))
        );

        let bar: {
          time: number;
          open: number;
          high: number;
          low: number;
          close: number;
        };
        if (tradeTime * 1000 >= nextDailyBarTime) {
          bar = {
            time: nextDailyBarTime,
            open: lastDailyBar.close,
            high: tradePrice,
            low: tradePrice,
            close: tradePrice,
          };
          console.log("[socket] Generate new bar", bar);
        } else {
          bar = {
            ...lastDailyBar,
            high: Math.max(lastDailyBar.high, tradePrice),
            low: Math.min(lastDailyBar.low, tradePrice),
            close: tradePrice,
          };
        }

        subscriptionItem.lastDailyBar = bar;

        // Send data to every subscriber of that symbol
        subscriptionItem.handlers.forEach(
          (handler: { callback: (arg0: any) => any }) => handler.callback(bar)
        );
      }
    );
  }

  public subscribeOnStream(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    onRealtimeCallback: TradingView.SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
    lastDailyBar: TradingView.Bar | undefined
  ) {
    this.resolution = resolution;

    const handler = {
      id: subscriberUID,
      callback: onRealtimeCallback,
    };
    const channelString = `${this.tokenAddress}_resolution_${this.resolution}`;

    let subscriptionItem = this.channelToSubscription.get(channelString);
    if (subscriptionItem) {
      // Already subscribed to the channel, use the existing subscription
      subscriptionItem.handlers.push(handler);
      return;
    }
    subscriptionItem = {
      subscriberUID,
      resolution,
      lastDailyBar,
      handlers: [handler],
    };
    this.channelToSubscription.set(channelString, subscriptionItem);
    console.log(
      "[subscribeBars]: Subscribe to streaming. Channel:",
      channelString
    );

    this.socket.emit("SubAdd", [channelString]);
  }
  public unsubscribeFromStream(subscriberUID: string) {
    for (const channelString of Array.from(this.channelToSubscription.keys())) {
      const subscriptionItem = this.channelToSubscription.get(channelString);
      const handlerIndex = subscriptionItem.handlers.findIndex(
        (handler: { id: string }) => handler.id === subscriberUID
      );
      if (handlerIndex !== -1) {
        // Remove from handlers
        subscriptionItem.handlers.splice(handlerIndex, 1);
        if (subscriptionItem.handlers.length === 0) {
          // Unsubscribe from the channel if it is the last handler
          console.log(
            "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
            channelString
          );
          this.socket.emit("SubRemove", [channelString]);
          this.channelToSubscription.delete(channelString);
          break;
        }
      }
    }
  }

  private getNextDailyBarTime(barTime: number, resolution: string) {
    const date = new Date(barTime);
    date.setMinutes(date.getMinutes() + Number(resolution));
    return date.getTime();
  }
}
