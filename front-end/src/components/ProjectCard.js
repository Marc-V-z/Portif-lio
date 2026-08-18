import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../utils/media";

function ProjectCard({ project }) {
  const coverClass = project.cover_fit === "natural"
    ? "project-card__cover project-card__cover--natural"
    : "project-card__cover";

  return (
    <Link
      to={`/projeto/${project.slug}`}
      className="project-card"
      style={{ "--project-accent": project.theme_color || undefined }}
    >
      {project.cover_image && (
        <img
          className={coverClass}
          src={resolveMediaUrl(project.cover_image)}
          alt={project.title}
        />
      )}
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
      </div>
    </Link>
  );
}

export default ProjectCard;