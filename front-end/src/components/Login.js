import React, { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/auth/login", form);
    setToken(res.data.token);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Senha"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
