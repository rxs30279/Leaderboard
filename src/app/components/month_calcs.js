//import API from "./data/API.json";

export default async function MonthCalc() {
  const month = await main();
  console.log(month);
}
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
  // console.log(fetchedData); // Log the fetched data or use it as needed
  const results = { ...fetchedData[0], ...fetchedData[1] };
  const extractedInfo = Object.keys(results).map((symbol) => {
    const symbolData = results[symbol];
    const firstTimestamp = symbolData.timestamp[0];
    const firstClose = symbolData.close[0];
    const lastClose = symbolData.close[symbolData.close.length - 1];
    // console.log(symbol, firstTimestamp);
    return {
      symbol,
      firstTimestamp,
      firstClose, //       lastClose,
    };
  });
}
