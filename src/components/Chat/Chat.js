import React from "react";
import styles from "./Chat.module.css";
import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../UserProvider";
import { uniqBy } from "lodash";
import Avatar from "../Avatar/Avatar";
import axios from "axios";

function Chat() {
    const { username, id } = useContext(UserContext);
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [newMessageText, setNewMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const divUnderMessages = useRef();
    const scrollAtBottom = useRef(false);
    const scroll = useRef(null);
    const unreadMessageCount = useRef(0);

    useEffect(() => {
        connectToWs();
    }, []);

    function connectToWs() {
        const ws = new WebSocket("ws://localhost:4040");
        setWs(ws);
        ws.addEventListener("message", handleReceivedMessage);
        ws.addEventListener("close", () => {
            setTimeout(() => {
                console.log("WS disconnected. Trying to reconnect...");
                connectToWs();
            }, 1000);
        });
    }

    useEffect(() => {
        if (selectedUserId) {
            scrollAtBottom.current = false;
            axios.get("/messages/" + selectedUserId).then((res) => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId]);

    useEffect(() => {
        axios.get("/people").then((res) => {
            const offlinePeopleArr = res.data
                .filter((p) => p._id !== id)
                .filter((p) => !Object.keys(onlinePeople).includes(p._id));
            const offlinePeople = {};
            offlinePeopleArr.forEach((p) => {
                offlinePeople[p._id] = p;
            });
            setOfflinePeople(offlinePeople);
        });
    }, [onlinePeople]);

    // at bottom of scroll is actually 109 pixels because of margin and border not factored into some of the properties

    // useEffect(() => {
    //     const val = scroll.current;
    //     if (val) {
    //         const atBottom =
    //             val.scrollHeight - val.scrollTop - val.clientHeight;
    //         if (atBottom > 71) {
    //             return;
    //         } else {
    //             val.scrollTop = val.scrollHeight;
    //         }
    //     }
    // }, [messages]);

    // Refactored below to be more succinct

    // function autoScrollMessages() {
    //     const { clientHeight, scrollHeight, scrollTop } = scroll.current;
    //     console.log(scrollHeight, "scroll height");
    //     console.log(scrollHeight - scrollTop - clientHeight, "should be 0");
    //     if (scrollHeight <= scrollTop + clientHeight + 71) {
    //         scroll.current?.scrollTo(0, scrollHeight);
    //         // unreadMessageCount.current = 0;
    //     } else if (scrollHeight !== scrollTop + clientHeight + 71) {
    //         unreadMessageCount.current += 1;
    //         console.log(unreadMessageCount);
    //         // handleUnreadMessages(onlinePeople);
    //     }
    // }

    useEffect(() => {
        if (scroll.current && scrollAtBottom.current === true) {
            const { scrollHeight } = scroll.current;
            scroll.current.scrollTo(0, scrollHeight);
        }
    }, [messages]);

    function checkScrollPosition() {
        const { clientHeight, scrollHeight, scrollTop } = scroll.current;
        if (scrollHeight - clientHeight - scrollTop < 1) {
            // setAtBottomScroll(true);
            scrollAtBottom.current = true;
        } else {
            scrollAtBottom.current = false;
        }

        console.log(scrollAtBottom.current);
    }

    // function handleUnreadMessages(list) {
    //     console.log({ list }, "yeahhhhhh baby");
    // }

    // function clearUnreadMessages() {
    //     const { clientHeight, scrollHeight, scrollTop } = scroll.current;
    //     if (scrollHeight <= scrollTop + clientHeight + 71) {
    //         unreadMessageCount.current = 0;
    //         console.log(unreadMessageCount.current);
    //     }
    // }

    // useEffect(() => {
    //     const val = scroll.current;
    //     if (val) {
    //         const atBottom =
    //             val.scrollHeight - val.scrollTop - val.clientHeight;
    //         console.log(atBottom, "at bottom");
    //         console.log(val.scrollTop, "scroll top");
    //         console.log(val.scrollHeight, "scroll height");
    //         console.log(val.clientHeight, "client height");
    //     }
    // }, [messages]);

    //this one uses offsetHeight for comparison purposes

    // useEffect(() => {
    //     const div = divUnderMessages.current;
    //     if (div) {
    //         div.scrollIntoView({ behavior: "smooth", block: "end" });
    //     }
    // }, [messages]);

    function showOnlinePeople(peopleArray) {
        // console.log(peopleArray);
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        // console.log(people, "people");
        setOnlinePeople(people);
    }

    function handleReceivedMessage(e) {
        const messageData = JSON.parse(e.data);
        if ("online" in messageData) {
            showOnlinePeople(messageData.online);
            console.log(messageData, "message data");
        } else if ("text" in messageData) {
            setMessages((prev) => [...prev, { ...messageData }]);
            // handleUnreadMessage(messageData);
        }
    }

    // removes our user name from the list of people on the chat

    const onlineExcludeMyUsername = { ...onlinePeople };
    delete onlineExcludeMyUsername[id];

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
                _id: Date.now(),
            },
        ]);

        // const div = divUnderMessages.current;
        // div.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    // console.log(selectedUserId);
    // console.log(username);

    const messagesWithoutDupes = uniqBy(messages, "_id");

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
                        className={[
                            styles.personDiv,
                            userId === selectedUserId
                                ? styles.selectedUser
                                : undefined,
                        ].join(" ")}
                    >
                        <Avatar
                            onlinePersonUsername={onlinePeople[userId]}
                            userId={userId}
                            online={true}
                        />
                        <span>{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className={styles.messagePane}>
                {selectedUserId && (
                    <div
                        ref={scroll}
                        // onScroll={clearUnreadMessages}
                        onScroll={checkScrollPosition}
                        className={styles.messageScrollDiv}
                    >
                        {messagesWithoutDupes.map((message) => (
                            <div
                                key={message._id}
                                className={[
                                    styles.messageStyling,
                                    message.sender === id
                                        ? styles.sentMessageStyling
                                        : styles.receivedMessageStyling,
                                ].join(" ")}
                            >
                                {message.text}
                            </div>
                        ))}
                        {/* <div ref={divUnderMessages}></div> */}
                    </div>
                )}
            </div>
            {selectedUserId && (
                <form className={styles.composeMessage} onSubmit={sendMessage}>
                    <input
                        value={newMessageText}
                        onChange={(e) => {
                            setNewMessageText(e.target.value);
                        }}
                        className={styles.messageInput}
                        type="text"
                        placeholder="Message"
                    />
                    <button type="submit" className={styles.send}>
                        <span>
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
                        </span>
                    </button>
                </form>
            )}
        </div>
    );
}

export default Chat;
