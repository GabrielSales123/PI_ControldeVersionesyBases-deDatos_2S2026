# Manual Oficial de Endpoints & API REST

**Sistema:** Sistema de Calificación de Cursos  
**Host Base:** `http://localhost:3000`  
**Autenticación:** Cookie HTTP-Only `token` (JWT)  
**CORS:** Activado con `credentials: true`

---


> ### REGLA DE ORO PARA EL FRONTEND (Cookies y Credenciales)
> El backend utiliza autenticación basada en una cookie HTTP-Only llamada `token`.  
> Al realizar peticiones con `fetch` desde React / Vite, es **estrictamente obligatorio** incluir la opción `credentials: 'include'`:
> ```javascript
> fetch('http://localhost:3000/publicaciones', {
>   credentials: 'include' // <-- OBLIGATORIO
> })
> ```
> *(O en Axios: `withCredentials: true`)*  
> Si se omite esta propiedad, el navegador no guardará ni enviará la cookie y el backend responderá con error **`401 Unauthorized`** en todas las rutas protegidas.

---

## 1. Autenticación y Cuentas

### 1.1. Iniciar Sesión (Login)
Inicia sesión validando carnet y contraseña. Adjunta la cookie HTTP-Only `token` en el navegador.

- **Método:** `POST`
- **Ruta:** `/api/auth/login`*
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** No

#### Body (JSON):
```json
{
  "carnet": 202012345,
  "contrasena": "password123"
}
```

#### Respuesta Exitosa (`200 OK`):
*(Además de la cookie `token` adjunta en cabeceras de respuesta)*
```json
{
  "message": "Inicio de sesión exitoso",
  "usuario": {
    "nombres": "Josue",
    "apellidos": "Mendoza",
    "carnet": "202402879"
  }
}
```

#### Errores Posibles:
- `400 Bad Request`: "El carnet y la contraseña son requeridos" o "Credenciales invalidas".
- `401 Unauthorized`: "Usuario no encontrado".

---

### 1.2. Registro de Usuario
Registra un nuevo usuario en el sistema. La contraseña se almacena con hash `bcrypt`.

- **Método:** `POST`
- **Ruta:** `/api/auth/register` 
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** No

#### Body (JSON):
```json
{
  "nombres": "Josue",
  "apellidos": "Mendoza",
  "carnet": 202402879,
  "correo": "josue@ingenieria.usac.edu.gt",
  "contrasena": "password123"
}
```

#### Respuesta Exitosa (`201 Created`):
```text
Usuario creado
```

#### Errores Posibles:
- `400 Bad Request`: "Todos los campos son requeridos: nombres, apellidos, carnet, contrasena, correo".
- `400 Bad Request`: "El usuario ya existe".

---

### 1.3. Recuperación de Contraseña
Permite restablecer la contraseña solicitando el Registro Académico (carnet) y el Correo Electrónico. Si coinciden con la base de datos, actualiza la contraseña de forma encriptada.

- **Método:** `POST`
- **Ruta:** `/api/auth/recuperar_contrasena`
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** No

#### Body (JSON):
```json
{
  "carnet": 202402879,
  "correo": "josue@ingenieria.usac.edu.gt",
  "nueva_contrasena": "nuevaClave2026"
}
```

#### Respuesta Exitosa (`200 OK`):
```text
Contraseña restablecida exitosamente
```

#### Errores Posibles:
- `400 Bad Request`: "El registro académico y el correo electrónico son requeridos".
- `400 Bad Request`: "Los datos proporcionados no coinciden con nuestros registros".
- `400 Bad Request`: "La nueva contraseña no puede estar vacía".

---

## 2. Perfiles de Usuario y Búsqueda

### 2.1. Consultar Perfil Propio
Obtiene los datos del usuario logueado, su lista de cursos aprobados y el total de créditos acumulados.

- **Método:** `GET`
- **Ruta:** `/perfil`
- **Requiere Cookie:** Sí (`credentials: 'include'`)

#### Respuesta Exitosa (`200 OK`):
```json
{
  "id": 1,
  "nombres": "Josue",
  "apellidos": "Mendoza",
  "carnet": "202402879",
  "es_propio": true,
  "cursos_aprobados": [
    {
      "id": 1,
      "nombre_curso": "Introducción a la Programación y Computación 1",
      "descripcion": "Conceptos básicos de programación, algoritmos y POO",
      "codigo_curso": 770,
      "creditos": 4,
      "catedratico_id": 1
    },
    {
      "id": 2,
      "nombre_curso": "Introducción a la Programación y Computación 2",
      "descripcion": "Estructuras de datos básicas, GUI y programación avanzada",
      "codigo_curso": 771,
      "creditos": 5,
      "catedratico_id": 1
    }
  ],
  "total_creditos": 9
}
```

---

### 2.2. Editar Perfil Propio
Permite modificar los nombres, apellidos y opcionalmente la contraseña del usuario autenticado. El Registro Académico (carnet) no se puede modificar.

- **Método:** `PUT` *(o `POST /editar_perfil`)*
- **Ruta:** `/perfil`
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** Sí (`credentials: 'include'`)

#### Body (JSON):
```json
{
  "nombres": "Josue Fernando",
  "apellidos": "Mendoza Ramirez",
  "contrasena": "miNuevaContrasenaSegura" 
}
```
*(El campo `contrasena` es opcional; si se envía, se re-encripta antes de guardar)*

#### Respuesta Exitosa (`200 OK`):
```text
Perfil actualizado exitosamente
```

---

### 2.3. Buscar y Consultar Perfil de Tercero
Buscador de perfiles por carnet. Retorna los datos de otro usuario en modo **solo lectura** (`es_propio: false`) junto con sus cursos aprobados y créditos.

- **Método:** `GET`
- **Ruta:** `/perfil/:carnet` *(o `/buscar_usuario/:carnet`)*
- **Ejemplo:** `/perfil/201901234`
- **Requiere Cookie:** Sí (`credentials: 'include'`)

#### Respuesta Exitosa (`200 OK`):
```json
{
  "id": 2,
  "nombres": "Maria",
  "apellidos": "Lopez",
  "carnet": "201901234",
  "es_propio": false,
  "cursos_aprobados": [
    {
      "id": 1,
      "nombre_curso": "Introducción a la Programación y Computación 1",
      "creditos": 4,
      "codigo_curso": 770
    },
    {
      "id": 3,
      "nombre_curso": "Estructuras de Datos",
      "creditos": 5,
      "codigo_curso": 772
    }
  ],
  "total_creditos": 9
}
```

#### Errores Posibles:
- `404 Not Found`: "Usuario no encontrado".

---

## 3. Cursos del Pensum y Cursos Aprobados

### 3.1. Listar Pensum Oficial de Cursos
Devuelve el catálogo de todos los cursos registrados con sus códigos, créditos y catedráticos asignados.

- **Método:** `GET`
- **Ruta:** `/cursos`
- **Requiere Cookie:** Sí

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": 1,
    "nombre_curso": "Introducción a la Programación y Computación 1",
    "descripcion": "Conceptos básicos de programación, algoritmos y POO",
    "codigo_curso": 770,
    "creditos": 4,
    "catedratico_id": 1,
    "nombre_catedratico": "Carlos Perez"
  },
  {
    "id": 3,
    "nombre_curso": "Estructuras de Datos",
    "descripcion": "Árboles, grafos, tablas hash y complejidad",
    "codigo_curso": 772,
    "creditos": 5,
    "catedratico_id": 2,
    "nombre_catedratico": "Alvaro Hernandez"
  }
]
```

---

### 3.2. Listar Cursos Aprobados Propios
- **Método:** `GET`
- **Ruta:** `/cursos_aprobados`
- **Requiere Cookie:** Sí

#### Respuesta Exitosa (`200 OK`):
```json
{
  "cursos_aprobados": [ ... ],
  "total_creditos": 9
}
```

---

### 3.3. Aprobar Curso (Agregar al Expediente)
Agrega un curso al expediente del usuario logueado e incrementa automáticamente sus créditos acumulados.

- **Método:** `POST`
- **Ruta:** `/aprobar_curso` 
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** Sí

#### Body (JSON):
```json
{
  "curso_id": 3
}
```

#### Respuesta Exitosa (`200 OK`):
```text
Curso aprobado exitosamente
```

#### Errores Posibles:
- `400 Bad Request`: "El curso_id es requerido" o "El curso ya ha sido aprobado previamente".
- `404 Not Found`: "Curso no encontrado".

---

### 3.4. Desaprobar Curso (Eliminar del Expediente)
Elimina un curso del expediente del usuario logueado y descuenta automáticamente sus créditos.

- **Método:** `DELETE` *(o `POST /eliminar_curso_aprobado`, `POST /desaprobar_curso`, `DELETE /cursos_aprobados/:curso_id`)*
- **Ruta:** `/eliminar_curso_aprobado`
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** Sí

#### Body (JSON):
```json
{
  "curso_id": 3
}
```

#### Respuesta Exitosa (`200 OK`):
```text
Curso desaprobado exitosamente
```

---

## 4. Muro de Publicaciones (Home)

### 4.1. Obtener Publicaciones del Muro
Retorna todas las publicaciones en orden cronológico (**las más recientes primero**). Incluye el conteo de comentarios por publicación (`comentarios_count`) y soporta **filtros dinámicos**.

- **Método:** `GET`
- **Rutas:** `/` y `/publicaciones`
- **Requiere Cookie:** Opcional (permite consulta directa en el root o con sesión)

#### Parámetros de Consulta (Query Params Opcionales):
| Parámetro | Tipo | Descripción / Ejemplo |
| :--- | :--- | :--- |
| `curso_id` | Número | Filtra por ID exacto de curso (`?curso_id=1`) |
| `catedratico_id` | Número | Filtra por ID exacto de catedrático (`?catedratico_id=2`) |
| `buscar_curso` | Texto | Coincidencia de texto en el nombre del curso (`?buscar_curso=sistemas`) |
| `buscar_catedratico` | Texto | Coincidencia en nombre o apellido del catedrático (`?buscar_catedratico=hernandez`) |
| `buscar` o `q` | Texto | Búsqueda global en contenido, curso o catedrático (`?buscar=algoritmos`) |

#### Ejemplo de llamada combinada:
```http
GET /publicaciones?buscar_curso=bases&buscar_catedratico=alvaro
```

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": 3,
    "contenido": "El curso de Bases de Datos 1 con el Ing. Alvaro Hernandez es excelente, mucho SQL práctico y modelado.",
    "fecha_publicacion": "2026-03-03T15:45:00.000Z",
    "autor_id": 2,
    "autor_nombres": "Maria",
    "autor_apellidos": "Lopez",
    "autor_carnet": "201901234",
    "catedratico_id": 2,
    "catedratico_nombres": "Alvaro",
    "catedratico_apellidos": "Hernandez",
    "curso_id": 5,
    "nombre_curso": "Bases de Datos 1",
    "comentarios_count": 1
  }
]
```

---

### 4.2. Crear Publicación
Permite al usuario autenticado publicar en el muro. Puede ser sobre un profesor (sin curso), sobre un curso (sin profesor), o sobre ambos (al menos uno debe estar presente).

- **Método:** `POST`
- **Ruta:** `/publicaciones`
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** Sí

#### Body (JSON) - Opciones válidas:
**Opción A (Ambos):**
```json
{
  "contenido": "Recomiendo repasar teoría de conjuntos antes del curso con el Lic. Zapeta.",
  "catedratico_id": 4,
  "curso_id": 6
}
```

**Opción B (Solo Profesor, sin curso):**
```json
{
  "contenido": "Excelente catedrático, muy atento con las dudas de los estudiantes.",
  "catedratico_id": 2
}
```

**Opción C (Solo Curso, sin profesor):**
```json
{
  "contenido": "El curso de Estructuras de Datos requiere bastante tiempo de laboratorio.",
  "curso_id": 3
}
```

#### Respuesta Exitosa (`201 Created`):
```text
Publicacion creada
```

---

## 5. Comentarios

### 5.1. Listar Comentarios de una Publicación
- **Método:** `GET`
- **Ruta:** `/publicaciones/:id/comentarios`
- **Ejemplo:** `/publicaciones/3/comentarios`
- **Requiere Cookie:** Sí

#### Respuesta Exitosa (`200 OK`):
```json
[
  {
    "id": 1,
    "contenido": "Totalmente de acuerdo, los ejercicios prácticos son clave.",
    "fecha_comentario": "2026-03-03T16:00:00.000Z",
    "id_usuario": 1,
    "usuario_nombres": "Josue",
    "usuario_apellidos": "Mendoza",
    "usuario_carnet": "202402879",
    "publicacion_id": 3
  }
]
```

---

### 5.2. Agregar Comentario
- **Método:** `POST`
- **Ruta:** `/publicaciones/:id/comentarios`
- **Headers:** `Content-Type: application/json`
- **Requiere Cookie:** Sí

#### Body (JSON):
```json
{
  "contenido": "Excelente recomendación, gracias por compartir."
}
```

#### Respuesta Exitosa (`201 Created`):
```text
Comentario agregado exitosamente
```

---

## 6. Catálogo de Catedráticos

### 6.1. Listar Todos los Catedráticos
Útil para poblar los componentes `<select>` de filtrado o formulario de nueva publicación.

- **Método:** `GET`
- **Ruta:** `/catedraticos`
- **Requiere Cookie:** No

#### Respuesta Exitosa (`200 OK`):
```json
[
  { "id": 1, "nombres": "Carlos", "apellidos": "Perez" },
  { "id": 2, "nombres": "Alvaro", "apellidos": "Hernandez" },
  { "id": 3, "nombres": "Claudia", "apellidos": "Morales" },
  { "id": 4, "nombres": "Edwin", "apellidos": "Zapeta" }
]
```

---

## 7. Usuarios de Prueba Disponibles en Base de Datos

| Carnet | Nombre Completo | Correo Institucional | Contraseña | Cursos Aprobados | Créditos |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `202012345` | Josue Mendoza | `josue@ingenieria.usac.edu.gt` | `password123` | IPC 1, IPC 2 | 9 |
| `201901234` | Maria Lopez | `maria@ingenieria.usac.edu.gt` | `password123` | IPC 1, IPC 2, EDD, BD 1 | 19 |
| `201809876` | Juan Perez | `juan@ingenieria.usac.edu.gt` | `password123` | *(Sin cursos)* | 0 |

---

