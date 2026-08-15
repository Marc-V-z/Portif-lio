require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Arquivos enviados via /upload ficam acessíveis aqui
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/posts", require("./routes/posts"));
app.use("/upload", require("./routes/upload"));
app.use("/contact", require("./routes/contact"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));