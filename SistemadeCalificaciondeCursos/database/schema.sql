use informe4_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    carnet VARCHAR(20) NOT NULL UNIQUE,
    cursos_aprobados INT DEFAULT 0,
    cantidad_creditos INT NOT NULL
);
CREATE TABLE catedraticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);  
CREATE TABLE cursos( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo_curso INT NOT NULL UNIQUE,
    catedratico_id INT NOT NULL,
    aprobado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (catedratico_id) REFERENCES catedratico(id)
    
);
CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    catedratico_id INT NOT NULL,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    autor_id INT NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES usuario(id),
    FOREIGN KEY (catedratico_id) REFERENCES catedratico(id),
    CONSTRAINT fk_curso_catedratico
        FOREIGN KEY (catedratico_id) REFERENCES catedratico(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_comentario DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    publicacion_id INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (publicacion_id) REFERENCES publicacion(id)
);

CREATE TABLE cursos_aprobados (
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (curso_id) REFERENCES curso(id),
    PRIMARY KEY (usuario_id, curso_id)
);
