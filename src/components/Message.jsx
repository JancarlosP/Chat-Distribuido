import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { format } from "date-fns";
import excelIcon from "../img/excel-item.png";
import pdfIcon from "../img/pdf-item.png";
import powerpointIcon from "../img/powerpoint-item.png";
import wordIcon from "../img/word-item.png";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      return format(timestamp.toDate(), "p"); // Formatea la fecha a AM/PM
    }
    return "Justo ahora";
  };

  const renderMessageContent = () => {
    if (message.img) {
      return (
        <img
          src={message.img}
          alt="Imagen enviada"
          style={{ maxWidth: "100%" }}
        />
      );
    } else if (message.fileUrl && message.fileType) {
      if (message.fileType.startsWith("image/")) {
        // Mostrar la imagen directamente si el archivo es de tipo imagen
        return (
          <img
            src={message.fileUrl}
            alt="Imagen enviada"
            style={{ maxWidth: "100%" }}
          />
        );
      } else if (message.fileType.startsWith("video/")) {
        // Mostrar el video si el archivo es de tipo video
        return (
          <video controls style={{ maxWidth: "100%" }}>
            <source src={message.fileUrl} type={message.fileType} />
            Tu navegador no soporta videos.
          </video>
        );
      } else {
        // Iconos para archivos según su tipo
        let icon;
        if (
          message.fileType.includes("application/vnd.ms-excel") ||
          message.fileType.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        ) {
          icon = excelIcon;
        } else if (message.fileType.includes("application/pdf")) {
          icon = pdfIcon;
        } else if (
          message.fileType.includes("application/vnd.ms-powerpoint") ||
          message.fileType.includes(
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          )
        ) {
          icon = powerpointIcon;
        } else if (
          message.fileType.includes("application/msword") ||
          message.fileType.includes(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          )
        ) {
          icon = wordIcon;
        }

        return (
          <div>
            {icon && (
              <img
                src={icon}
                alt="Icono de archivo"
                style={{ width: 24, height: 24 }}
              />
            )}
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Descargar {message.fileName || "archivo"}
            </a>
          </div>
        );
      }
    }
    return <p>{message.text}</p>;
  };

  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="Perfil"
        />
        <span>{formatDate(message.date)}</span>
      </div>
      <div className="messageContent">{renderMessageContent()}</div>
    </div>
  );
};

export default Message;
