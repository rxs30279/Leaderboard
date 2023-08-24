"use client";
import { useState } from "react";
import UserPanel from "./userPanels";
import Image from "next/image";
import styles from "../page.module.css";
import Graphs from "./graphs_monthly";
import Link from "next/link";
//Images
import blank_leaderboard from "./images/blank_leaderboard.svg";
import starConstellation from "./images/starConstellation.svg";
import starburst_background from "./images/starburst_background.svg";
import strawberry from "./images/strawberry.svg";

export default function Front_month(props) {
  const { sortedValues, calculatedShares } = props;
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
            src={blank_leaderboard}
            alt="Leaderboard header with Monthly message"
            width={426}
            height={84}
          />
          <div className={styles.monthly_name}>Monthly Change</div>
          <div className={styles.calendar_icon}>
            <Link href="/">
              <Image
                src={strawberry}
                alt="strawberry gif"
                height={40}
                width={40}
              />
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
              onSubmittedChange={handleSubmittedChange}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Graphs
      sortedValues={sortedValues}
      calculatedShares={calculatedShares}
      user={submitted}
      onArrowClick={onArrowClickFunc}
    />
  );
}
