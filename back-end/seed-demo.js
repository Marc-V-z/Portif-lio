require("dotenv").config();
const pool = require("./db");

const demoProjects = [
  {
    slug: "demo-jogo-plataforma",
    title: "Jogo de Plataforma (demo)",
    description: "Um jogo 2D de plataforma feito como projeto de estudo, com física simples de pulo e colisão.",
    cover_image: "https://placehold.co/600x450/e3a94b/1b1815?text=Jogo",
    background_image: null,
    background_color: "#2c4a3e",
    github_link: "https://github.com",
    posts: [
      {
        title: "Primeira versão jogável",
        media: [
          { type: "text", content: "Consegui fazer o personagem pular e colidir com o chão. Próximo passo: inimigos." },
          { type: "image", content: "https://placehold.co/800x450?text=Captura+de+tela" },
          { type: "link", content: "https://github.com" },
        ],
      },
    ],
  },
  {
    slug: "demo-ilustracoes",
    title: "Ilustrações Digitais (demo)",
    description: "Uma coleção de desenhos digitais feitos ao longo do ano.",
    cover_image: "https://placehold.co/600x450/8c6a4f/f2ede4?text=Arte",
    background_image: null,
    background_color: "#4a3a2c",
    github_link: null,
    posts: [
      {
        title: "Estudo de personagem",
        media: [
          { type: "image", content: "https://placehold.co/800x600?text=Ilustração" },
          { type: "text", content: "Estudo de expressões faciais, feito em uma tarde." },
        ],
      },
      {
        title: null,
        media: [{ type: "gif", content: "https://placehold.co/400x400?text=GIF" }],
      },
    ],
  },
];

async function main() {
  const client = await pool.connect();
  let success = true;

  try {
    await client.query("BEGIN");

    // Remove qualquer dado de demonstração anterior (identificado pelo prefixo no slug)
    await client.query("DELETE FROM projects WHERE slug LIKE 'demo-%'");

    for (const project of demoProjects) {
      const projectResult = await client.query(
        `INSERT INTO projects (slug, title, description, cover_image, background_image, background_color, github_link)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [project.slug, project.title, project.description, project.cover_image, project.background_image, project.background_color, project.github_link]
      );
      const projectId = projectResult.rows[0].id;

      for (const post of project.posts) {
        const postResult = await client.query(
          "INSERT INTO posts (project_id, title) VALUES ($1,$2) RETURNING id",
          [projectId, post.title]
        );
        const postId = postResult.rows[0].id;

        for (let i = 0; i < post.media.length; i++) {
          const block = post.media[i];
          await client.query(
            "INSERT INTO post_media (post_id, type, content, order_index) VALUES ($1,$2,$3,$4)",
            [postId, block.type, block.content, i]
          );
        }
      }
      console.log(`Projeto de demonstração criado: ${project.slug}`);
    }

    await client.query("COMMIT");
    console.log("Dados de demonstração prontos.");
  } catch (err) {
    success = false;
    await client.query("ROLLBACK");
    console.error("Falhou ao criar dados de demonstração:", err.message);
  } finally {
    client.release();
  }

  process.exit(success ? 0 : 1);
}

main();