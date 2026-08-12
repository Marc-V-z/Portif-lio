import React, { useState } from "react";
import axios from "axios";

function AddProject({ token }) {
  const [form, setForm] = useState({ title: "", description: "", techs: "", link: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/projects", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Projeto adicionado!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Título" onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Descrição" onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Tecnologias" onChange={(e) => setForm({ ...form, techs: e.target.value })} />
      <input placeholder="Link" onChange={(e) => setForm({ ...form, link: e.target.value })} />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default AddProject;
