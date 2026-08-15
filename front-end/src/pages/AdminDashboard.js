import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);

  const load = () => {
    client.get("/projects").then((res) => setProjects(res.data));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este projeto e todos os posts dele?")) return;
    await client.delete(`/projects/${id}`);
    load();
  };

  return (
    <div className="container">
      <div className="admin-header">
        <h2>Projetos</h2>
        <Link className="btn btn--primary" to="/admin/projeto/novo">Novo projeto</Link>
      </div>

      {projects.length === 0 ? (
        <p className="empty-state">Nenhum projeto ainda.</p>
      ) : (
        <div className="admin-list">
          {projects.map((project) => (
            <div className="admin-row" key={project.id}>
              <span className="admin-row__title">{project.title}</span>
              <div className="admin-row__actions">
                <Link className="btn btn--small" to={`/projeto/${project.slug}`}>Ver</Link>
                <Link className="btn btn--small" to={`/admin/projeto/${project.id}/editar`}>Editar</Link>
                <button className="btn btn--small btn--danger" onClick={() => handleDelete(project.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;