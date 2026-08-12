import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Projects from "./components/Projects";
import AddProject from "./components/AddProject";
import Contact from "./components/Contact";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        {/* Página privada (admin) */}
        <Route path="/login" element={<Login />} />
        <Route path="/add" element={<AddProject />} />
      </Routes>
    </Router>
  );
}

export default App;
