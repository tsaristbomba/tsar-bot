const privateCall = require("../Rest/api");

async function newOrder(
  symbol,
  quantity,
  side = "BUY",
  price,
  type = "MARKET"
) {
  try {
    const data = { symbol, side, type, quantity };

    // if (side === "SELL") {
    //   delete data.quoteOrderQty;
    //   data.quantity = quoteOrderQty;
    // }
    //if (price) data.price = price;
    if (type === "STOP_MARKET") {
      //   delete data.quoteOrderQty;
      data.stopPrice = price;
      //   data.quantity = quoteOrderQty;
    }
    if (type === "LIMIT") data.timeInForce = "GTC";

    return privateCall("/v1/order", data, "POST");
    // return privateCall("/v3/order", data, "POST");
  } catch (error) {
    console.log(error);
  }
}

module.exports = newOrder;
