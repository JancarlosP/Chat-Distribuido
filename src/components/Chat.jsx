import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img
            src={Cam}
            alt="Start Video Call"
            onClick={() => {
              const url = "https://video-calling-app-main.vercel.app/";
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
