import investors from "../components/data/investors.json";
// import apimonth from "../components/data/API.json";
import Front_month from "../components/front_page_month";

export default async function MonthCalc() {
  const transformedMonthly = await main();

  //dev code
  // const monthly = apimonth;
  // const transformedMonthly = [];

  // monthly.forEach((data) => {
  //   for (const symbol in data) {
  //     const symbolData = data[symbol];
  //     const firstTime = new Date(symbolData.timestamp[0] * 1000);
  //     const lastTime = new Date(
  //       symbolData.timestamp[symbolData.timestamp.length - 1] * 1000
  //     );

  //     const firstTimestamp = `${firstTime.getDate()}/${
  //       firstTime.getMonth() + 1
  //     }/${firstTime.getFullYear()}`;

  //     const lastTimestamp = `${lastTime.getDate()}/${
  //       lastTime.getMonth() + 1
  //     }/${lastTime.getFullYear()}`;

  //     const firstClose = symbolData.close[0];
  //     const lastClose = symbolData.close[symbolData.close.length - 1];

  //     transformedMonthly.push({
  //       symbol,
  //       firstTimestamp,
  //       lastTimestamp,
  //       firstClose,
  //       lastClose,
  //     });
  //   }
  // });

  // console.log(transformedMonthly);

  // Use the investors file to identify which stocks are associated with wich investor/
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
      const priceData = transformedMonthly.find(
        (data) => data.symbol === symbol
      );
      // console.log(stock, transformedMonthly.symbol);
      if (priceData) {
        const firstPrice = Number(priceData.firstClose);
        const closePrice = Number(priceData.lastClose);

        if (!isNaN(firstPrice) && !isNaN(closePrice)) {
          let summary = closePrice * holding - firstPrice * holding;
          //   summary = Number(summary.toFixed(2));
          return total + summary;
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
  //   console.log(calculatedHoldings);
  // Calculate holdings value for each individual
  const sortedValues = calculatedHoldings.sort(
    (a, b) => b.totalValue - a.totalValue
  );

  // Calculate the gain or loss per individual per share
  const calculatedShares = [];
  for (const owner in ownersData) {
    const stocksOwned = ownersData[owner];
    const sharesInfo = stocksOwned.map((stock) => {
      const { symbol, holding } = stock;
      const priceData = transformedMonthly.find(
        (data) => data.symbol === symbol
      );

      if (priceData) {
        const firstPrice = Number(priceData.firstClose);
        const closePrice = Number(priceData.lastClose);
        const startData = priceData.firstTimestamp;
        if (!isNaN(firstPrice) && !isNaN(closePrice)) {
          let gainLoss = Number(
            ((closePrice - firstPrice) * holding).toFixed(2)
          );
          return {
            symbol,
            holding,
            gainLoss,
            firstPrice,
            closePrice,
            startData,
          };
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
  // console.log(calculatedShares[0]);
  return (
    <Front_month
      sortedValues={sortedValues}
      calculatedShares={calculatedShares}
    />
  );
}

async function fetchData(shares) {
  const apiKeys = process.env.API_KEYS.split(",");

  const url = `https://yh-finance.p.rapidapi.com/market/get-spark?symbols=${shares}&interval=1d&range=1mo`;

  for (const apiKey of apiKeys) {
    const options = {
      method: "GET",
      cache: "no-store",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "yh-finance.p.rapidapi.com",
      },
    };
    console.log("Trying this apiKey", apiKey);
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const result = await response.json();
        // console.log(result);
        return result;
      } else {
        console.error(
          `API request failed for monthly with status: ${response.status} for this key: ${options.headers["X-RapidAPI-Key"]}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
async function callApi() {
  const companies = [
    // "GFI%2CRR.L%2CKAPE.L%2CSCT.L%2CGAW.L%2CBYIT.L%2CCVSG.L%2CSGE.L%2COXB.L%2CSHOE.L%2CKMR.L%2CITV.L%2CDRX.L%2CCRW.L%2CCEY.L%2CPSN.L%2CSTAN.L%2CLLOY.L%2CSDP.L%2CHL.L",
    // "IAG.L%2CFORT.L%2CGLEN.L%2CSMDS.L%2CWOSG.L%2CCCL.L%2CSMT.L%2CSOM.L%2CAVCT.L%2CPMI.L%2CCPH2.L%2CCWR.L%2CAAL.L%2CCLX.L%2COCDO.L%2CWBI.L",
    // "BARC.L%2CSMDS.L%2CLLOY.L%2CWBI.L%2CCCH.L%2CWOSG.L%2CTRST.L%2CBA.L%2CGRG.L%2CRKH.L%2CSMT.L%2CQQ.L%2CBRBY.L%2CNG.L%2CIAG.L%2CTEM.L%2CGSK.L%2CCCL.L%2CSSON.L",
    // "CHG.L%2CSCT.L%2CCWR.L%2CAAL.L%2CPETS.L%2CTRN.L%2CPSN.L%2CAZN.L%2COCDO.L%2CCLBS.L%2CGFI%2CEEE.L%2CCVSG.L%2CKWS.L%2CYCA.L%2CAVCT.L%2CKAPE.L",
    "CRW.L%2CJET2.L%2CBA.L%2CBUR.L%2CCRDA.L%2CCCL.L%2CSSON.L%2CSTJ.L%2CBP.L%2CEZJ.L%2CBRBY.L%2CPSN.L%2CTET.L%2CAIR.PA%2CAVCT.L%2CCLBS.L%2CDIA.L%2CFNX.L%2CGFI%2CGRG.L",
    "LLOY.L%2CNWG.L%2CRKH.L%2CRR.L%2CSCGL.L%2CBTC.L%2CWBI.L%2CBARC.L%2CTRST.L%2CCHRT.L%2CDGE.L%2CIPC.L",
  ];
  const allData = await Promise.all(companies.map(fetchData));

  return allData;
}
async function main() {
  const fetchedData = await callApi(); // Call the callApi function to get the data
  // console.log(fetchedData); // Log the fetched data or use it as needed
  const results = { ...fetchedData[0], ...fetchedData[1] };
  const extractedInfo = Object.keys(results).map((symbol) => {
    const symbolData = results[symbol];
    const firstTime = new Date(symbolData.timestamp[0] * 1000);
    const lastTime = new Date(
      symbolData.timestamp[symbolData.timestamp.length - 1] * 1000
    );

    const firstTimestamp = `${firstTime.getDate()}/${
      firstTime.getMonth() + 1
    }/${firstTime.getFullYear()}`;

    const lastTimestamp = `${lastTime.getDate()}/${
      lastTime.getMonth() + 1
    }/${lastTime.getFullYear()}`;

    const firstClose = symbolData.close[0];
    const lastClose = symbolData.close[symbolData.close.length - 1];
    //console.log(symbol, firstTimestamp);
    return { symbol, firstTimestamp, lastTimestamp, firstClose, lastClose };
  });
  // console.log(extractedInfo); // Log the extracted information
  return extractedInfo; // Return the extracted information if needed
}
