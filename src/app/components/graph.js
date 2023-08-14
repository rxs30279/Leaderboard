import styles from "../page.module.css";
import Image from "next/image";
import investors from "./data/investors";
import blank_leaderboard from "./images/blank_leaderboard.svg";
import Chart from "./chart";

const Graphs = (props) => {
  const { sortedValues, stockPrices, user } = props;

  // From the static file get this users list of company holdings
  const ownersStock = investors.stocks.filter(
    (ownersStock) => ownersStock.owners == sortedValues[user - 1].owner
  );
  // Combine the above list 'ownersStock' with the price information 'stockPrices' and place in one array
  const combineArraysByKey = (ownersStock, stockPrices, symbol) => {
    const comboArray = [];
    for (let i = 0; i < ownersStock.length; i++) {
      const item1 = ownersStock[i];
      const matchingItem = stockPrices.find(
        (item2) => item2[symbol] == item1[symbol]
      );

      if (matchingItem) {
        comboArray.push({ ...item1, ...matchingItem });
      }
    }
    return comboArray;
  };
  const combinedArray = combineArraysByKey(ownersStock, stockPrices, "symbol");
  combinedArray.sort((a, b) => b.holding * b.price - a.holding * a.price);
  console.log(combinedArray);

  return (
    <div className={styles.outer_container}>
      <div className={styles.container}>
        <div className={styles.graph_inner_container}>
          <div className={styles.leaderboard_name}>
            {sortedValues[user - 1].owner}
          </div>
          <div className={styles.graph_header_leaderboard}>
            <Image priority src={blank_leaderboard} alt="Leaderboard header" />
          </div>
          <div className={styles.graph_wrapper}>
            <Chart combinedArray={combinedArray} />
          </div>
          <table className={styles.table_pricing_data}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>52wk High</th>
                <th>52wk Low</th>
              </tr>
            </thead>
            <tbody>
              {combinedArray.map((entry, indexEntry) => (
                <tr key={indexEntry}>
                  <td> {getFirstThreeWordsFromString(entry.shortName)}</td>
                  <td>{entry.price.toFixed(0)}</td>
                  <td>{entry.fiftyTwoWeekHigh.toFixed(0)}</td>
                  <td>{entry.fiftyTwoWeekLow.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Graphs;

function getFirstWordFromString(str) {
  const words = str.split(" ");
  if (words.length > 0) {
    return words[0];
  } else {
    return ""; // Return an empty string if the input string is empty
  }
}

function getFirstTwoWordsFromString(str) {
  const words = str.split(" ");
  if (words.length >= 2) {
    return words.slice(0, 2).join(" ");
  } else if (words.length === 1) {
    return words[0];
  } else {
    return ""; // Return an empty string if the input string is empty
  }
}

function getFirstThreeWordsFromString(str) {
  const words = str.split(" ");
  if (words.length >= 3) {
    return words.slice(0, 3).join(" ");
  } else {
    return str; // Return the original string if it has fewer than three words
  }
}
