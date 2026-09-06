import "./registro.css";

function Registro() {
    return(
        <div className="registro-container">
        <div className="registro-card">
            <h1>Registro</h1>
            <p>Ingrese los datos solicitados</p>
            <form>
                <input type="text" placeholder="Registro academico" />
                <input type="text" placeholder="Nombres" />
                <input type="text" placeholder="Apellidos" />
                <input type="email" placeholder="Correo Electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button type="submit">Registrarse</button>
            </form>
        </div>
        </div>
    )
}

export default Registro;