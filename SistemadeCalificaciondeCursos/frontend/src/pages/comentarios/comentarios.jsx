
import { useLocation, useNavigate } from "react-router-dom";
import "./comentarios.css";

function Comentarios() {

    const location = useLocation();
    const navigate = useNavigate();

    // Se recibe la publicacion
    const publicacion = location.state?.publicacion;


    // Si alguien entra directamente a la URL
    if (!publicacion) {
        return (
            <div>
                <h2>No se encontró la publicación</h2>

                <button onClick={() => navigate("/home")}>
                    Volver al inicio
                </button>
            </div>
        );
    }


    return (
        <div className="comentarios-page">

            {/* Botón para regresar */}
            <button
                className="volver-btn"
                onClick={() => navigate("/home")}
            >
                ← Volver
            </button>


            <h1>Comentarios</h1>


            {/* Publicación original */}
            <article className="publicacion-detalle">

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

                <span>{publicacion.fecha}</span>

            </article>


            <hr />


            {/* Sección de comentarios */}
            <section className="lista-comentarios">

                <h2>
                    💬 {publicacion.comentarios} comentarios
                </h2>


                {/* Comentarios temporales */}

                <div className="comentario">

                    <h4>Pedro García</h4>

                    <p>
                        Estoy de acuerdo con esta opinión.
                    </p>

                </div>


                <div className="comentario">

                    <h4>Ana Martínez</h4>

                    <p>
                        A mí también me pareció interesante el curso.
                    </p>

                </div>

            </section>


            {/* Agregar comentario */}

            <section className="agregar-comentario">

                <h3>Agregar comentario</h3>

                <textarea
                    placeholder="Escribe un comentario..."
                />
                <button>
                    Publicar comentario
                </button>

            </section>

        </div>
    );
}

export default Comentarios;
