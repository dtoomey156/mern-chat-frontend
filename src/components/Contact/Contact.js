import React from "react";
import styles from "./Contact.module.css";
import Avatar from "../Avatar/Avatar";

function Contact({ id, onClick, username, selected, online }) {
    return (
        <div
            key={id}
            onClick={() => {
                onClick(id);
            }}
            className={[
                styles.personDiv,
                selected ? styles.selectedUser : undefined,
            ].join(" ")}
        >
            <Avatar username={username} userId={id} online={online} />
            <span>{username}</span>
        </div>
    );
}

export default Contact;
