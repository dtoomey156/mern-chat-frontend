import React from "react";
import styles from "./Chat.module.css";
import { useContext } from "react";
import { UserContext } from "../../UserProvider";

function Chat() {
    const { username, id } = useContext(UserContext);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.user}>{`Welcome, ${username}`}</div>
            <div className={styles.peoplePane}>People</div>
            <div className={styles.messagePane}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
                cupiditate consectetur ipsam est, aliquid laboriosam natus
                ratione ex distinctio dignissimos possimus adipisci consequuntur
                odit commodi voluptas voluptates fugiat modi accusamus.
            </div>
            <div className={styles.composeMessage}>
                <input
                    className={styles.messageInput}
                    type="text"
                    placeholder="Compose message here"
                />
                <button className={styles.send}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chat;
