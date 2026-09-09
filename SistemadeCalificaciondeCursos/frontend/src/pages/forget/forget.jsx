import "./forget.css";
import { useState } from "react";
import { api } from "../../api";

function Forget() {
    const [form, setForm] = useState({ carnet: "", correo: "", nueva_contrasena: "" });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        try {
            const response = await api.recoverPassword(form);
            setMensaje(response.message || response);
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    return(
        <div className="forget-container">
            <div className="forget-card">
                <h1>Recuperar Contraseña</h1>
                <p>Ingrese los datos solicitados para la recuperación:</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Registro academico" value={form.carnet} onChange={(e) => setForm({ ...form, carnet: e.target.value })} required />
                    <input type="email" placeholder="Correo Electrónico" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
                    {mensaje && <p role="status">{mensaje}</p>}
                    {error && <p role="alert">{error}</p>}
                    <input type="password" placeholder="Nueva Contraseña" value={form.nueva_contrasena} onChange={(e) => setForm({ ...form, nueva_contrasena: e.target.value })} required />
                    <button type="submit">Recuperar</button>
                </form>
            </div>
        </div>
    );
}

export default Forget;