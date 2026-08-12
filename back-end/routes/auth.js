const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING *",
    [email, hash]
  );
  res.json(result.rows[0]);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (user.rows.length === 0) return res.status(400).send("Usuário não encontrado");

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(400).send("Senha inválida");

  const token = jwt.sign({ id: user.rows[0].id }, "segredo");
  res.json({ token });
});

module.exports = router;
