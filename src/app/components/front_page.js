import UserPanel from "./userPanels";
import Image from "next/image";
import styles from "../page.module.css";
//Images
import leaderboard from "./images/leaderboard.svg";
import starConstellation from "./images/starConstellation.svg";

import starburst from "./images/starburst.svg";

export default function Front({ currentValues }) {
  return (
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
          <Image className={styles.stars} src={starConstellation} alt="Stars" />

          <div className={styles.scorecard_container}>
            <UserPanel currentValues={currentValues} />
          </div>
        </div>
      </div>
    </div>
  );
}
