import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaExclamationCircle } from "react-icons/fa";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        // Para otros tipos de archivos, muestra un ícono representativo
        const iconUrl = getIconForFileType(file.type);
        setImagePreview(iconUrl); // Puede ser una URL a un ícono almacenado localmente o en la web
      }
    } else {
      setImg(null);
      setImagePreview(null);
    }
    setError("");
  };

  // Una función helper para obtener un ícono basado en el tipo MIME del archivo
  const getIconForFileType = (fileType) => {
    if (fileType.includes("pdf")) return "/path/to/pdf-icon.png";
    if (fileType.includes("word")) return "/path/to/word-icon.png";
    if (fileType.includes("excel")) return "/path/to/excel-icon.png";
    return "/path/to/default-file-icon.png"; // Un ícono genérico para otros tipos de archivo
  };

  const handleSend = async () => {
    if (text.trim() === "" && !img) {
      setError("Campo vacío");
      return;
    }

    setError("");
    const messageId = uuid();
    setText("");
    setImg(null);
    setImagePreview(null);

    if (img) {
      const storageRef = ref(storage, `files/${messageId}`);

      const fileName = img.name;
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading file:", error);
          setError("Error al enviar el archivo.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newMessage = {
            id: messageId,
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            fileUrl: downloadURL,
            fileType: img.type,
            fileName: fileName,
          };
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion(newMessage),
          });
        }
      );
    } else {
      const newMessage = {
        id: messageId,
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      };
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(newMessage),
      });
    }

    const updates = {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    };
    await updateDoc(doc(db, "userChats", currentUser.uid), updates);
    await updateDoc(doc(db, "userChats", data.user.uid), updates);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim() !== "" || img) {
      setError("");
    }
  };

  return (
    <div className="input">
      {error && (
        <div className="error">
          <FaExclamationCircle style={{ color: "red", marginRight: "8px" }} />
          {error}
        </div>
      )}
      <input
        type="text"
        required
        placeholder="Escribe algo..."
        onChange={handleChange}
        value={text}
        onKeyDown={handleKeyDown}
      />
      <div className="send">
        <label htmlFor="file">
          <img src={Attach} alt="Attach" />
        </label>
        <input
          type="file"
          accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
      </div>
      <div className="send">
        <label htmlFor="imageFile">
          <img src={Img} alt="Add file" />
        </label>
        <input
          type="file"
          accept="image/jpeg, image/png, video/mp4, video/webm"
          style={{ display: "none" }}
          id="imageFile"
          onChange={handleFileChange}
        />

        {imagePreview && (
          <div className="image-preview">
            {img &&
            (img.type.startsWith("image/") || img.type.startsWith("video/")) ? (
              img.type.startsWith("video/") ? (
                <video
                  controls
                  src={imagePreview}
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  
                />
              )
            ) : (
              <div
                style={{
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img src={imagePreview} alt="" style={{ maxWidth: "50px" }} />
                <span style={{ fontSize: "12px", color: "#666" }}>
                  {" "}
                  {/* Cambia el tamaño de fuente y color */}
                  {img.name}
                </span>
              </div>
            )}
          </div>
        )}

        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default Input;
