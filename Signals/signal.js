const getPercentage = require("../Utils/getPercentage");

async function getSignal(kumo, price) {
  try {
    const updatedPrice = parseFloat(parseFloat(price).toFixed(2));
    const farFromKijun =
      getPercentage(kumo.kijun, updatedPrice) > process.env.TOLERANCE;

    const bullish =
      kumo.tenkan > kumo.kijun &&
      kumo.spanAFuture > kumo.spanBFuture &&
      kumo.price > kumo.spanAPast &&
      kumo.price > kumo.spanBPast &&
      kumo.chikou === "BULL";

    const bearish =
      kumo.tenkan < kumo.kijun &&
      kumo.price < kumo.spanBPast &&
      kumo.price < kumo.spanAPast &&
      kumo.chikou === "BEAR";

    const close = updatedPrice <= kumo.stop;

    return {
      buy: bullish && !farFromKijun && !close,
      close: close,
      sell: bearish,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = getSignal;
