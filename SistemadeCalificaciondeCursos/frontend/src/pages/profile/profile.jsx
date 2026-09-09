import "./profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";

function Profile() {
    const navigate = useNavigate(); 
    const [perfil, setPerfil] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api.getProfile()
            .then(setPerfil)
            .catch((requestError) => setError(requestError.message));
    }, []);

    if (error) return <div className="profile"><p role="alert">{error}</p><button onClick={() => navigate("/")}>Iniciar sesión</button></div>;
    if (!perfil) return <div className="profile"><p>Cargando perfil...</p></div>;
    
    return (
        <div className="profile">
            <header className="navbar">
                <h1>Sistema de Calificación de Cursos</h1>
                <button
                className="volver-btn"
                onClick={() => navigate("/home")}
            >
                ← Volver
            </button>
            </header>
            <main className="profile-content">
    
    

    <h2>Perfil del Usuario</h2>

    <section className="datos-perfil">
        
        <h3>Datos personales</h3>

        <div className="dato">
            <strong>Registro Académico:</strong>
            <span>{perfil.carnet}</span>
        </div>

        <div className="dato">
            <strong>Nombres:</strong>
            <span>{perfil.nombres}</span>
        </div>

        <div className="dato">
            <strong>Apellidos:</strong>
            <span>{perfil.apellidos}</span>
        </div>

        <div className="dato">
            <strong>Correo Electrónico:</strong>
            <span>{perfil.correo || "No disponible"}</span>
        </div>

        <button className="editar-btn">
            Editar perfil
        </button>
    </section>

    <section className="cursos-aprobados">
        <h3>Cursos Aprobados</h3>

        {perfil.cursos_aprobados.map((curso) => <div className="curso" key={curso.id}>
            <span>{curso.nombre_curso}</span>
            <span>{curso.creditos} créditos</span>
        </div>)}

        <p className="total-creditos">
            <strong>Total de créditos:</strong> {perfil.total_creditos}
        </p>

        <button className="agregar-btn">
            + Agregar curso
        </button>
    </section>

</main>
        </div>
    );
}

export default Profile;