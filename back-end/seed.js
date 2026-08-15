require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./db");

async function main() {
  const [, , email, password] = process.argv;

  if (!email || !password) {
    console.log("Uso: node seed.js seuemail@exemplo.com suaSenha");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO admins (email, password) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password = $2",
    [email, hash]
  );

  console.log(`Admin criado/atualizado: ${email}`);
  process.exit(0);
}

main();