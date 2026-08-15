import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await client.post("/auth/login", form);
      login(res.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <div className="container">
      <h2>Entrar</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="form__error">{error}</p>}
        <button className="btn btn--primary" type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default AdminLogin;