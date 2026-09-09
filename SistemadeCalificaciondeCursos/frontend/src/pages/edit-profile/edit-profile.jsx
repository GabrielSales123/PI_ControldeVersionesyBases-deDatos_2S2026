import "./edit-profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

function EditProfile() {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [form, setForm] = useState({ nombres: "", apellidos: "", correo: "", contrasena: "" });
    const [cursoSeleccionado, setCursoSeleccionado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        Promise.all([api.getProfile(), api.getCourses()])
            .then(([profile, allCourses]) => {
                setPerfil(profile);
                setCursos(allCourses);
                setForm({ nombres: profile.nombres, apellidos: profile.apellidos, correo: profile.correo || "", contrasena: "" });
            })
            .catch((requestError) => setError(requestError.message))
            .finally(() => setCargando(false));
    }, []);

    const actualizarCampo = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    const actualizarPerfil = async (event) => {
        event.preventDefault();
        setMensaje("");
        setError("");
        try {
            await api.updateProfile(form);
            setMensaje("Perfil actualizado correctamente.");
            setForm({ ...form, contrasena: "" });
            setPerfil({ ...perfil, ...form });
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    const agregarCurso = async () => {
        if (!cursoSeleccionado) return;
        setError("");
        try {
            await api.approveCourse(cursoSeleccionado);
            const curso = cursos.find((item) => String(item.id) === cursoSeleccionado);
            setPerfil({ ...perfil, cursos_aprobados: [...perfil.cursos_aprobados, curso], total_creditos: Number(perfil.total_creditos) + Number(curso.creditos) });
            setCursoSeleccionado("");
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    const eliminarCurso = async (cursoId) => {
        setError("");
        try {
            await api.removeApprovedCourse(cursoId);
            const curso = perfil.cursos_aprobados.find((item) => item.id === cursoId);
            setPerfil({ ...perfil, cursos_aprobados: perfil.cursos_aprobados.filter((item) => item.id !== cursoId), total_creditos: Number(perfil.total_creditos) - Number(curso.creditos) });
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    if (cargando) return <div className="edit-profile-container"><p>Cargando perfil...</p></div>;
    if (!perfil) return <div className="edit-profile-container"><p role="alert">{error}</p></div>;

    const cursosDisponibles = cursos.filter((curso) => !perfil.cursos_aprobados.some((aprobado) => aprobado.id === curso.id));

    return (
        <div className="edit-profile-container">
            <section className="edit-profile-card">
                <button className="edit-profile-back" type="button" onClick={() => navigate("/profile")}>← Volver al perfil</button>
                <h1>Editar perfil</h1>
                <p>Actualiza tus datos y cursos aprobados</p>
                <form onSubmit={actualizarPerfil}>
                    <input name="carnet" type="text" value={perfil.carnet} readOnly />
                    <input name="nombres" type="text" placeholder="Nombres" value={form.nombres} onChange={actualizarCampo} required />
                    <input name="apellidos" type="text" placeholder="Apellidos" value={form.apellidos} onChange={actualizarCampo} required />
                    <input name="correo" type="email" placeholder="Correo electrónico" value={form.correo} onChange={actualizarCampo} required />
                    <input name="contrasena" type="password" placeholder="Nueva contraseña (opcional)" value={form.contrasena} onChange={actualizarCampo} />
                    <button type="submit">Guardar cambios</button>
                </form>
                {mensaje && <p className="edit-profile-message" role="status">{mensaje}</p>}
                {error && <p className="edit-profile-error" role="alert">{error}</p>}
            </section>
            <section className="edit-courses-card">
                <h2>Cursos aprobados</h2>
                {perfil.cursos_aprobados.map((curso) => (
                    <div className="edit-course" key={curso.id}>
                        <span>{curso.nombre_curso} ({curso.creditos} créditos)</span>
                        <button type="button" onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
                    </div>
                ))}
                <strong>Total de créditos: {perfil.total_creditos}</strong>
                <div className="add-course">
                    <select value={cursoSeleccionado} onChange={(event) => setCursoSeleccionado(event.target.value)}>
                        <option value="">Selecciona un curso</option>
                        {cursosDisponibles.map((curso) => <option key={curso.id} value={curso.id}>{curso.nombre_curso}</option>)}
                    </select>
                    <button type="button" onClick={agregarCurso} disabled={!cursoSeleccionado}>Agregar curso</button>
                </div>
            </section>
        </div>
    );
}

export default EditProfile;
