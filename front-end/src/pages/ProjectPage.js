import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { resolveMediaUrl } from "../utils/media";
import PostBlock from "../components/PostBlock";

function formatPostDate(post) {
  if (!post.created_at) return null;
  const created = new Date(post.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `Criado em ${created}`;
}

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

  const heroStyle = project.theme_image
    ? { backgroundImage: `url(${resolveMediaUrl(project.theme_image)})` }
    : { "--project-bg": project.theme_color || undefined };

  const pageBgStyle = {
    "--page-bg-color": project.page_bg_color || undefined,
    "--page-bg-image": project.page_bg_image ? `url(${resolveMediaUrl(project.page_bg_image)})` : undefined,
    "--page-bg-size": project.page_bg_repeat ? "auto" : "cover",
    "--page-bg-repeat-mode": project.page_bg_repeat ? "repeat" : "no-repeat",
  };

  const feedStyle = { "--project-accent": project.theme_color || undefined };

  return (
    <div className="page-bg" style={pageBgStyle}>
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
          <div className="post-feed" style={feedStyle}>
            {project.posts.map((post) => {
              const dateLabel = formatPostDate(post);
              return (
                <div className="post" key={post.id}>
                  <span className="post__marker">
                    {dateLabel && <span className="post__marker-tooltip">{dateLabel}</span>}
                  </span>
                  {post.title && <h3 className="post__title">{post.title}</h3>}
                  {post.media.map((block) => (
                    <PostBlock key={block.id} block={block} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;