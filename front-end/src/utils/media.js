const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function resolveMediaUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${API_URL}${url}`;
}