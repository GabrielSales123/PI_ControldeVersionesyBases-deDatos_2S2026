USE informe4_db;

-- Desactivar temporalmente revisión de foreign keys para limpieza
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE comentarios;
TRUNCATE TABLE cursos_aprobados;
TRUNCATE TABLE publicaciones;
TRUNCATE TABLE cursos;
TRUNCATE TABLE catedraticos;
TRUNCATE TABLE usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- 1. USUARIOS (Contraseñas encriptadas con bcrypt, clave original: "password123")
-- ==========================================================
INSERT INTO usuarios (id, nombres, apellidos, contrasena, carnet, correo, cursos_aprobados, cantidad_creditos) VALUES
(1, 'Gabriel', 'Sales', 'password123', '202012345', 'gabriel@ingenieria.usac.edu.gt', 2, 9),
(2, 'Maria', 'Lopez', 'password123', '201901234', 'maria@ingenieria.usac.edu.gt', 4, 19),
(3, 'Juan', 'Perez', 'password123', '201809876', 'juan@ingenieria.usac.edu.gt', 0, 0);

-- ==========================================================
-- 2. CATEDRÁTICOS
-- ==========================================================
INSERT INTO catedraticos (id, nombres, apellidos) VALUES
(1, 'Carlos', 'Perez'),
(2, 'Alvaro', 'Hernandez'),
(3, 'Claudia', 'Morales'),
(4, 'Edwin', 'Zapeta');

-- ==========================================================
-- 3. CURSOS (Pensum Ingeniería en Ciencias y Sistemas)
-- ==========================================================
INSERT INTO cursos (id, nombre_curso, descripcion, codigo_curso, creditos, catedratico_id, aprobado) VALUES
(1, 'Introducción a la Programación y Computación 1', 'Conceptos básicos de programación, algoritmos y POO', 770, 4, 1, 0),
(2, 'Introducción a la Programación y Computación 2', 'Estructuras de datos básicas, GUI y programación avanzada', 771, 5, 1, 0),
(3, 'Estructuras de Datos', 'Árboles, grafos, tablas hash y complejidad algorítmica', 772, 5, 2, 0),
(4, 'Sistemas Operativos 1', 'Procesos, hilos, concurrencia y administración de memoria', 773, 5, 3, 0),
(5, 'Bases de Datos 1', 'Modelado relacional, SQL, álgebra relacional y transacciones', 774, 5, 2, 0),
(6, 'Matemática de Computo 1', 'Lógica proposicional, teoría de conjuntos y grafos', 960, 4, 4, 0),
(7, 'Lenguajes Formales y de Programación', 'Autómatas finitos, gramáticas y expresiones regulares', 796, 3, 3, 0);

-- ==========================================================
-- 4. CURSOS APROBADOS
-- ==========================================================
-- Usuario 1 (Gabriel): Cursos 1 y 2 (Total: 4 + 5 = 9 créditos)
INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES
(1, 1),
(1, 2);

-- Usuario 2 (Maria): Cursos 1, 2, 3 y 5 (Total: 4 + 5 + 5 + 5 = 19 créditos)
INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES
(2, 1),
(2, 2),
(2, 3),
(2, 5);

-- ==========================================================
-- 5. PUBLICACIONES (Sin fechas especificadas)
-- ==========================================================
INSERT INTO publicaciones (id, contenido, catedratico_id, curso_id, autor_id) VALUES
(1, 'Excelente catedrático para IPC1. Explica muy bien los fundamentos de Java y los proyectos son muy formativos.', 1, 1, 1),
(2, 'Para Estructuras de Datos, recomiendo practicar mucho con árboles AVL y grafos desde el inicio del semestre.', 2, 3, 1),
(3, 'El curso de Bases de Datos 1 con el Ing. Alvaro Hernandez es excelente, mucho SQL práctico y modelado.', 2, 5, 2),
(4, 'En Sistemas Operativos 1 con la Inga. Claudia Morales aprendes a fondo llamadas al sistema y manejo de memoria en C.', 3, 4, 2),
(5, '¿Alguien sabe qué temas entran en el primer parcial de Matemática de Cómputo 1 con el Lic. Zapeta?', 4, 6, 3);

-- ==========================================================
-- 6. COMENTARIOS (Sin fechas especificadas)
-- ==========================================================
INSERT INTO comentarios (id, contenido, id_usuario, publicacion_id) VALUES
(1, 'Totalmente de acuerdo, los laboratorios ayudan bastante a fijar los conceptos.', 2, 1),
(2, '¿Qué libro recomiendan como apoyo para los árboles B y AVL?', 3, 2),
(3, 'El libro de Joyanes Aguilar o Cormen (CLRS) son las mejores referencias.', 1, 2),
(4, 'Viene lógica proposicional, tablas de verdad y demostraciones por inducción.', 1, 5);
