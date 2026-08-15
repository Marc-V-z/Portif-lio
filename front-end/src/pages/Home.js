import { useEffect, useState } from "react";
import client from "../api/client";
import ProjectCard from "../components/ProjectCard";

function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/projects").then((res) => {
      setProjects(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

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
