const api = require("../Rest/api");

const symbol = process.env.SYMBOL;
const interval = process.env.INTERVAL;

const getHistory = async () => {
  const data = await api.klines(symbol, 160 * 2, interval);

  return data;
};

module.exports = getHistory;
