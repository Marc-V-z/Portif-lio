import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/contact`,
      form
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container">
        <p>Mensagem enviada. Obrigado pelo contato!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Contato</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome</label>
          <input onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="field">
          <label>Mensagem</label>
          <textarea onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="btn btn--primary" type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Contact;