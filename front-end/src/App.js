import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import ProjectPage from "./pages/ProjectPage";
import Contact from "./components/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectForm from "./pages/ProjectForm";
import PostEditor from "./pages/PostEditor";

function Nav() {
  const { token, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="container nav__row">
        <Link to="/" className="nav__brand">portfólio</Link>
        <ul className="nav__links">
          <li><Link to="/contact">Contato</Link></li>
          {token ? (
            <>
              <li><Link to="/admin">Admin</Link></li>
              <li><button className="btn btn--small" onClick={logout}>Sair</button></li>
            </>
          ) : (
            <li><Link to="/admin/login">Entrar</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="page">
          <Nav />
          <div className="page__content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projeto/:slug" element={<ProjectPage />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/projeto/novo" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
              <Route path="/admin/projeto/:id/editar" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
              <Route path="/admin/projeto/:projectId/post/novo" element={<PrivateRoute><PostEditor /></PrivateRoute>} />
              <Route path="/admin/post/:id/editar" element={<PrivateRoute><PostEditor /></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;