import data from "./data/APIdata";
import investors from "./data/investors";
import Front from "./front_page";

const Calc = () => {
  //Extract the price data for each stock
  const stockPrices = data.quoteResponse.result.map((entry) => {
    return {
      symbol: entry.symbol,
      price: entry.regularMarketPrice,
    };
  });
  console.log(stockPrices);

  // Use the investors file to identify which stocks are associated with wich investor/
  const ownersData = {};
  investors.stocks.forEach((stock) => {
    const { owners, symbol, holding } = stock;
    if (!ownersData[owners]) {
      ownersData[owners] = [];
    }
    ownersData[owners].push({ symbol, holding });
  });
  console.log(ownersData);

  // Calculate holdings value for each individual
  const calculatedHoldings = [];
  for (const owner in ownersData) {
    const stocksOwned = ownersData[owner];
    const totalValue = stocksOwned.reduce((total, stock) => {
      const { symbol, holding } = stock;
      const priceData = stockPrices.find(
        (priceData) => priceData.symbol === symbol
      );
      if (priceData) {
        const { price } = priceData;
        return total + holding * price;
      } else {
        console.log(`Price data not found for symbol ${symbol}`);
        return total;
      }
    }, 0);
    calculatedHoldings.push({ owner, totalValue });
  }
  console.log(calculatedHoldings);

  return <Front currentValues={calculatedHoldings} />;
};
export default Calc;
