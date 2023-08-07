import styles from "../page.module.css";
import Image from "next/image";
import position_marker_1 from "./images/Position_marker_1.svg";
import position_marker_2 from "./images/Position_marker_2.svg";
import position_marker_3 from "./images/Position_marker_3.svg";
import position_marker_4 from "./images/Position_marker_4.svg";
import position_marker_5 from "./images/Position_marker_5.svg";
import position_marker_6 from "./images/Position_marker_6.svg";
import position_marker_7 from "./images/Position_marker_7.svg";
import position_marker_8 from "./images/Position_marker_8.svg";
import adrianAvatar from "./images/adrianAvatar.svg";
import alanAvatar from "./images/alanAvatar.svg";
//import grahamAvatar from "./images/grahamAvatar.svg";
import pattiAvatar from "./images/pattiAvatar.svg";
import lesAvatar from "./images/lesAvatar.svg";
//import richardAvatar from "./images/alanAvatar.svg";
//import chrisAvatar from "./images/alanAvatar.svg";
import coin from "./images/coin.svg";

export default function UserPanel(props) {
  const { currentValues } = props;

  const sortedValues = currentValues.sort(
    (a, b) => b.totalValue - a.totalValue
  );

  //build an array to map avatars to 'owners'
  const ownerImageMap = {
    Adrian: adrianAvatar,
    Alan: alanAvatar,
    Chris: alanAvatar,
    Graham: alanAvatar,
    Les: lesAvatar,
    Patti: pattiAvatar,
    Peter: alanAvatar,
    Richard: alanAvatar,
  };

  // build an array of position marker images
  const getPositionMarkerImage = (userIndex) => {
    // Array of position marker images
    const positionMarkerImages = [
      position_marker_1,
      position_marker_2,
      position_marker_3,
      position_marker_4,
      position_marker_5,
      position_marker_6,
      position_marker_7,
      position_marker_8,
    ];
    const avatars = [];
    const imageIndex = userIndex % positionMarkerImages.length;
    return positionMarkerImages[imageIndex];
  };

  return (
    <>
      {sortedValues.map((users, userIndex) => (
        <section key={userIndex}>
          <div className={styles.scorecard}>
            <div className={styles.left_scorecard}>
              <div className={styles.left_scorecard_scoreball}>
                <Image
                  src={getPositionMarkerImage(userIndex)}
                  alt="Position round numbered marker"
                  width={35}
                  height={35}
                />
              </div>
              <Image
                src={ownerImageMap[users.owner]}
                alt="Individual's Avatar"
                width={80}
                height={90}
              />
              <div className={styles.left_scorecard_name}>{users.owner}</div>
            </div>
            <div className={styles.right_scorecard_wrapper}>
              <div className={styles.right_scorecard}>
                <div>
                  <Image
                    src={coin}
                    alt="Universal coin img"
                    width={50}
                    height={43}
                  />
                </div>
                <div className={styles.scores_on_doors}>
                  {users.totalValue.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
