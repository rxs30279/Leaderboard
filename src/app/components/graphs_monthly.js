import styles from "../page.module.css";
import Image from "next/image";
import investors from "./data/investors";
import blank_leaderboard from "./images/blank_leaderboard.svg";
import left_arrow from "./images/left_arrow.svg";
import Chart from "./chart_monthly";

const Graphs = (props) => {
  const { sortedValues, calculatedShares, user, onArrowClick } = props;

  const handleLeftArrowClick = () => {
    onArrowClick(false);
  };

  // Pull out the 'Owner' and their shares from the calculatedShares file calculated in the pages.js file
  const ownerToFind = sortedValues[user - 1].owner; // get the owner from the front_page list of owners.
  let filteredSharesInfo = [];
  const ownerSharesInfo = calculatedShares.find(
    (entry) => entry.owner === ownerToFind
  )?.sharesInfo;
  if (ownerSharesInfo) {
    //remove any null objects from the array
    filteredSharesInfo = ownerSharesInfo.filter((info) => info !== null);
    // sort the objects in the array
    filteredSharesInfo.sort((a, b) => b.gainLoss - a.gainLoss);
  }
  // console.log(filteredSharesInfo);

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
          <div className={styles.month_graph_header}>Gains/Losses Month</div>
          <div className={styles.graph_wrapper}>
            <Chart filteredSharesInfo={filteredSharesInfo} />
          </div>
          <table className={styles.table_pricing_data}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>{filteredSharesInfo[0].startData}</th>
                <th>Todays Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredSharesInfo.map((entry, indexEntry) => (
                <tr key={indexEntry}>
                  <td> {entry.symbol}</td>
                  <td>{entry.firstPrice.toFixed(0)}</td>
                  <td>{entry.closePrice.toFixed(0)}</td>
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
  const words = str.split(" ");
  if (words.length >= 3) {
    return words.slice(0, 3).join(" ");
  } else {
    return str; // Return the original string if it has fewer than three words
  }
}
