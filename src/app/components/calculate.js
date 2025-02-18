//import data from "./data/APIdata";
import investors from "./data/investors";
import Front from "./front_page";
// import APIdata from "./data/APIdata.json";

export default async function Calc() {
  //Extract the price data for each stock

  const dataAPI = await yahooAPI();

  let stockPrices = dataAPI.quoteResponse.result.map((entry) => {
    return {
      symbol: entry.symbol,
      price: entry.regularMarketPrice,
      fiftyTwoWeekLow: entry.fiftyTwoWeekLow,
      fiftyTwoWeekHigh: entry.fiftyTwoWeekHigh,
      shortName: entry.shortName,
    };
  });
  // Filter out stocks with no attached price information.
  // updateSymbolEntry("KAPE.L", 285, 215, 306, "Inserted Kape Ltd");

  stockPrices = stockPrices.filter((entry) => entry.price != null);
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
  function updateSymbolEntry(symbol, price, low, high, shortName) {
    const index = stockPrices.findIndex((entry) => entry.symbol === symbol);
    if (index !== -1) {
      stockPrices[index].price = price;
      stockPrices[index].fiftyTwoWeekLow = low;
      stockPrices[index].fiftyTwoWeekHigh = high;
      stockPrices[index].shortName = shortName;
      console.log(`Updated ${symbol} entry`);
    } else {
      console.log(`${symbol} not found in dataArray`);
    }
  }

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
    // "https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=GB&symbols=GFI%2CRR.L%2CKAPE.L%2CSCT.L%2CGAW.L%2CBYIT.L%2CCVSG.L%2CSGE.L%2COXB.L%2CSHOE.L%2CKMR.L%2CITV.L%2CDRX.L%2CCRW.L%2CCEY.L%2CPSN.L%2CSTAN.L%2CLLOY.L%2CSDP.L%2CHL.L%2CIAG.L%2CFORT.L%2CGLEN.L%2CSMDS.L%2CWOSG.L%2CCCL.L%2CSMT.L%2CSOM.L%2CAVCT.L%2CPMI.L%2CCPH2.L%2CCWR.L%2CAAL.L%2CCLX.L%2COCDO.L%2CWBI.L";
    // "https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=GB&symbols=BARC.L%2CSMDS.L%2CLLOY.L%2CWBI.L%2CCCH.L%2CWOSG.L%2CTRST.L%2CBA.L%2CGRG.L%2CRKH.L%2CSMT.L%2CQQ.L%2CBRBY.L%2CNG.L%2CIAG.L%2CTEM.L%2CGSK.L%2CCCL.L%2CSSON.L%2CCHG.L%2CSCT.L%2CCWR.L%2CAAL.L%2CPETS.L%2CTRN.L%2CPSN.L%2CAZN.L%2COCDO.L%2CCLBS.L%2CGFI%2CEEE.L%2CCVSG.L%2CKWS.L%2CYCA.L%2CAVCT.L%2CKAPE.L";
    "https://yh-finance.p.rapidapi.com/market/v2/get-quotes?region=GB&symbols=CRW.L%2CJET2.L%2CBA.L%2CBUR.L%2CCRDA.L%2CCCL.L%2CSSON.L%2CSTJ.L%2CBP.L%2CEZJ.L%2CBRBY.L%2CPSN.L%2CTET.L%2CAIR.PA%2CAVCT.L%2CCLBS.L%2CDIA.L%2CFNX.L%2CGFI%2CGRG.L%2CLLOY.L%2CNWG.L%2CRKH.L%2CRR.L%2CSCGL.L%2CBTC.L%2CWBI.L%2CBARC.L%2CTRST.L%2CCHRT.L%2CDGE.L%2CIPC.L";
  for (const apiKey of apiKeys) {
    const options = {
      method: "GET",
      cache: "no-store",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
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
          `API request failed with status: ${response.status} for this key: ${options.headers["X-RapidAPI-Key"]}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log("All API keys failed. Unable to get a successful response.");
}
