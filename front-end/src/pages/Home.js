import { useEffect, useState } from "react";
import client from "../api/client";
import ProjectCard from "../components/ProjectCard";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    client
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error("Erro ao buscar projetos:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (error) {
    return (
      <div className="container">
        <p className="empty-state">Não foi possível carregar os projetos. Verifique o servidor</p>
      </div>
    );
  }

  return (
    <div className="container">
      {projects.length === 0 ? (
        <p className="empty-state">Nenhum projeto publicado ainda.</p>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;