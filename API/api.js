const axios = require("axios");
const querystring = require("querystring");
const crypto = require("crypto");

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl = process.env.API_URL;

async function privateCall(path, data = {}, method = "GET") {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${querystring.stringify({ ...data, timestamp })}`)
    .digest("hex");

  const newData = { ...data, timestamp, signature };
  const qs = `?${querystring.stringify(newData)}`;

  try {
    const result = await axios({
      method,
      url: `${apiUrl}${path}${qs}`,
      headers: { "X-MBX-APIKEY": apiKey },
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function accountInfo() {
  return privateCall("/v1/account");
  //   return privateCall("/v3/account");
}

async function allOrdersInfo() {
  return privateCall("/v1/allOrders");
}
async function exchangeInfo() {
  return publicCall("/v1/exchangeInfo");
  //   return publicCall("/v3/exchangeInfo");
}

async function publicCall(path, data, method = "GET") {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : "";
    const result = await axios({
      method,
      url: `${apiUrl}${path}${qs}`,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function time() {
  return publicCall("/v1/time");
  //   return publicCall("/v3/time");
}

async function klines(
  symbol = process.env.SYMBOL,
  limit = 8,
  interval = process.env.INTERVAL
) {
  const call = await publicCall("/v1/klines", { symbol, limit, interval });
  //   const call = await publicCall("/v3/klines", { symbol, limit, interval });

  const open = [];
  const high = [];
  const low = [];
  const close = [];

  call.map((data) => {
    open.unshift(data[1]);
    high.unshift(data[2]);
    low.unshift(data[3]);
    close.unshift(data[4]);
  });

  return { open: open, high: high, low: low, close: close };
}

module.exports = {
  time,
  klines,
  accountInfo,
  exchangeInfo,
  allOrdersInfo,
  publicCall,
};
