function CampoSelecao(props) {

  function aoEscolher(evento) {
    props.aoAlterar(evento.target.value);
  }

  const opcoes = [];
  for (let i = 0; i < props.opcoes.length; i++) {
    const opcao = props.opcoes[i];
    opcoes.push(<option key={opcao} value={opcao}>{opcao}</option>);
  }

  return (
    <div className="campo">
      <label>{props.rotulo}</label>
      <select value={props.valor} onChange={aoEscolher}>
        <option value="">{props.textoPadrao}</option>
        {opcoes}
      </select>
    </div>
  );
}

export default CampoSelecao;
