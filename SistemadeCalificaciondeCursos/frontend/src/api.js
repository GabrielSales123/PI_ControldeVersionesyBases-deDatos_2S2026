const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(typeof data === "string" ? data : data.message || "Error en la solicitud");
  }

  return data;
}

export const api = {
  login: (data) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  recoverPassword: (data) => request("/api/auth/recuperar_contrasena", { method: "POST", body: JSON.stringify(data) }),
  getPosts: (query = "") => request(`/publicaciones${query ? `?${query}` : ""}`),
  createPost: (data) => request("/publicaciones", { method: "POST", body: JSON.stringify(data) }),
  getComments: (postId) => request(`/publicaciones/${postId}/comentarios`),
  createComment: (postId, data) => request(`/publicaciones/${postId}/comentarios`, { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request("/perfil"),
  updateProfile: (data) => request("/perfil", { method: "PUT", body: JSON.stringify(data) }),
  getCourses: () => request("/cursos"),
  approveCourse: (curso_id) => request("/aprobar_curso", { method: "POST", body: JSON.stringify({ curso_id }) }),
  removeApprovedCourse: (curso_id) => request(`/eliminar/${curso_id}`, { method: "DELETE" }),
  getProfessors: () => request("/catedraticos")
};
