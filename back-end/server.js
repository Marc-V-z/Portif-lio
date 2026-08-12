const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/contact", require("./routes/contact"));

app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
