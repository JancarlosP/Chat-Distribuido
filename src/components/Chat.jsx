import React, { useContext, useState } from "react";
import Cam from "../img/cam.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);

  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
    }
    setIsMicOn(!isMicOn);
  };

  const closeCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img
            src={Cam}
            alt="Start Video Call"
            onClick={() => {
              const url = "https://videollamada.kesug.com";
              window.open(url, "_blank", "noopener,noreferrer");
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      {isCameraOpen && (
        <div className="cameraPreview">
          <video
            autoPlay
            muted
            ref={(video) => {
              if (video && stream) {
                video.srcObject = stream;
              }
            }}
            style={{ width: "100%", height: "auto" }}
          />
          <button onClick={toggleMic}>
            {isMicOn ? "Micrófono Encendido" : "Micrófono Apagado"}
          </button>
          <button onClick={closeCamera}>Close Camera</button>
        </div>
      )}
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
