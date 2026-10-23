// mostra informações completas de um chamado. Permite iniciar o atendimento, resolver, editar ou excluir
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CampoTexto from "../components/CampoTexto";
import Etiquetas from "../components/Etiquetas";
import MensagemErro from "../components/MensagemErro";
import {
  buscarChamado,
  iniciarChamado,
  resolverChamado,
  excluirChamado,
  pegarMensagemErro,
} from "../services/chamadoService";

// Transforma AAAA-MM-DD em DD/MM/AAAA
function formatarData(data) {
  if (!data) {
    return "—";
  }
  const partes = data.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function PaginaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [solucao, setSolucao] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  useEffect(function () {
    carregarChamado();
  }, [id]);

  async function carregarChamado() {
    try {
      const dados = await buscarChamado(id);
      setChamado(dados);
    } catch (e) {
      setErro(pegarMensagemErro(e));
    }
    setCarregando(false);
  }

  async function aoIniciar(evento) {
    evento.preventDefault();
    try {
      await iniciarChamado(id, responsavel);
      setResponsavel("");
      setErro("");
      carregarChamado();
    } catch (e) {
      setErro(pegarMensagemErro(e));
    }
  }

  async function aoResolver(evento) {
    evento.preventDefault();
    try {
      await resolverChamado(id, solucao);
      setSolucao("");
      setErro("");
      carregarChamado();
    } catch (e) {
      setErro(pegarMensagemErro(e));
    }
  }

  async function aoExcluir() {
    try {
      await excluirChamado(id);
      navigate("/");
    } catch (e) {
      setErro(pegarMensagemErro(e));
      setConfirmando(false);
    }
  }

  let conteudo = null;

  if (carregando) {
    conteudo = <p className="aviso">Carregando chamado...</p>;
  } else if (chamado) {
    // Só chamados que não estão resolvidos podem ser editados
    let botaoEditar = null;
    if (chamado.status !== "resolvido") {
      botaoEditar = <Link to={"/editar/" + id} className="botao botao-secundario">Editar</Link>;
    }

    // Confirmação antes de excluir
    let confirmacao = null;
    if (confirmando) {
      confirmacao = (
        <div className="confirmacao">
          <p>Tem certeza que deseja excluir este chamado?</p>
          <div className="acoes">
            <button className="botao botao-perigo" onClick={aoExcluir}>Excluir</button>
            <button className="botao botao-secundario" onClick={function () { setConfirmando(false); }}>Cancelar</button>
          </div>
        </div>
      );
    }

    // Mostra só a ação que vale para o status atual
    let etapa = null;
    if (chamado.status === "aberto") {
      etapa = (
        <form className="etapa" onSubmit={aoIniciar}>
          <h3>Próxima etapa: iniciar atendimento</h3>
          <CampoTexto rotulo="Responsável" valor={responsavel} aoAlterar={setResponsavel} />
          <button type="submit" className="botao">Iniciar</button>
        </form>
      );
    } else if (chamado.status === "em andamento") {
      etapa = (
        <form className="etapa" onSubmit={aoResolver}>
          <h3>Próxima etapa: resolver chamado</h3>
          <CampoTexto rotulo="Solução" tipo="textarea" valor={solucao} aoAlterar={setSolucao} />
          <button type="submit" className="botao">Resolver</button>
        </form>
      );
    }

    conteudo = (
      <div className="detalhe">
        <div className="card-topo">
          <h2>{chamado.titulo}</h2>
          <Etiquetas chamado={chamado} />
        </div>

        <p><strong>Descrição:</strong> {chamado.descricao}</p>
        <p><strong>Tipo:</strong> {chamado.tipo}</p>
        <p><strong>Local:</strong> {chamado.local}</p>
        <p><strong>Aberto em:</strong> {formatarData(chamado.data_abertura)}</p>
        <p><strong>Responsável:</strong> {chamado.responsavel || "—"}</p>
        <p><strong>Solução:</strong> {chamado.solucao || "—"}</p>
        {chamado.data_resolucao ? (
          <p><strong>Resolvido em:</strong> {formatarData(chamado.data_resolucao)}</p>
        ) : null}

        <div className="acoes">
          {botaoEditar}
          <button className="botao botao-perigo" onClick={function () { setConfirmando(true); }}>Excluir</button>
        </div>

        {confirmacao}
        {etapa}
      </div>
    );
  }

  return (
    <div className="pagina-detalhe">
      <Link to="/" className="voltar">← Voltar</Link>
      <MensagemErro mensagem={erro} />
      {conteudo}
    </div>
  );
}

export default PaginaDetalhe;
