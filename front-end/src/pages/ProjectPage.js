import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { resolveMediaUrl } from "../utils/media";
import PostBlock from "../components/PostBlock";

function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    client
      .get(`/projects/${slug}`)
      .then((res) => setProject(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return <div className="container"><p className="empty-state">Projeto não encontrado.</p></div>;
  }

  if (!project) return null;

  const heroStyle = project.background_image
    ? { backgroundImage: `url(${resolveMediaUrl(project.background_image)})` }
    : { "--project-bg": project.background_color || undefined };

  return (
    <div>
      <div className="project-hero" style={heroStyle}>
        <div className="container">
          <h1 className="project-hero__title">{project.title}</h1>
          {project.description && (
            <p className="project-hero__desc">{project.description}</p>
          )}
          {project.github_link && (
            <div className="project-hero__links">
              <a className="btn" href={project.github_link} target="_blank" rel="noreferrer">
                Ver no GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        {project.posts.length === 0 ? (
          <p className="empty-state">Nenhuma atualização publicada ainda.</p>
        ) : (
          <div className="post-feed">
            {project.posts.map((post) => (
              <div className="post" key={post.id}>
                {post.title && <h3 className="post__title">{post.title}</h3>}
                {post.media.map((block) => (
                  <PostBlock key={block.id} block={block} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;