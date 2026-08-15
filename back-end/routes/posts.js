const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

router.use(verifyToken);

// GET /posts/:id - usado pra abrir o formulário de edição no admin
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const postResult = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  const post = postResult.rows[0];

  if (!post) {
    return res.status(404).json({ error: "Post não encontrado" });
  }

  const mediaResult = await pool.query(
    "SELECT id, type, content, order_index FROM post_media WHERE post_id = $1 ORDER BY order_index ASC",
    [id]
  );

  res.json({ ...post, media: mediaResult.rows });
});

// POST /posts - body: { project_id, title, order_index, media: [{type, content, order_index}] }
router.post("/", async (req, res) => {
  const { project_id, title, order_index, media } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: "project_id é obrigatório" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const postResult = await client.query(
      "INSERT INTO posts (project_id, title, order_index) VALUES ($1,$2,$3) RETURNING *",
      [project_id, title || null, order_index || 0]
    );
    const post = postResult.rows[0];

    for (const item of media || []) {
      await client.query(
        "INSERT INTO post_media (post_id, type, content, order_index) VALUES ($1,$2,$3,$4)",
        [post.id, item.type, item.content, item.order_index || 0]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(post);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao criar post" });
  } finally {
    client.release();
  }
});

// PUT /posts/:id - substitui título e todos os blocos de mídia
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, order_index, media } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const postResult = await client.query(
      "UPDATE posts SET title=$1, order_index=$2 WHERE id=$3 RETURNING *",
      [title || null, order_index || 0, id]
    );

    if (postResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Post não encontrado" });
    }

    await client.query("DELETE FROM post_media WHERE post_id = $1", [id]);

    for (const item of media || []) {
      await client.query(
        "INSERT INTO post_media (post_id, type, content, order_index) VALUES ($1,$2,$3,$4)",
        [id, item.type, item.content, item.order_index || 0]
      );
    }

    await client.query("COMMIT");
    res.json(postResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao atualizar post" });
  } finally {
    client.release();
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);
  res.status(204).send();
});

module.exports = router;