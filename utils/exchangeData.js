const exchangeData = (data) => {
  if (data?.length) {
    return data[0];
  }
  return null;
}
module.exports = exchangeData;