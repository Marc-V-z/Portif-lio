const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  const result = await pool.query(
    "INSERT INTO contacts (name, email, message) VALUES ($1,$2,$3) RETURNING *",
    [name, email, message]
  );
  res.json(result.rows[0]);
});

module.exports = router;
