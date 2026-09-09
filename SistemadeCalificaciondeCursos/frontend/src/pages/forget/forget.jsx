import "./forget.css";

function Forget() {
    return(
        <div className="forget-container">
            <div className="forget-card">
                <h1>Recuperar Contraseña</h1>
                <p>Ingrese los datos solicitados para la recuperación:</p>
                <form>
                    <input type="text" placeholder="Registro academico" />
                    <input type="email" placeholder="Correo Electrónico" />
                    <button type="submit">Recuperar</button>
                </form>
            </div>
        </div>
    );
}

export default Forget;