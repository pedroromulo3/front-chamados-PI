function CampoTexto(props) {

  function aoDigitar(evento) {
    const valorDigitado = evento.target.value;
    props.aoAlterar(valorDigitado);
  }

  let entrada;
  if (props.tipo === "textarea") {
    entrada = <textarea rows="4" value={props.valor} onChange={aoDigitar} />;
  } else {
    entrada = <input type={props.tipo || "text"} value={props.valor} onChange={aoDigitar} />;
  }

  return (
    <div className="campo">
      <label>{props.rotulo}</label>
      {entrada}
    </div>
  );
}

export default CampoTexto;
