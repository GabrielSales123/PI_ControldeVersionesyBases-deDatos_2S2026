import "./registro.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

function Registro() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nombres: "", apellidos: "", carnet: "", correo: "", contrasena: "" });
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setError("");
        try {
            await api.register(form);
            setMensaje("Usuario creado. Redirigiendo al inicio de sesión...");
            setTimeout(() => navigate("/"), 1000);
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    return(
        <div className="registro-container">
        <div className="registro-card">
            <h1>Registro</h1>
            <p>Ingrese los datos solicitados</p>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Registro academico" value={form.carnet} onChange={(e) => setForm({ ...form, carnet: e.target.value })} required />
                <input type="text" placeholder="Nombres" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required />
                <input type="text" placeholder="Apellidos" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required />
                <input type="email" placeholder="Correo Electrónico" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
                <input type="password" placeholder="Contraseña" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required />
                {mensaje && <p role="status">{mensaje}</p>}
                {error && <p role="alert">{error}</p>}
                <button type="submit">Registrarse</button>
            </form>
        </div>
        </div>
    )
}

export default Registro;