import { Link } from "react-router-dom";
import { resolveMediaUrl } from "../utils/media";

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projeto/${project.slug}`}
      className="project-card"
      style={{ "--project-accent": project.background_color || undefined }}
    >
      {project.cover_image && (
        <img
          className="project-card__cover"
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