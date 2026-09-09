import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./crearPost.css";

function CrearPost() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState("Curso");
    const [entidad, setEntidad] = useState("");
    const [contenido, setContenido] = useState("");
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([api.getCourses(), api.getProfessors()])
            .then(([courses, professors]) => {
                setCursos(courses);
                setCatedraticos(professors);
            })
            .catch((requestError) => setError(requestError.message));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const seleccion = tipo === "Curso"
                ? cursos.find((curso) => String(curso.id) === entidad)
                : catedraticos.find((catedratico) => String(catedratico.id) === entidad);
            await api.createPost({
                contenido,
                catedratico_id: tipo === "Catedrático" ? seleccion.id : null,
                curso_id: tipo === "Curso" ? seleccion.id : null
            });
            navigate("/home");
        } catch (requestError) {
            setError(requestError.message);
        }
    };


    return (
        <div className="crearPost">
        <div className = "crearPost-container">
            <h1>Crear Publicación</h1>
            <form className = "crearPost-form" onSubmit={handleSubmit}>
                <label>¿Qué deseas evaluar?</label>

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="Curso">Curso</option>
                    <option value="Catedrático">Catedrático</option>
                </select>


                <label>
                    {tipo === "Curso"
                        ? "Selecciona el curso"
                        : "Selecciona el catedrático"}
                </label>

                <select value={entidad} onChange={(e) => setEntidad(e.target.value)} required>
                    <option value="">Selecciona una opción</option>
                    {(tipo === "Curso" ? cursos : catedraticos).map((item) => (
                        <option key={item.id} value={item.id}>
                            {tipo === "Curso" ? item.nombre_curso : `${item.nombres} ${item.apellidos}`}
                        </option>
                    ))}
                </select>


                <label>Tu opinión</label>

                <textarea
                    placeholder="Escribe tu opinión..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />
                {error && <p role="alert">{error}</p>}


                <div className="buttons">

                    <button type="button" onClick={() => navigate("/home")}>
                        Cancelar
                    </button>

                    <button type="submit">
                        Publicar
                    </button>

                </div>
            </form>
        </div>
        </div>
    )
}

export default CrearPost;