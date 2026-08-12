import React, { useEffect, useState } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/projects").then((res) => {
      setProjects(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Projetos</h2>
      {projects.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <small>{p.techs}</small>
          <a href={p.link}>Ver mais</a>
        </div>
      ))}
    </div>
  );
}

export default Projects;
