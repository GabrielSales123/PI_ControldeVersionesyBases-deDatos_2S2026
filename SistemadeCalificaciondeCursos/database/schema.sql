CREATE DATABASE IF NOT EXISTS informe4_db
    DEFAULT CHARACTER SET = 'utf8mb4'
    COLLATE utf8mb4_unicode_ci;
 
USE informe4_db;
 
CREATE TABLE catedraticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL
);
 

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    carnet VARCHAR(20) NOT NULL UNIQUE,
    correo VARCHAR(100),
    cursos_aprobados INT DEFAULT 0,
    cantidad_creditos INT NOT NULL DEFAULT 0
);

CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo_curso INT NOT NULL UNIQUE,
    creditos INT NOT NULL DEFAULT 0,
    catedratico_id INT NOT NULL,
    aprobado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id)
);
 

CREATE TABLE publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    catedratico_id INT DEFAULT NULL,
    fecha_publicacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    autor_id INT NOT NULL,
    curso_id INT DEFAULT NULL,
    FOREIGN KEY (autor_id) REFERENCES usuarios(id),
    FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id),
    CONSTRAINT fk_curso_catedratico
        FOREIGN KEY (catedratico_id) REFERENCES catedraticos(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);
 

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_comentario DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    publicacion_id INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id)
);
 

CREATE TABLE cursos_aprobados (
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id),
    PRIMARY KEY (usuario_id, curso_id)
);
 