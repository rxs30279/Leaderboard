import data from "./data/APIdata";
import investors from "./data/investors";
import Front from "./front_page";

export default async function Calc() {
  //Extract the price data for each stock

  const dataAPI = await yahooAPI();

  const stockPrices = dataAPI.quoteResponse.result.map((entry) => {
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

  return (
    <>
      <Front currentValues={calculatedHoldings} />;
    </>
  );
}

// API section

async function yahooAPI() {
  const apiKeys = [
    "aXCON862Qc449MKr3fohA6lB0Ii4JyVg17SrtNia",
    "p544cXGO7QaS0xQ7yvbBj1BMnEBNO09a2rS6zR74",
    "lNN6AVienL3zYBX3EOmx3KqK07WEHHe4LwlxMNWf",
  ];

  const url =
    "https://yfapi.net/v6/finance/quote?region=GB&lang=en&symbols=GFI%2CRR.L%2CKAPE.L%2CSCT.L%2CGAW.L%2CBYIT.L%2CCVSG.L%2CSGE.L%2COXB.L%2CSHOE.L%2CKMR.L%2CITV.L%2CDRX.L%2CCRW.L%2CCEY.L%2CPSN.L%2CSTAN.L%2CLLOY.L%2CSDP.L%2CHL.L%2CIAG.L%2CFORT.L%2CGLEN.L%2CSMDS.L%2CWOSG.L%2CCCL.L%2CSMT.L%2CSOM.L%2CAVCT.L%2CPMI.L%2CCPH2.L%2CCWR.L%2CAAL.L%2CCLX.L%2COCDO.L%2CWBI.L";
  for (const apiKey of apiKeys) {
    const options = {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        return result;
      } else {
        console.error(`API request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.error("All API keys failed. Unable to get a successful response.");
}
