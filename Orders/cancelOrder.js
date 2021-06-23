const privateCall = require("../Rest/api");

async function cancelOrder(symbol, timestamp = Date.now()) {
  //const timestamp = Date.now();
  try {
    const data = { symbol, timestamp };

    return privateCall("/v1/allOpenOrders", data, "DELETE");
    // return privateCall("/v3/allOpenOrders", data, "DELETE");
  } catch (error) {
    console.log(error);
  }
}

module.exports = cancelOrder;
