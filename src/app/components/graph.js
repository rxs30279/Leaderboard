import { useState } from "react";
import styles from "../page.module.css";
import Image from "next/image";
import investors from "./data/investors";
import blank_leaderboard from "./images/blank_leaderboard.svg";
import left_arrow from "./images/left_arrow.svg";
import Chart from "./chart";

const Graphs = (props) => {
  const { sortedValues, stockPrices, user, onArrowClick } = props;

  const handleLeftArrowClick = () => {
    onArrowClick(false);
  };

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
          <div className={styles.header_arrow_text_container}>
            <div
              onClick={handleLeftArrowClick}
              className={styles.left_arrow_container}
            >
              <Image priority src={left_arrow} alt="left_arrow" />
            </div>
            <div className={styles.centered_container}>
              <div className={styles.leaderboard_name}>
                {sortedValues[user - 1].owner}
              </div>
            </div>
          </div>
          <div className={styles.graph_header_leaderboard}>
            <Image priority src={blank_leaderboard} alt="Leaderboard header" />
          </div>
          <div className={styles.month_graph_header}>Total Value</div>
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

function getFirstThreeWordsFromString(str) {
  const safeStr = String(str); // Coerce to string
  const words = safeStr.split(" ");
  return words.length >= 3 ? words.slice(0, 3).join(" ") : safeStr;
}
