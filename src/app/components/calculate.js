//import data from "./data/APIdata";
import investors from "./data/investors";
import Front from "./front_page";
import APIdata from "./data/APIdata.json";

export default async function Calc() {
  //Extract the price data for each stock

  const dataAPI = await yahooAPI();
  // const monthAPI = await main();
  // console.log(monthAPI);

  const found = dataAPI.quoteResponse.result.find(
    (entry) => entry.symbol == ["KAPE.L"]
  );
  console.log(found);
  const stockPrices = dataAPI.quoteResponse.result.map((entry) => {
    return {
      symbol: entry.symbol,
      price: entry.regularMarketPrice,
      fiftyTwoWeekLow: entry.fiftyTwoWeekLow,
      fiftyTwoWeekHigh: entry.fiftyTwoWeekHigh,
      shortName: entry.shortName,
    };
  });

  // Get the monthly data

  // Use the investors file to identify which stocks are associated with wich investor/
  const ownersData = {};
  investors.stocks.forEach((stock) => {
    const { owners, symbol, holding } = stock;
    if (!ownersData[owners]) {
      ownersData[owners] = [];
    }
    ownersData[owners].push({ symbol, holding });
  });
  // console.log(ownersData);

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
  // console.log(calculatedHoldings);
  const sortedValues = calculatedHoldings.sort(
    (a, b) => b.totalValue - a.totalValue
  );
  return (
    <>
      <Front sortedValues={sortedValues} stockPrices={stockPrices} />
    </>
  );
}

// API section

async function yahooAPI() {
  const apiKeys = process.env.API_KEYS.split(",");

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
        // console.log(result);
        return result;
      } else {
        console.error(
          `API request failed with status: ${response.status} for this key: ${options}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log("All API keys failed. Unable to get a successful response.");
}

// Monthly data functions
async function fetchData(shares) {
  const url = `https://yfapi.net/v8/finance/spark?interval=1d&range=1mo&symbols='${shares}`;
  const options = {
    method: "GET",
    headers: {
      "x-api-key": "OgRRqJSaga3Fb7Ge9O2mr7BXE5rY99HO613DZmQx",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function callApi() {
  const companies = [
    "GFI%2CRR.L%2CKAPE.L%2CSCT.L%2CGAW.L%2CBYIT.L%2CCVSG.L%2CSGE.L%2COXB.L%2CSHOE.L%2CKMR.L%2CITV.L%2CDRX.L%2CCRW.L%2CCEY.L%2CPSN.L%2CSTAN.L%2CLLOY.L%2CSDP.L%2CHL.L",
    "IAG.L%2CFORT.L%2CGLEN.L%2CSMDS.L%2CWOSG.L%2CCCL.L%2CSMT.L%2CSOM.L%2CAVCT.L%2CPMI.L%2CCPH2.L%2CCWR.L%2CAAL.L%2CCLX.L%2COCDO.L%2CWBI.L",
  ];
  const allData = await Promise.all(companies.map(fetchData));

  return allData;
}
async function main() {
  const fetchedData = await callApi(); // Call the callApi function to get the data
  console.log("fetchedData", fetchedData); // Log the fetched data or use it as needed
  const results = { ...fetchedData[0], ...fetchedData[1] };
  // const extractedInfo = Object.keys(results).map((symbol) => {
  //   const symbolData = results[symbol];
  //   const firstTimestamp = symbolData.timestamp[0];
  //   const firstClose = symbolData.close[0];
  //   const lastClose = symbolData.close[symbolData.close.length - 1];
  // console.log(symbol, firstTimestamp);
  return results;
}
