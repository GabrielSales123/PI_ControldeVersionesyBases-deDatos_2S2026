import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Registro from "./pages/registro/registro";
import Forget from "./pages/forget/forget";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/forget" element={<Forget />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;