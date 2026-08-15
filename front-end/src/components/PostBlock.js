import { resolveMediaUrl } from "../utils/media";

function isEmbeddable(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toEmbedUrl(url) {
  const ytMatch = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

function PostBlock({ block }) {
  const { type, content } = block;

  if (type === "text") {
    return <p className="post-media post-media--text">{content}</p>;
  }

  if (type === "image" || type === "gif") {
    return (
      <div className={`post-media post-media--${type}`}>
        <img src={resolveMediaUrl(content)} alt="" />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="post-media post-media--video">
        {isEmbeddable(content) ? (
          <iframe src={toEmbedUrl(content)} title="vídeo" allowFullScreen />
        ) : (
          <video src={resolveMediaUrl(content)} controls />
        )}
      </div>
    );
  }

  if (type === "link") {
    return (
      <div className="post-media post-media--link">
        <a href={content} target="_blank" rel="noreferrer">↗ {content}</a>
      </div>
    );
  }

  return null;
}

export default PostBlock;