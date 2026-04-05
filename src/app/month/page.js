import investors from "../components/data/investors.json";
import Front_month from "../components/front_page_month";
import YahooFinance from "yahoo-finance2";

export const dynamic = "force-dynamic";
const yahooFinance = new YahooFinance();

const SYMBOLS = [...new Set(investors.stocks.map((s) => s.symbol))];

export default async function MonthCalc() {
  const transformedMonthly = await main();

  // Use the investors file to identify which stocks are associated with which investor
  const ownersData = {};
  investors.stocks.forEach((stock) => {
    const { owners, symbol, holding } = stock;
    if (!ownersData[owners]) {
      ownersData[owners] = [];
    }
    ownersData[owners].push({ symbol, holding });
  });

  // Calculate the overall gain/loss for the month per individual
  const calculatedHoldings = [];
  for (const owner in ownersData) {
    const stocksOwned = ownersData[owner];
    const totalValue = stocksOwned.reduce((total, stock) => {
      const { symbol, holding } = stock;
      const priceData = transformedMonthly.find((data) => data.symbol === symbol);
      if (priceData) {
        const firstPrice = Number(priceData.firstClose);
        const closePrice = Number(priceData.lastClose);
        if (!isNaN(firstPrice) && !isNaN(closePrice)) {
          return total + (closePrice * holding - firstPrice * holding);
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

  // Calculate the gain or loss per individual per share
  const calculatedShares = [];
  for (const owner in ownersData) {
    const stocksOwned = ownersData[owner];
    const sharesInfo = stocksOwned.map((stock) => {
      const { symbol, holding } = stock;
      const priceData = transformedMonthly.find((data) => data.symbol === symbol);
      if (priceData) {
        const firstPrice = Number(priceData.firstClose);
        const closePrice = Number(priceData.lastClose);
        const startData = priceData.firstTimestamp;
        if (!isNaN(firstPrice) && !isNaN(closePrice)) {
          let gainLoss = Number(
            ((closePrice - firstPrice) * holding).toFixed(2)
          );
          return { symbol, holding, gainLoss, firstPrice, closePrice, startData };
        } else {
          console.log(`Invalid price data for symbol ${symbol}`);
          return null;
        }
      } else {
        console.log(`Price data not found for symbol ${symbol}`);
        return null;
      }
    });
    calculatedShares.push({ owner, sharesInfo });
  }

  return (
    <Front_month
      sortedValues={sortedValues}
      calculatedShares={calculatedShares}
    />
  );
}

async function main() {
  const fmt = (d) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  const results = await Promise.all(
    SYMBOLS.map(async (symbol) => {
      try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const chart = await yahooFinance.chart(symbol, {
          period1: oneMonthAgo,
          interval: "1d",
        });
        const quotes = chart.quotes.filter((q) => q.close !== null);
        if (quotes.length === 0) return null;

        const first = quotes[0];
        const last = quotes[quotes.length - 1];

        return {
          symbol,
          firstTimestamp: fmt(first.date),
          lastTimestamp: fmt(last.date),
          firstClose: first.close,
          lastClose: last.close,
        };
      } catch {
        console.log(`[Yahoo] chart failed for ${symbol}`);
        return null;
      }
    })
  );

  return results.filter(Boolean);
}
