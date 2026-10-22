import { useState } from "react";
import CampoTexto from "./CampoTexto";
import CampoSelecao from "./CampoSelecao";

function FormularioChamado(props) {
  const chamado = props.chamado;

  const [titulo, setTitulo] = useState(chamado ? chamado.titulo : "");
  const [descricao, setDescricao] = useState(chamado ? chamado.descricao : "");
  const [tipo, setTipo] = useState(chamado ? chamado.tipo : "");
  const [local, setLocal] = useState(chamado ? chamado.local : "");
  const [prioridade, setPrioridade] = useState(chamado ? chamado.prioridade : "");
  const [dataAbertura, setDataAbertura] = useState(chamado ? chamado.data_abertura : "");

  async function aoEnviar(e) {
    e.preventDefault();
    const dados = {
      titulo: titulo,
      descricao: descricao,
      tipo: tipo,
      local: local,
      prioridade: prioridade,
      data_abertura: dataAbertura,
    };

    const salvou = await props.aoSalvar(dados);

    // Ao abrir um chamado novo, limpa o formulário
    if (salvou && !chamado) {
      setTitulo("");
      setDescricao("");
      setTipo("");
      setLocal("");
      setPrioridade("");
      setDataAbertura("");
    }
  }

  return (
    <form className="formulario" onSubmit={aoEnviar}>
      <CampoTexto rotulo="Título" valor={titulo} aoAlterar={setTitulo} />
      <CampoTexto rotulo="Descrição" tipo="textarea" valor={descricao} aoAlterar={setDescricao} />
      <CampoSelecao rotulo="Tipo" textoPadrao="Selecione o tipo" opcoes={props.tipos} valor={tipo} aoAlterar={setTipo} />
      <CampoSelecao rotulo="Local" textoPadrao="Selecione o local" opcoes={props.locais} valor={local} aoAlterar={setLocal} />
      <CampoSelecao rotulo="Prioridade" textoPadrao="Selecione a prioridade" opcoes={props.prioridades} valor={prioridade} aoAlterar={setPrioridade} />
      <CampoTexto rotulo="Data de abertura" tipo="date" valor={dataAbertura} aoAlterar={setDataAbertura} />
      <div className="acoes">
        <button type="submit" className="botao">Salvar</button>
        <button type="button" className="botao botao-secundario" onClick={props.aoCancelar}>Cancelar</button>
      </div>
    </form>
  );
}

export default FormularioChamado;
