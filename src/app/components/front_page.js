"use client";
import { useState } from "react";
import UserPanel from "./userPanels";
import Image from "next/image";
import styles from "../page.module.css";
import Graphs from "./graph";
import Link from "next/link";
//Images
import leaderboard from "./images/leaderboard.svg";
import starConstellation from "./images/starConstellation.svg";
import starburst_background from "./images/starburst_background.svg";
import button from "./images/playButton.svg";

export default function Front(props) {
  const { sortedValues, stockPrices } = props;
  const [submitted, setSubmitted] = useState(false);

  const handleSubmittedChange = (value) => {
    setSubmitted(value + 1);
  };
  const onArrowClickFunc = () => {
    setSubmitted(false);
  };

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
          <div className={styles.calendar_icon}>
            <Link href="/month">
              <Image src={button} alt="button image" height={60} width={60} />
            </Link>
          </div>
        </div>
        <div className={styles.inner_container}>
          <Image
            className={styles.stars}
            priority
            src={starConstellation}
            alt="Stars"
          />
          <div className={styles.starburst_background}>
            <Image
              fill
              priority
              src={starburst_background}
              alt="Background light rays"
            />
          </div>
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
      onArrowClick={onArrowClickFunc}
    />
  );
}
