import investors from "./data/investors";
import Front from "./front_page";
import YahooFinance from "yahoo-finance2";
const yahooFinance = new YahooFinance();

const SYMBOLS = [...new Set(investors.stocks.map((s) => s.symbol))];

export default async function Calc() {
  const quotes = await fetchQuotes();

  if (!quotes) {
    return <div>Unable to fetch stock data. Please try again later.</div>;
  }

  let stockPrices = quotes.map((entry) => ({
    symbol: entry.symbol,
    price: entry.regularMarketPrice,
    fiftyTwoWeekLow: entry.fiftyTwoWeekLow,
    fiftyTwoWeekHigh: entry.fiftyTwoWeekHigh,
    shortName: entry.shortName,
  }));
  stockPrices = stockPrices.filter((entry) => entry.price != null);

  const ownersData = {};
  investors.stocks.forEach((stock) => {
    const { owners, symbol, holding } = stock;
    if (!ownersData[owners]) {
      ownersData[owners] = [];
    }
    ownersData[owners].push({ symbol, holding });
  });

  // Calculate holdings value for each individual
  const calculatedHoldings = [];
  for (const owner in ownersData) {
    const stocksOwned = ownersData[owner];
    const totalValue = stocksOwned.reduce((total, stock) => {
      const { symbol, holding } = stock;
      const priceData = stockPrices.find((p) => p.symbol === symbol);
      if (priceData) {
        const price = Number(priceData.price);
        if (!isNaN(price)) {
          return total + holding * price;
        } else {
          console.log(`Invalid price data for symbol ${symbol}`);
          return total;
        }
      } else {
        console.log(`Price data not found for symbol ${symbol}`);
        return total;
      }
    }, 0);
    calculatedHoldings.push({ owner, totalValue });
  }

  const sortedValues = calculatedHoldings.sort(
    (a, b) => b.totalValue - a.totalValue
  );

  return (
    <>
      <Front sortedValues={sortedValues} stockPrices={stockPrices} />
    </>
  );
}

async function fetchQuotes() {
  try {
    return await yahooFinance.quote(SYMBOLS);
  } catch (error) {
    console.error("[Yahoo] quote error:", error.message);
    return null;
  }
}
