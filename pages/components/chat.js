import { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import callOut, { getUserChats } from "../api/chat";

export const Chat = (props) => {
  const { user } = props;
  const [text, setText] = useState("");
  const [pastChats, setPastChats] = useState([]);
  const getChats = async () => {
    const res = await getUserChats(user.uid);
    setPastChats(res);
  };

  useEffect(() => {
    getChats();
  }, []);

  const sendChat = async () => {
    if (!text) return;
    const result = await callOut(text, user.uid);
    getChats();
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className={styles.chat}>
      <div>
        {pastChats.map((chat, idx) => (
          <div key={idx}>
            <div>{chat.userChat}</div>
            <div>{chat.response}</div>
          </div>
        ))}
      </div>
      <div>
        <input value={text} type="text" onChange={handleTextChange} />
        <button onClick={sendChat} disabled={text === ""}>
          Send
        </button>
      </div>
    </div>
  );
};
