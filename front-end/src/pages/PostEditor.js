import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

const blockTypes = ["text", "image", "gif", "video", "link"];

function emptyBlock() {
  return { type: "text", content: "", order_index: 0 };
}

function PostEditor() {
  const { projectId, id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([emptyBlock()]);
  const [resolvedProjectId, setResolvedProjectId] = useState(projectId);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    client.get(`/posts/${id}`).then((res) => {
      setTitle(res.data.title || "");
      setBlocks(res.data.media.length ? res.data.media : [emptyBlock()]);
      setResolvedProjectId(res.data.project_id);
    });
  }, [id, isEditing]);

  const updateBlock = (index, changes) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...changes } : b)));
  };
  const addBlock = () => setBlocks((prev) => [...prev, emptyBlock()]);
  const removeBlock = (index) => setBlocks((prev) => prev.filter((_, i) => i !== index));

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    const data = new FormData();
    data.append("file", file);
    const res = await client.post("/upload", data);
    updateBlock(index, { content: res.data.url });
    setUploadingIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const media = blocks
      .filter((b) => b.content.trim() !== "")
      .map((b, i) => ({ type: b.type, content: b.content, order_index: i }));

    try {
      if (isEditing) {
        await client.put(`/posts/${id}`, { title, order_index: 0, media });
        navigate(`/admin/projeto/${resolvedProjectId}/editar`);
      } else {
        await client.post("/posts", { project_id: projectId, title, order_index: 0, media });
        navigate(`/admin/projeto/${projectId}/editar`);
      }
    } catch (err) {
      setError("Não foi possível salvar o post.");
    }
  };

  return (
    <div className="container">
      <h2>{isEditing ? "Editar post" : "Novo post"}</h2>
      <form className="form" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Título (opcional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="block-editor">
          {blocks.map((block, index) => (
            <div className="block-row" key={index}>
              <select value={block.type} onChange={(e) => updateBlock(index, { type: e.target.value })}>
                {blockTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="field">
                {block.type === "text" ? (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    placeholder="Texto do bloco"
                  />
                ) : block.type === "image" || block.type === "gif" ? (
                  <>
                    <input
                      type="file"
                      accept={block.type === "gif" ? "image/gif" : "image/*"}
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                    />
                    {uploadingIndex === index && <span className="muted">Enviando...</span>}
                    {block.content && <span className="muted">{block.content}</span>}
                  </>
                ) : block.type === "video" ? (
                  <>
                    <input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder="Cole um link do YouTube/Vimeo..."
                    />
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(index, e.target.files[0])} />
                    {uploadingIndex === index && <span className="muted">Enviando...</span>}
                  </>
                ) : (
                  <input
                    value={block.content}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    placeholder="https://..."
                  />
                )}
              </div>

              <button type="button" className="btn btn--small btn--danger" onClick={() => removeBlock(index)}>Remover</button>
            </div>
          ))}
        </div>

        <button type="button" className="btn btn--small" onClick={addBlock}>+ Adicionar bloco</button>

        {error && <p className="form__error">{error}</p>}
        <button className="btn btn--primary" type="submit">Salvar post</button>
      </form>
    </div>
  );
}

export default PostEditor;