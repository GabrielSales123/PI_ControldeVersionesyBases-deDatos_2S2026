import "./home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

function Home() {
    const navigate = useNavigate();
    const [publicaciones, setPublicaciones] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState([]);
    const [buscar, setBuscar] = useState("");
    const [curso, setCurso] = useState("");
    const [catedratico, setCatedratico] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([api.getCourses(), api.getProfessors()])
            .then(([courses, professors]) => {
                setCursos(courses);
                setCatedraticos(professors);
            })
            .catch((requestError) => setError(requestError.message));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams();
        if (buscar) params.set("q", buscar);
        if (curso) params.set("curso_id", curso);
        if (catedratico) params.set("catedratico_id", catedratico);
        api.getPosts(params.toString())
            .then(setPublicaciones)
            .catch((requestError) => setError(requestError.message));
    }, [buscar, curso, catedratico]);

    return (
        <div className="home">

            {/* Barra superior */}
            <header className="navbar">
                <h1>Sistema de Calificación de Cursos</h1>

                <button className="perfil-btn" onClick={() => navigate("/profile")}>
                    Perfil
                </button>
            </header>

            <main className="contenido">

                {/* Buscador */}
                <div className="buscador">
                    <input
                        type="text"
                        placeholder="🔎 Buscar..."
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                    />
                </div>

                {/* Filtros */}
                <div className="filtros">

                    <select value={curso} onChange={(e) => setCurso(e.target.value)}>
                        <option value="">Todos los cursos</option>
                        {cursos.map((item) => <option key={item.id} value={item.id}>{item.nombre_curso}</option>)}
                    </select>

                    <select value={catedratico} onChange={(e) => setCatedratico(e.target.value)}>
                        <option value="">Todos los catedráticos</option>
                        {catedraticos.map((item) => <option key={item.id} value={item.id}>{item.nombres} {item.apellidos}</option>)}
                    </select>

                </div>

                {/* Crear publicación */}
                <button className="crear-btn" onClick={() => navigate("/crearPost")}>
                    + Crear publicación
                </button>

                <hr />

                {/* Publicaciones */}
                <section className="publicaciones">

                    <h2>PUBLICACIONES</h2>
                    {error && <p role="alert">{error}</p>}

                    {publicaciones.map((publicacion) => (
                        <article className="publicacion" key={publicacion.id}>

                            <h3>{publicacion.autor_nombres} {publicacion.autor_apellidos}</h3>

                            <p>
                                <strong>Curso:</strong>{" "}
                                {publicacion.nombre_curso || "No especificado"}
                            </p>

                            <p>
                                <strong>Catedrático:</strong>{" "}
                                {publicacion.catedratico_nombres} {publicacion.catedratico_apellidos}
                            </p>

                            <p className="mensaje">
                                "{publicacion.contenido}"
                            </p>

                            <div className="publicacion-footer">
                                <span>{new Date(publicacion.fecha_publicacion).toLocaleString()}</span>

                                <button onClick={() => navigate("/comentarios", {
                                 state: { publicacion: publicacion }
                                })
                                }>
                                💬 {publicacion.comentarios} comentarios
                                </button>
                            </div>

                        </article>
                    ))}

                </section>

            </main>

        </div>
    );
}

export default Home;