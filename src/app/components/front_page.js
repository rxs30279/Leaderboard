import UserPanel from "./userPanels";
import Image from "next/image";
import styles from "../page.module.css";
//Images
import leaderboard from "./images/leaderboard.svg";
import starConstellation from "./images/starConstellation.svg";
import playButton from "./images/playButton.svg";

export default function Front({ currentValues }) {
  return (
    <div className={styles.outer_container}>
      <div className={styles.container}>
        <div className={styles.header_leaderboard}>
          <Image
            src={leaderboard}
            alt="Leaderboard header"
            width={426}
            height={84}
          />
        </div>
        <div className={styles.polygon}>
          <div className={styles.inner_container}>
            <div className={styles.stars}>
              <Image
                src={starConstellation}
                alt="Stars"
                width={339}
                height={124}
              />
            </div>
            <div className={styles.scorecard_container}>
              <UserPanel currentValues={currentValues} />
            </div>
          </div>
        </div>
        {/* <div className={styles.play_button}>
          <Image src={playButton} alt="play button" width={71} height={71} />
        </div> */}
      </div>
    </div>
  );
}
