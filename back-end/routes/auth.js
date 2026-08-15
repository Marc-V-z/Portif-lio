const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  const admin = result.rows[0];

  if (!admin) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

module.exports = router;