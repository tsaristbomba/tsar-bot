function getPercentage(oldValue, newValue) {
  return ((newValue / oldValue) * 100 - 100).toFixed(2);
}

module.exports = getPercentage;
