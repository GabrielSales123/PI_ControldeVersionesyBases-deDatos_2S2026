## 🎓 Sistema de Calificación de Cursos

## 📖 Descripción

Este repositorio contiene el desarrollo de un **Sistema de Calificación de Cursos**, una plataforma web diseñada para permitir a los usuarios compartir y consultar opiniones relacionadas con cursos y catedráticos.

El sistema permite a los usuarios registrarse, iniciar sesión, visualizar publicaciones y crear opiniones relacionadas con diferentes cursos y catedráticos. Además, cuenta con funcionalidades de búsqueda, filtrado, comentarios y perfil de usuario.

El proyecto está dividido en diferentes componentes que permiten separar las responsabilidades del sistema, incluyendo el **Frontend**, el **Backend** y la **Base de Datos**.

---

## 🎯 Objetivos

- Proporcionar una plataforma para compartir opiniones sobre cursos.

- Permitir la consulta de información relacionada con cursos y catedráticos.

- Facilitar la creación y visualización de publicaciones.

- Implementar funcionalidades de búsqueda y filtrado.

- Permitir la interacción entre usuarios mediante comentarios.

- Gestionar la información de los usuarios dentro del sistema.

- Mantener una estructura organizada mediante la separación entre Frontend, Backend y Base de Datos.

---

# 🖥️ Frontend

El Frontend representa la interfaz con la que interactúan los usuarios. Está desarrollado utilizando **React** y permite la navegación entre las diferentes páginas del sistema.

Entre las principales vistas se encuentran:

- 🔐 Inicio de sesión.

- 📝 Registro de usuarios.

- 🔑 Recuperación de contraseña.

- 🏠 Página principal.

- ➕ Creación de publicaciones.

- 💬 Visualización de comentarios.

- 👤 Perfil de usuario.

- 🔎 Búsqueda de publicaciones.

- 📚 Filtrado por cursos.

- 👨‍🏫 Filtrado por catedráticos.

### Tecnologías utilizadas

- React

- JavaScript

- JSX

- HTML

- CSS

- React Router DOM

---

# ⚙️ Backend

El Backend será el encargado de manejar la lógica del sistema y la comunicación entre el Frontend y la Base de Datos.

Sus principales responsabilidades incluyen:

- Gestión de usuarios.

- Autenticación e inicio de sesión.

- Registro de nuevos usuarios.

- Gestión de publicaciones.

- Gestión de comentarios.

- Consulta de cursos y catedráticos.

- Procesamiento de búsquedas y filtros.

- Comunicación con la Base de Datos.

- Validación de la información enviada por los usuarios.

El Backend permitirá que la información utilizada por el sistema pueda almacenarse y consultarse de forma dinámica.

---

# 🗄️ Base de Datos

La Base de Datos será utilizada para almacenar y organizar la información del sistema.

Entre los principales datos que se gestionarán se encuentran:

- 👤 Información de usuarios.

- 🔐 Credenciales de acceso.

- 📚 Información de cursos.

- 👨‍🏫 Información de catedráticos.

- 📝 Publicaciones realizadas por los usuarios.

- 💬 Comentarios relacionados con las publicaciones.

- ⭐ Calificaciones y opiniones.

La Base de Datos permitirá mantener la información organizada y facilitará la comunicación entre las diferentes funcionalidades del sistema.

### Tecnología de Base de Datos

- **MySQL**

---

## 🛠️ Tecnologías Utilizadas

### Frontend

- React

- JavaScript

- JSX

- HTML

- CSS

- React Router DOM

### Backend

- En proceso de integración.

### Base de Datos

- MySQL

### Control de Versiones

- Git

- GitHub

---

## 📁 Estructura del Proyecto

```text
PI_ControldeVersionesyBases-deDatos_2S2026
│
├── SistemadeCalificaciondeCursos
│   │
│   ├── frontend
│   │   │
│   │   ├── src
│   │   │   ├── pages
│   │   │   │   ├── login
│   │   │   │   ├── registro
│   │   │   │   ├── forget
│   │   │   │   ├── home
│   │   │   │   ├── profile
│   │   │   │   └── comentarios
│   │   │   │
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   │
│   │   ├── public
│   │   └── package.json
│   │
│   ├── backend
│   │
│   └── database
│
└── README.md
```

---

## 🚀 Instalación y Ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/GabrielSales123/PI_ControldeVersionesyBases-deDatos_2S2026.git
```

### 2️⃣ Entrar a la carpeta del Frontend

```bash
cd PI_ControldeVersionesyBases-deDatos_2S2026/SistemadeCalificaciondeCursos/frontend
```

### 3️⃣ Instalar las dependencias

```bash
npm install
```

### 4️⃣ Ejecutar el proyecto

```bash
npm run dev
```

Después, abre en tu navegador la dirección proporcionada por la terminal.

Generalmente:

```text
http://localhost:5173/
```

---

## 🌿 Estrategia de Ramas

El repositorio utiliza ramas para mantener organizado el desarrollo del proyecto.

### `main`

Contiene las versiones principales del proyecto.

### `development`

Rama utilizada para integrar las diferentes funcionalidades desarrolladas antes de incorporarlas a la rama principal.

### `feature/...`

Las funcionalidades se desarrollan en ramas independientes para evitar afectar directamente el código principal.

El flujo de trabajo utilizado es:

```text
feature → development → main
```

---