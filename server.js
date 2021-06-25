const binance = require("binance");
const getHistory = require("./Rest/getHistory");
const getIchimoku = require("./Signals/ichimoku");
const getSignal = require("./Signals/signal");
const getPercentage = require("./Utils/getPercentage");

const symbol = process.env.SYMBOL;
const interval = process.env.INTERVAL;
const crawlerInterval = process.env.CRAWLER_INTERVAL;

const binanceWS = new binance.BinanceWS(true);

let historyClose;
let historyHigh;
let historyLow;
let start = false;
let openOrder = false;

//test
let balance = 100;
let orderCash = 0;
let order = 0;
let buyPrice = 0;
//
console.log("Scanning market...");

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

// setInterval(() => {
//   console.log(`balance: ${balance}`);
// }, 3600000);

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

    const buy = signal.buy;
    const close = signal.close;

    if (buy && !openOrder) {
      // new order
      orderCash = balance * 0.15;
      const fee = orderCash * 0.001;
      balance = balance - orderCash - fee;
      order = orderCash / updatedPrice;
      buyPrice = updatedPrice;
      console.log(`-Bought ${order.toFixed(8)} at $${buyPrice} BTC`);

      // Stop order on kijun
      // ...

      openOrder = true;
    }
    if (close && openOrder) {
      // close order
      const orderValue = updatedPrice * order;
      const fee = orderValue * 0.001;
      balance = parseFloat(balance + orderValue - fee).toFixed(2);
      portfolioChange =
        getPercentage(100, balance) > 0
          ? `+${getPercentage(100, balance)}%`
          : `${getPercentage(100, balance)}%`;

      console.log(
        `Portfolio change ${portfolioChange}% || Balance: $${balance}`
      );

      openOrder = false;
    }
  }
});
