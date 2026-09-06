import "./profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate(); 
    
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
            <span>202012345</span>
        </div>

        <div className="dato">
            <strong>Nombres:</strong>
            <span>Prueba</span>
        </div>

        <div className="dato">
            <strong>Apellidos:</strong>
            <span>apeprueba</span>
        </div>

        <div className="dato">
            <strong>Correo Electrónico:</strong>
            <span>correo@ejemplo.com</span>
        </div>

        <button className="editar-btn">
            Editar perfil
        </button>
    </section>

    <section className="cursos-aprobados">
        <h3>Cursos Aprobados</h3>

        <div className="curso">
            <span>Matemática 1</span>
            <span>5 créditos</span>
            <button>Eliminar</button>
        </div>

        <div className="curso">
            <span>Programación 1</span>
            <span>4 créditos</span>
            <button>Eliminar</button>
        </div>

        <div className="curso">
            <span>Física 1</span>
            <span>5 créditos</span>
            <button>Eliminar</button>
        </div>

        <p className="total-creditos">
            <strong>Total de créditos:</strong> 14
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