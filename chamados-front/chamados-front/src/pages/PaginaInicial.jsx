import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CampoSelecao from "../components/CampoSelecao";
import CardChamado from "../components/CardChamado";
import MensagemErro from "../components/MensagemErro";
import {
  listarChamados,
  listarTipos,
  listarLocais,
  listarPrioridades,
  pegarMensagemErro,
} from "../services/chamadoService";

const listaStatus = ["aberto", "em andamento", "resolvido"];

function PaginaInicial() {
  const [chamados, setChamados] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Carrega as listas dos filtros uma única vez
  useEffect(function () {
    carregarOpcoes();
  }, []);

  // Carrega os chamados sempre que a busca ou algum filtro mudar
  useEffect(function () {
    carregarChamados();
  }, [busca, status, tipo, local, prioridade]);

  async function carregarOpcoes() {
    try {
      setTipos(await listarTipos());
      setLocais(await listarLocais());
      setPrioridades(await listarPrioridades());
    } catch (e) {
      setErro(pegarMensagemErro(e));
    }
  }

  async function carregarChamados() {
    setCarregando(true);
    try {
      // Só envia os filtros que foram preenchidos
      const filtros = {};
      if (busca) filtros.busca = busca;
      if (status) filtros.status = status;
      if (tipo) filtros.tipo = tipo;
      if (local) filtros.local = local;
      if (prioridade) filtros.prioridade = prioridade;

      const dados = await listarChamados(filtros);
      setChamados(dados);
      setErro("");
    } catch (e) {
      setChamados([]);
      setErro(pegarMensagemErro(e));
    }
    setCarregando(false);
  }

  let conteudo;
  if (carregando) {
    conteudo = <p className="aviso">Carregando chamados...</p>;
  } else if (erro) {
    conteudo = <MensagemErro mensagem={erro} />;
  } else if (chamados.length === 0) {
    conteudo = <p className="aviso">Nenhum chamado encontrado.</p>;
  } else {
    const cards = [];
    for (let i = 0; i < chamados.length; i++) {
      cards.push(<CardChamado key={chamados[i].id} chamado={chamados[i]} />);
    }
    conteudo = <div className="lista-chamados">{cards}</div>;
  }

  return (
    <div className="pagina-inicial">
      <div className="titulo-pagina">
        <h2>Chamados</h2>
        <Link to="/novo" className="botao">+ Abrir chamado</Link>
      </div>

      <input
        className="busca"
        type="text"
        placeholder="Buscar por título ou descrição..."
        value={busca}
        onChange={function (e) { setBusca(e.target.value); }}
      />

      <div className="filtros">
        <CampoSelecao rotulo="Status" textoPadrao="Todos" opcoes={listaStatus} valor={status} aoAlterar={setStatus} />
        <CampoSelecao rotulo="Tipo" textoPadrao="Todos" opcoes={tipos} valor={tipo} aoAlterar={setTipo} />
        <CampoSelecao rotulo="Local" textoPadrao="Todos" opcoes={locais} valor={local} aoAlterar={setLocal} />
        <CampoSelecao rotulo="Prioridade" textoPadrao="Todas" opcoes={prioridades} valor={prioridade} aoAlterar={setPrioridade} />
      </div>

      {conteudo}
    </div>
  );
}

export default PaginaInicial;
