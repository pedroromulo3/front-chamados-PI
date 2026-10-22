import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormularioChamado from "../components/FormularioChamado";
import MensagemErro from "../components/MensagemErro";
import {
  buscarChamado,
  criarChamado,
  editarChamado,
  listarTipos,
  listarLocais,
  listarPrioridades,
  pegarMensagemErro,
} from "../services/chamadoService";

function PaginaFormulario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = id !== undefined;

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [chamado, setChamado] = useState(null);

  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(function () {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setTipos(await listarTipos());
      setLocais(await listarLocais());
      setPrioridades(await listarPrioridades());
      if (editando) {
        setChamado(await buscarChamado(id));
      }
    } catch (e) {
      setErroCarga(pegarMensagemErro(e));
    }
    setCarregando(false);
  }

  // Devolve true se salvou e false se deu erro
  async function aoSalvar(dados) {
    setErro("");
    setSucesso("");
    try {
      if (editando) {
        await editarChamado(id, dados);
        setSucesso("Chamado atualizado com sucesso!");
      } else {
        await criarChamado(dados);
        setSucesso("Chamado aberto com sucesso!");
      }
      return true;
    } catch (e) {
      setErro(pegarMensagemErro(e));
      return false;
    }
  }

  function aoCancelar() {
    if (editando) {
      navigate("/chamado/" + id);
    } else {
      navigate("/");
    }
  }

  let conteudo;
  if (carregando) {
    conteudo = <p className="aviso">Carregando...</p>;
  } else if (erroCarga) {
    conteudo = <MensagemErro mensagem={erroCarga} />;
  } else if (editando && chamado.status === "resolvido") {
    conteudo = <p className="aviso">Um chamado resolvido não pode ser editado.</p>;
  } else {
    conteudo = (
      <div>
        <MensagemErro mensagem={erro} />
        {sucesso ? <p className="mensagem-sucesso">{sucesso}</p> : null}
        <FormularioChamado
          chamado={chamado}
          tipos={tipos}
          locais={locais}
          prioridades={prioridades}
          aoSalvar={aoSalvar}
          aoCancelar={aoCancelar}
        />
      </div>
    );
  }

  return (
    <div className="pagina-formulario">
      <h2>{editando ? "Editar chamado" : "Abrir chamado"}</h2>
      {conteudo}
    </div>
  );
}

export default PaginaFormulario;
