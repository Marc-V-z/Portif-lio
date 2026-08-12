const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { title, description, techs, link } = req.body;
  const result = await pool.query(
    "INSERT INTO projects (title, description, techs, link) VALUES ($1,$2,$3,$4) RETURNING *",
    [title, description, techs, link]
  );
  res.json(result.rows[0]);
});

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM projects");
  res.json(result.rows);
});

module.exports = router;
