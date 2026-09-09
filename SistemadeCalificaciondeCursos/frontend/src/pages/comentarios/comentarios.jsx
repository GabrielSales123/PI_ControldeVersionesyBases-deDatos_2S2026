
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api";
import "./comentarios.css";

function Comentarios() {

    const location = useLocation();
    const navigate = useNavigate();

    // Se recibe la publicacion
    const publicacion = location.state?.publicacion;
    const [comentarios, setComentarios] = useState([]);
    const [contenido, setContenido] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!publicacion?.id) return;
        api.getComments(publicacion.id)
            .then(setComentarios)
            .catch((requestError) => setError(requestError.message));
    }, [publicacion?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createComment(publicacion.id, { contenido });
            setContenido("");
            setComentarios(await api.getComments(publicacion.id));
        } catch (requestError) {
            setError(requestError.message);
        }
    };


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

                {(publicacion.curso) && (
                    <p>
                        <strong>Curso:</strong>{" "}
                        {publicacion.curso}
                    </p>
                )}

                {(publicacion.catedratico) && (
                    <p>
                        <strong>Catedrático:</strong>{" "}
                        {publicacion.catedratico}
                    </p>
                )}

                <p className="mensaje">
                    "{publicacion.contenido}"
                </p>

                <span>{publicacion.fecha_publicacion}</span>

            </article>


            <hr />


            {/* Sección de comentarios */}
            <section className="lista-comentarios">

                <h2>💬 {comentarios.length} comentarios</h2>
                {error && <p role="alert">{error}</p>}
                {comentarios.map((comentario) => (
                    <div className="comentario" key={comentario.id}>
                        <h4>{comentario.autor_nombres} {comentario.autor_apellidos}</h4>
                        <p>{comentario.contenido}</p>
                    </div>
                ))}

            </section>


            {/* Agregar comentario */}

            <form className="agregar-comentario" onSubmit={handleSubmit}>

                <h3>Agregar comentario</h3>

                <textarea
                    placeholder="Escribe un comentario..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />
                <button type="submit">
                    Publicar comentario
                </button>

            </form>

        </div>
    );
}

export default Comentarios;
