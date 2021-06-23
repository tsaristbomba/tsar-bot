const binance = require("binance");
// const api = require("./Rest/api");
const getHistory = require("./Rest/getHistory");
const getIchimoku = require("./Signals/ichimoku");
const getSignal = require("./Signals/signal");

const symbol = process.env.SYMBOL;
const interval = process.env.INTERVAL;
const crawlerInterval = process.env.CRAWLER_INTERVAL;

const binanceWS = new binance.BinanceWS(true);

let historyClose;
let historyHigh;
let historyLow;
let start = false;

const getHistoricData = async () => {
  const historicalData = await getHistory();

  historyClose = historicalData.close;
  historyHigh = historicalData.high;
  historyLow = historicalData.low;
};
setInterval(async () => {
  await getHistoricData();

  start = true;
}, crawlerInterval);

binanceWS.onKline(symbol, interval, async (data) => {
  if (start) {
    const updatedPrice = data.kline.close;
    const historicData = {
      close: historyClose,
      high: historyHigh,
      low: historyLow,
    };

    const ichimoku = await getIchimoku(historicData, 20, 60, 160);
    const signal = await getSignal(ichimoku, updatedPrice);

    console.log(signal);
    console.log(updatedPrice);
  }
});

/*
 * WebSocket API
 *
 * Each call to onXXXX initiates a new websocket for the specified route, and calls your callback with
 * the payload of each message received.  Each call to onXXXX returns the instance of the websocket
 * client if you want direct access(https://www.npmjs.com/package/ws).
 */
// const binanceWS = new api.BinanceWS(true); // Argument specifies whether the responses should be beautified, defaults to true

// binanceWS.onDepthUpdate("BNBBTC", (data) => {
//   console.log(data);
// });

// binanceWS.onAggTrade("BNBBTC", (data) => {
//   console.log(data);
// });

// binanceWS.onKline("BNBBTC", "1m", (data) => {
//   console.log(data);
// });

// /*
//  * You can use one websocket for multiple streams.  There are also helpers for the stream names, but the
//  * documentation has all of the stream names should you want to specify them explicitly.
//  */
// const streams = binanceWS.streams;

// binanceWS.onCombinedStream(
//   [
//     streams.depth("BNBBTC"),
//     streams.kline("BNBBTC", "5m"),
//     streams.trade("BNBBTC"),
//     streams.ticker("BNBBTC"),
//   ],
//   (streamEvent) => {
//     switch (streamEvent.stream) {
//       case streams.depth("BNBBTC"):
//         console.log("Depth event, update order book\n", streamEvent.data);
//         break;
//       case streams.kline("BNBBTC", "5m"):
//         console.log(
//           "Kline event, update 5m candle display\n",
//           streamEvent.data
//         );
//         break;
//       case streams.trade("BNBBTC"):
//         console.log("Trade event, update trade history\n", streamEvent.data);
//         break;
//       case streams.ticker("BNBBTC"):
//         console.log("Ticker event, update market stats\n", streamEvent.data);
//         break;
//     }
//   }
// );

// /*
//  * onUserData requires an instance of BinanceRest in order to make the necessary startUserDataStream and
//  * keepAliveUserDataStream calls.  The webSocket instance is returned by promise rather than directly
//  * due to needing to request a listenKey from the server first.
//  */
// binanceWS
//   .onUserData(
//     binanceRest,
//     (data) => {
//       console.log(data);
//     },
//     60000
//   ) // Optional, how often the keep alive should be sent in milliseconds
//   .then((ws) => {
//     // websocket instance available here
//   });
