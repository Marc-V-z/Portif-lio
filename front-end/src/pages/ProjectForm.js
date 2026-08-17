import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import client from "../api/client";

const emptyForm = {
  slug: "", title: "", description: "",
  cover_image: "", background_image: "", background_color: "", github_link: "",
};

function ProjectForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    client
      .get("/projects")
      .then((res) => {
        const found = res.data.find((p) => String(p.id) === id);
        if (!found) return;
        return client.get(`/projects/${found.slug}`).then((full) => {
          setForm({
            slug: full.data.slug,
            title: full.data.title,
            description: full.data.description || "",
            cover_image: full.data.cover_image || "",
            background_image: full.data.background_image || "",
            background_color: full.data.background_color || "",
            github_link: full.data.github_link || "",
          });
          setPosts(full.data.posts);
        });
      })
      .catch((err) => console.error("Erro ao carregar projeto:", err));
  }, [id, isEditing]);

  const handleUpload = async (field, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await client.post("/upload", data);
      setForm((f) => ({ ...f, [field]: res.data.url }));
    } catch (err) {
      console.error("Erro no upload:", err);
      setError("Falha ao enviar o arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        await client.put(`/projects/${id}`, form);
        navigate("/admin");
      } else {
        const res = await client.post("/projects", form);
        navigate(`/admin/projeto/${res.data.id}/editar`);
      }
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      setError("Não foi possível salvar. Confira o slug (precisa ser único).");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Excluir este post?")) return;
    try {
      await client.delete(`/posts/${postId}`);
      setPosts((p) => p.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Erro ao excluir post:", err);
    }
  };

  return (
    <div className="container">
      <h2>{isEditing ? "Editar projeto" : "Novo projeto"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Slug (parte da URL, ex: meu-jogo)</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        </div>
        <div className="field">
          <label>Título</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <label>Descrição</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="field">
          <label>Capa (imagem)</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload("cover_image", e.target.files[0])} />
          {form.cover_image && <span className="muted">{form.cover_image}</span>}
        </div>
        <div className="field">
          <label>Imagem de fundo da página (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload("background_image", e.target.files[0])} />
          {form.background_image && <span className="muted">{form.background_image}</span>}
        </div>
        <div className="field">
          <label>Cor de fundo (usada se não tiver imagem de fundo)</label>
          <div className="color-field-row">
            <input
              type="color"
              value={form.background_color || "#2c261e"}
              onChange={(e) => setForm({ ...form, background_color: e.target.value })}
            />
            <input
              type="text"
              value={form.background_color}
              onChange={(e) => setForm({ ...form, background_color: e.target.value })}
              placeholder="#2c261e"
            />
          </div>
        </div>
        <div className="field">
          <label>Link do GitHub (opcional)</label>
          <input value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} />
        </div>
        {error && <p className="form__error">{error}</p>}
        <button className="btn btn--primary" type="submit" disabled={uploading}>
          {uploading ? "Enviando arquivo..." : "Salvar"}
        </button>
      </form>

      {isEditing && (
        <div style={{ marginTop: 48 }}>
          <div className="admin-header">
            <h3>Posts</h3>
            <Link className="btn btn--small btn--primary" to={`/admin/projeto/${id}/post/novo`}>Novo post</Link>
          </div>
          {posts.length === 0 ? (
            <p className="muted">Nenhum post ainda.</p>
          ) : (
            <div className="admin-list">
              {posts.map((post) => (
                <div className="admin-row" key={post.id}>
                  <span className="admin-row__title">{post.title || `Post #${post.id}`}</span>
                  <div className="admin-row__actions">
                    <Link className="btn btn--small" to={`/admin/post/${post.id}/editar`}>Editar</Link>
                    <button className="btn btn--small btn--danger" onClick={() => handleDeletePost(post.id)}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectForm;