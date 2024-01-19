import React from "react";
import styles from "./Chat.module.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserProvider";
import { uniqBy } from "lodash";

function Chat() {
    const { username, id } = useContext(UserContext);
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4040");
        setWs(ws);
        ws.addEventListener("message", handleMessage);
    }, []);

    function showOnlinePeople(peopleArray) {
        // console.log(peopleArray);
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        // console.log(people);
        setOnlinePeople(people);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        console.log("handle message", { e, messageData });
        if ("online" in messageData) {
            showOnlinePeople(messageData.online);
        } else if ("text" in messageData) {
            setMessages((prev) => [...prev, { ...messageData }]);
        }
    }

    // removes our user name from the list of people on the chat

    const onlineExcludeMyUsername = { ...onlinePeople };
    delete onlineExcludeMyUsername[id];

    console.log("messages variable", messages);

    function sendMessage(e) {
        e.preventDefault();
        ws.send(
            JSON.stringify({
                recipient: selectedUserId,
                text: newMessageText,
            })
        );

        setNewMessageText("");
        // setMessages((prev) => [...prev, { text: newMessageText, isOur: true }]);
        setMessages((prev) => [
            ...prev,
            {
                text: newMessageText,
                sender: id,
                recipient: selectedUserId,
                id: Date.now(),
            },
        ]);
    }

    // console.log(selectedUserId);
    // console.log(username);

    const messagesWithoutDupes = uniqBy(messages, "id");

    console.log("messages without dupes", messagesWithoutDupes);

    return (
        <div className={styles.chatContainer}>
            <div className={styles.user}>{`Welcome, ${username}`}</div>
            <div className={styles.peoplePane}>
                {Object.keys(onlineExcludeMyUsername).map((userId) => (
                    <div
                        key={userId}
                        onClick={() => {
                            setSelectedUserId(userId);
                        }}
                        className={
                            userId === selectedUserId
                                ? styles.selectedUser
                                : undefined
                        }
                    >
                        {onlinePeople[userId]}
                    </div>
                ))}
            </div>
            <div className={styles.messagePane}>
                {selectedUserId && (
                    <div className={styles.messageScrollDiv}>
                        {messagesWithoutDupes.map((message) => (
                            <div
                                key={message.id}
                                className={[
                                    styles.messageStyling,
                                    message.sender === id
                                        ? styles.sentMessageStyling
                                        : styles.receivedMessageStyling,
                                ].join(" ")}
                            >
                                sender:{message.sender}
                                <br />
                                my id: {id}
                                <br />
                                {message.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {!!selectedUserId && (
                <form className={styles.composeMessage} onSubmit={sendMessage}>
                    <input
                        value={newMessageText}
                        onChange={(e) => {
                            setNewMessageText(e.target.value);
                        }}
                        className={styles.messageInput}
                        type="text"
                        placeholder="Compose message here"
                    />
                    <button type="submit" className={styles.send}>
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
                </form>
            )}
        </div>
    );
}

export default Chat;
