import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../api";


function Login() {

  const navigate = useNavigate();
  const [carnet, setCarnet] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      await api.login({ carnet, contrasena });
      navigate("/home");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  }
  

  return (
    <div className="login-container">
    <div className="login-card">
      <h1>Iniciar Sesion</h1>
      <p>Bienvenido al sistema de calificacion de cursos</p>
      <p>Inicie los datos para ingresar: </p>

      <form onSubmit={handleLogin}>
          <input type="text" placeholder="Registro Académico" value={carnet} onChange={(e) => setCarnet(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        {error && <p role="alert">{error}</p>}
        <p>
          ¿No tienes una cuenta? <a href="./registro">Registrate</a>
          <br />
          ¿Olvidaste tu contraseña? <a href="./forget">Recuperar</a>
        </p>
        <button type="submit" disabled={cargando}>{cargando ? "Ingresando..." : "Iniciar Sesión"}</button>
      </form>
    </div>
    </div>
  );
}

export default Login;