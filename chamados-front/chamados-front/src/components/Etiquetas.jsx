// Mostra o status e a prioridade de um chamado
function Etiquetas(props) {
  const chamado = props.chamado;

  const classeStatus = "etiqueta status-" + chamado.status.replace(" ", "-");

  let classePrioridade = "etiqueta prioridade";
  if (chamado.prioridade === "alta") {
    classePrioridade = "etiqueta prioridade-alta";
  }

  return (
    <div className="etiquetas">
      <span className={classeStatus}>{chamado.status}</span>
      <span className={classePrioridade}>{chamado.prioridade}</span>
    </div>
  );
}

export default Etiquetas;
