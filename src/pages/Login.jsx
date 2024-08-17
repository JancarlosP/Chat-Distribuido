import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [loginError, setLoginError] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar la contraseña
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    if (loginError || resetError) {
      setLoginError(false);
      setResetError(false);
    }
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    if (loginError || resetError) {
      setLoginError(false);
      setResetError(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, e.target.password.value);
      navigate("/");
    } catch (error) {
      console.error("Error de autenticación:", error);
      setLoginError(true);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      alert("Ingrese su correo electrónico para restablecer su contraseña."); // Usar alert para mostrar el error
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "Si tiene una cuenta con nosotros, debería llegarle un correo electrónico para restablecer su contraseña."
      ); // Confirmación enviada
    } catch (error) {
      console.error("Error al enviar el email de restablecimiento:", error);
      alert(
        "Hubo un error al intentar enviar el correo de restablecimiento. Por favor, intente de nuevo más tarde."
      ); // Error durante el envío
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat Distribuido</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="email"
            name="email"
            placeholder="correo"
            value={email}
            onChange={handleInputChange}
          />
          <div style={{ position: "relative" }}>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="contraseña"
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{ position: "absolute", right: 0, top: 0, padding: 10 }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button type="submit">Iniciar Sesión</button>
          {loginError && (
            <span>La cuenta no existe o la contraseña es incorrecta</span>
          )}
        </form>
        <button
          className="buttonReset"
          onClick={handleResetPassword}
          style={{
            margin: "10px 0",
            backgroundColor: "#7b96ec",
            color: "white",
            padding: "10px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          ¿Olvidó su contraseña? Restablecer
        </button>

        {resetError && <span>Ingrese su correo electrónico</span>}
        <p>
          No tienes cuenta? <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
