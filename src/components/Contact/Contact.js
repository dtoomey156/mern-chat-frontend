import React from "react";

function Contact({ id, onClick, selectedUserId, username }) {
    return (
        <div
            key={id}
            onClick={() => {
                onClick(id);
            }}
            className={[
                styles.personDiv,
                id === selectedUserId ? styles.selectedUser : undefined,
            ].join(" ")}
        >
            <Avatar username={username} UserId={id} online={true} />
            <span>{onlinePeople[id]}</span>
        </div>
    );
}

export default Contact;
