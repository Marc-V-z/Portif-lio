require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 5,
  idleTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Erro inesperado numa conexão ociosa do pool:", err.message);
});

module.exports = pool;