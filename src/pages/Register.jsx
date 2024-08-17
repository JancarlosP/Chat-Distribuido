import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    if (err || errorMessage) {
      setErr(false);
      setErrorMessage("");
    }

    if (name === "file") {
      const file = files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const file = e.target.file.files[0];

    if (!file) {
      setErrorMessage("Seleccione una imagen");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateProfile(res.user, { displayName, photoURL: downloadURL });
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});
          navigate("/");
        });
      });
    } catch (error) {
      console.error("Error de registro:", error);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat Distribuido</span>
        <span className="title">Registrarse</span>
        <form onSubmit={handleSubmit} onChange={handleInputChange}>
          <input required type="text" name="displayName" placeholder="nombre" />
          <input required type="email" name="email" placeholder="correo" />
          <div style={{ position: "relative" }}>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 0, top: 0, padding: 10 }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <input
            required
            style={{ display: "none" }}
            type="file"
            id="file"
            name="file"
            accept="image/jpeg, image/png" // Specify accepted file types here
          />

          <label
            htmlFor="file"
            style={{ display: "flex", alignItems: "center" }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
            ) : (
              <img src={Add} alt="Añadir Avatar" style={{ marginRight: 10 }} />
            )}
            <span>Añadir imagen</span>
          </label>
          <button disabled={loading}>Registrarse</button>
          {loading && (
            <span>Subiendo y comprimiendo la imagen, por favor espere...</span>
          )}
          {err && <span>Ocurrió un error</span>}
          {errorMessage && <span>{errorMessage}</span>}
        </form>
        <p>
          Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
