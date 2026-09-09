import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./crearPost.css";

function CrearPost() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState("Curso");
    const [entidad, setEntidad] = useState("");
    const [contenido, setContenido] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevaPublicacion = {
            tipo: tipo,
            entidad: entidad,
            contenido: contenido,
            fecha: new Date().toLocaleString()
        };
        console.log(nuevaPublicacion);
        navigate("/home");
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

                <input
                    type="text"
                    placeholder={
                        tipo === "Curso"
                            ? "Nombre del curso"
                            : "Nombre del catedrático"
                    }
                    value={entidad}
                    onChange={(e) => setEntidad(e.target.value)}
                    required
                />


                <label>Tu opinión</label>

                <textarea
                    placeholder="Escribe tu opinión..."
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />


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