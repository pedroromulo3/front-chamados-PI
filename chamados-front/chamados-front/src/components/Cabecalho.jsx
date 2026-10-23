// nome do sistema e usuário
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { buscarUsuario } from "../services/chamadoService";

function Cabecalho() {
  const [nome, setNome] = useState("");

  useEffect(function () {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const dados = await buscarUsuario();
      setNome(dados.nome);
    } catch (e) {
      setNome("");
    }
  }

  return (
    <header className="cabecalho">
      <Link to="/" className="logo">FixaCampus</Link>
      <span>{nome ? "Olá, " + nome : ""}</span>
    </header>
  );
}

export default Cabecalho;
