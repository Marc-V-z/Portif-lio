const express = require("express");
const router = express.Router();
const pool = require("../db");
const verifyToken = require("../middleware/auth");

// GET /projects - lista pública (grid da home)
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, slug, title, cover_image FROM projects ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

// GET /projects/:slug - página pública de um projeto, com posts e mídia
router.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  const projectResult = await pool.query("SELECT * FROM projects WHERE slug = $1", [slug]);
  const project = projectResult.rows[0];

  if (!project) {
    return res.status(404).json({ error: "Projeto não encontrado" });
  }

  const postsResult = await pool.query(
    "SELECT * FROM posts WHERE project_id = $1 ORDER BY order_index ASC, created_at DESC",
    [project.id]
  );

  const posts = [];
  for (const post of postsResult.rows) {
    const mediaResult = await pool.query(
      "SELECT id, type, content, order_index FROM post_media WHERE post_id = $1 ORDER BY order_index ASC",
      [post.id]
    );
    posts.push({ ...post, media: mediaResult.rows });
  }

  res.json({ ...project, posts });
});

// Tudo abaixo dessa linha exige token de admin
router.use(verifyToken);

router.post("/", async (req, res) => {
  const { slug, title, description, cover_image, background_image, background_color, github_link } = req.body;

  if (!slug || !title) {
    return res.status(400).json({ error: "slug e title são obrigatórios" });
  }

  const result = await pool.query(
    `INSERT INTO projects (slug, title, description, cover_image, background_image, background_color, github_link)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [slug, title, description, cover_image, background_image, background_color, github_link]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { slug, title, description, cover_image, background_image, background_color, github_link } = req.body;

  const result = await pool.query(
    `UPDATE projects SET slug=$1, title=$2, description=$3, cover_image=$4,
     background_image=$5, background_color=$6, github_link=$7, updated_at=now()
     WHERE id=$8 RETURNING *`,
    [slug, title, description, cover_image, background_image, background_color, github_link, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Projeto não encontrado" });
  }
  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM projects WHERE id = $1", [id]);
  res.status(204).send();
});

module.exports = router;