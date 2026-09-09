import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Registro from "./pages/registro/registro";
import Forget from "./pages/forget/forget";
import Home from "./pages/home/home";
import CrearPost from "./pages/crearPost/crearPost";
import Comentarios from "./pages/comentarios/comentarios";
import Profile from "./pages/profile/profile";
import EditProfile from "./pages/edit-profile/edit-profile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/forget" element={<Forget />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crearPost" element={<CrearPost />} />
        <Route path="/comentarios" element={<Comentarios />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;