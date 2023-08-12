"use client";
import { useState } from "react";
import UserPanel from "./userPanels";
import Image from "next/image";
import styles from "../page.module.css";
import Graphs from "./graph";
//Images
import leaderboard from "./images/leaderboard.svg";
import starConstellation from "./images/starConstellation.svg";

import starburst from "./images/starburst.svg";

export default function Front(props) {
  const { sortedValues, stockPrices } = props;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmittedChange = (value) => {
    setSubmitted(value + 1);
  };
  //console.log(sortedValues);

  return !submitted ? (
    <div className={styles.outer_container}>
      <div className={styles.container}>
        <div className={styles.header_leaderboard}>
          <Image
            priority
            src={leaderboard}
            alt="Leaderboard header"
            width={426}
            height={84}
          />
        </div>
        {/* <Image
          className={styles.starburst}
          fill
          src={starburst}
          alt="Starburst"
        /> */}
        <div className={styles.inner_container}>
          <Image
            className={styles.stars}
            priority
            src={starConstellation}
            alt="Stars"
          />

          <div className={styles.scorecard_container}>
            <UserPanel
              sortedValues={sortedValues}
              stockPrices={stockPrices}
              onSubmittedChange={handleSubmittedChange}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Graphs
      sortedValues={sortedValues}
      stockPrices={stockPrices}
      user={submitted}
    />
  );
}
