import React from "react";
import styles from "./Avatar.module.css";

function Avatar({ userId, onlinePersonUsername, online }) {
    const colors = [
        "red",
        "green",
        "blue",
        "teal",
        "purple",
        "yellow",
        "orange",
        "pink",
        "violet",
        "indigo",
    ];
    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        // <div className={styles.usernameIcon}>
        //     {onlinePersonUsername[0]}
        // </div>
        <div className={styles.usernameIcon} style={{ backgroundColor: color }}>
            <div>{onlinePersonUsername[0].toUpperCase()}</div>
            {online && <div className={styles.onlineVisualStatus}></div>}
        </div>
    );
}

export default Avatar;
