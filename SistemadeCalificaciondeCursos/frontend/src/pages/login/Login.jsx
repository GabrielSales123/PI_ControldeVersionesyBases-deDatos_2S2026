import "./Login.css";

function Login() {
  return (
    <div className="login-container">
    <div className="login-card">
      <h1>Iniciar Sesion</h1>
      <p>Bienvenido al sistema de calificacion de cursos</p>
      <p>Inicie los datos para ingresar: </p>

      <form>
          <input type="text" placeholder="Registro Académico" />
        <input type="password" placeholder="Contraseña" />
        <p>
          ¿No tienes una cuenta? <a href="/register">Registrate</a>
          <br />
          ¿Olvidaste tu contraseña? <a href="/forgot-password">Recuperar</a>
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
    </div>
  );
}

export default Login;