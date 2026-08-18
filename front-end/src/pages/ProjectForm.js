import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import client from "../api/client";

const emptyForm = {
  slug: "", title: "", description: "",
  cover_image: "", cover_fit: "cover",
  theme_color: "", theme_image: "",
  page_bg_color: "", page_bg_image: "", page_bg_repeat: false,
  github_link: "",
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
            cover_fit: full.data.cover_fit || "cover",
            theme_color: full.data.theme_color || "",
            theme_image: full.data.theme_image || "",
            page_bg_color: full.data.page_bg_color || "",
            page_bg_image: full.data.page_bg_image || "",
            page_bg_repeat: full.data.page_bg_repeat || false,
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
          <label>Formato da capa</label>
          <div className="toggle-row">
            <button
              type="button"
              className={`btn btn--small ${form.cover_fit === "cover" ? "btn--primary" : ""}`}
              onClick={() => setForm({ ...form, cover_fit: "cover" })}
            >
              Quadro fixo
            </button>
            <button
              type="button"
              className={`btn btn--small ${form.cover_fit === "natural" ? "btn--primary" : ""}`}
              onClick={() => setForm({ ...form, cover_fit: "natural" })}
            >
              Formato da imagem
            </button>
          </div>
        </div>

        <h3>Faixa de tema</h3>
        <div className="field">
          <label>Cor do tema</label>
          <div className="color-field-row">
            <input
              type="color"
              value={form.theme_color || "#2c261e"}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
            />
            <input
              type="text"
              value={form.theme_color}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
              placeholder="#2c261e"
            />
          </div>
        </div>
        <div className="field">
          <label>Imagem na faixa (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload("theme_image", e.target.files[0])} />
          {form.theme_image && <span className="muted">{form.theme_image}</span>}
        </div>

        <h3>Fundo da página</h3>
        <div className="field">
          <label>Cor de fundo da página</label>
          <div className="color-field-row">
            <input
              type="color"
              value={form.page_bg_color || "#1b1815"}
              onChange={(e) => setForm({ ...form, page_bg_color: e.target.value })}
            />
            <input
              type="text"
              value={form.page_bg_color}
              onChange={(e) => setForm({ ...form, page_bg_color: e.target.value })}
              placeholder="#1b1815"
            />
          </div>
        </div>
        <div className="field">
          <label>Imagem de fundo da página (opcional)</label>
          <input type="file" accept="image/*" onChange={(e) => handleUpload("page_bg_image", e.target.files[0])} />
          {form.page_bg_image && <span className="muted">{form.page_bg_image}</span>}
        </div>
        <div className="field checkbox-field">
          <label>
            <input
              type="checkbox"
              checked={form.page_bg_repeat}
              onChange={(e) => setForm({ ...form, page_bg_repeat: e.target.checked })}
            />
            Repetir a imagem como textura (em vez de uma imagem única)
          </label>
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