// const api = require("./api");
const getHL = require("../Utils/smaHighsLows");

async function getChikou(close, high, low, lengthOne, lengthTwo, lengthThree) {
  try {
    const price = parseFloat(high[31]);
    const chikou = parseFloat(close[1]);
    let tenkan = parseFloat(getHL(high, low, lengthOne + 30, 31));
    let kijun = parseFloat(getHL(high, low, lengthTwo + 30, 31));
    let spanA = parseFloat(
      (getHL(high, low, lengthOne + 60, 61) +
        getHL(high, low, lengthTwo + 60, 61)) /
        2
    );
    let spanB = parseFloat(getHL(high, low, lengthThree + 60, 61));

    let result;

    if (
      chikou > price &&
      chikou > tenkan &&
      chikou > kijun &&
      chikou > spanA &&
      chikou > spanB
    ) {
      result = "BULL";
    } else if (
      chikou < price &&
      chikou < tenkan &&
      chikou < kijun &&
      chikou < spanA &&
      chikou < spanB
    ) {
      result = "BEAR";
    } else {
      result = "BAD";
    }

    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getIchimoku(
  data,
  lengthOne = 20,
  lengthTwo = 60,
  lengthThree = 120
) {
  try {
    const close = data.close;
    const high = data.high;
    const low = data.low;

    let tenkan = getHL(high, low, lengthOne);
    let kijun = getHL(high, low, lengthTwo);
    let spanA =
      (getHL(high, low, lengthOne + 30, 31) +
        getHL(high, low, lengthTwo + 30, 31)) /
      2;
    let spanB = getHL(high, low, lengthThree + 30, 31);
    let spanAFuture = (tenkan + kijun) / 2;
    let spanBFuture = getHL(high, low, lengthThree);
    const chikou = await getChikou(
      close,
      high,
      low,
      lengthOne,
      lengthTwo,
      lengthThree
    );

    return {
      price: parseFloat(close[1]),
      // lowest: parseFloat(low[0]),
      tenkan: tenkan,
      kijun: kijun,
      spanAPast: spanA,
      spanBPast: spanB,
      spanAFuture: spanAFuture,
      spanBFuture: spanBFuture,
      chikou: chikou,
    };
  } catch (error) {
    console.log(error);
  }
}

module.exports = getIchimoku;
