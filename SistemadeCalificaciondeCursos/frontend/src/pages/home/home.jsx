import "./home.css";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const publicaciones = [
        {
            id: 1,
            usuario: "Juan Pérez",
            curso: "Programación 1",
            catedratico: "Juan Lopez",
            contenido: "Mi opinión sobre el curso es que esta muy interesante :v",
            fecha: "05/09/2026 18:30",
            comentarios: 3
        },
        {
            id: 2,
            usuario: "María López",
            curso: "Matemática 1",
            catedratico: "Ing Garcia",
            contenido: "El curso me pareció interesante debido a que es muy interesante ",
            fecha: "05/09/2026 17:45",
            comentarios: 5
        },
        {
            id: 3,
            usuario: "María López",
            curso: "Matemática 1",
            catedratico: "Ing Garcia",
            contenido: "El curso me pareció interesante debido a que es muy interesante ",
            fecha: "05/09/2026 17:45",
            comentarios: 5
        },
        {
            id: 4,
            usuario: "María López",
            curso: "Matemática 1",
            catedratico: "Ing Garcia",
            contenido: "El curso me pareció interesante debido a que es muy interesante ",
            fecha: "05/09/2026 17:45",
            comentarios: 5
        }
    ];

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
                    />
                </div>

                {/* Filtros */}
                <div className="filtros">

                    <select>
                        <option>Todos los cursos</option>
                        <option>Programación 1</option>
                        <option>Matemática 1</option>
                    </select>

                    <select>
                        <option>Todos los catedráticos</option>
                        <option>XXXXX</option>
                        <option>YYYYY</option>
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

                    {publicaciones.map((publicacion) => (
                        <article className="publicacion" key={publicacion.id}>

                            <h3>{publicacion.usuario}</h3>

                            <p>
                                <strong>Curso:</strong>{" "}
                                {publicacion.curso}
                            </p>

                            <p>
                                <strong>Catedrático:</strong>{" "}
                                {publicacion.catedratico}
                            </p>

                            <p className="mensaje">
                                "{publicacion.contenido}"
                            </p>

                            <div className="publicacion-footer">
                                <span>{publicacion.fecha}</span>

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