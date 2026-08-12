import React, { useState } from "react";
import axios from "axios";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/contact", form);
    alert("Mensagem enviada!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <textarea placeholder="Mensagem" onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default Contact;
